/* Protocol and concurrency follow-ups. Models/APIs in snippets are contextual. */
(() => {
const section = window.PRIMERS.find(s => s.id === 'design');
section.sources.push(
  {title: 'HTTP caching (RFC 9111)', url: 'https://www.rfc-editor.org/rfc/rfc9111'},
  {title: 'Apollo Kotlin mutations', url: 'https://www.apollographql.com/docs/kotlin/v5/essentials/mutations'},
  {title: 'GraphQL schemas and deprecation', url: 'https://graphql.org/learn/schema/'},
  {title: 'Data-layer concurrency', url: 'https://developer.android.com/topic/architecture/data-layer'}
);
section.lessons.push(
  {id: 'http-cache-validation', title: 'HTTP caches, ETags & 304', language: 'kotlin',
    summary: 'A fresh cached response may avoid a request. An ETag lets a stale entry be validated with If-None-Match: 304 reuses its body; 200 supplies a replacement. Respect Cache-Control and Vary. Use an HTTP cache implementation for complete protocol handling.',
    useCase: 'Refresh a catalog without downloading the same representation again.',
    code: `// App-specific uncached transport; returns status/body/headers.
// Only send a validator when its matching body is available.
val saved = cache.load(requestKey)
val reply = api.getCatalog(ifNoneMatch = saved?.etag)
val body = when (reply.status) {
    304 -> requireNotNull(saved).body
    200 -> requireNotNull(reply.body)
    else -> throw HttpFailure(reply.status)
}
// Cache policy merges 304 metadata, honors Vary and decides
// whether this body may be stored/reused. Do not cache blindly.
render(body)`,
    pitfall: 'no-cache permits storage but requires validation before reuse. no-store forbids HTTP cache storage; private forbids shared-cache storage, not a user’s private cache. None replaces encryption or account isolation. A 304 is not an empty successful catalog.',
    question: 'Is a Room offline database equivalent to an HTTP cache?',
    answer: 'No. It owns app records and synchronization rules; the HTTP cache owns response reuse. Decide offline retention and privacy separately, rather than accidentally persisting sensitive responses through an application cache.',
    quiz: {question: 'What does a valid 304 response let the client reuse?', options: ['The matching cached representation body', 'Any cached account’s body', 'An empty list'], correct: 0, explanation: 'The validator identifies an existing representation; the response updates validation metadata without resending that body.'}},
  {id: 'graphql-mutation-state', title: 'GraphQL mutations & optimistic UI', language: 'kotlin',
    summary: 'A mutation returns selected data but can also return transport, GraphQL or domain errors. Show a reversible optimistic overlay, then reconcile canonical state. Stable entity keys update normalized records; list membership may still require explicit cache updates or refetching.',
    useCase: 'Make a bookmark toggle feel immediate while a mutation is pending.',
    code: `data class BookmarkState(
    val confirmed: Boolean,
    val pending: Pair<String, Boolean>? = null
) {
    val visible: Boolean get() = pending?.second ?: confirmed
}
// One in-flight toggle per item; queue/disable subsequent toggles.
fun finish(s: BookmarkState, opId: String, serverValue: Boolean?): BookmarkState {
    if (s.pending?.first != opId) return s // Stale response.
    return s.copy(confirmed = serverValue ?: s.confirmed, pending = null)
}
// Pass canonical value on acceptance; null on a known rejection.
// Ambiguous timeout: reconcile; do not assume the write failed.`,
    pitfall: 'A whole-cache snapshot rollback can erase newer edits. Remove only the failed operation’s overlay. HTTP 200 does not prove mutation success; null fields may reflect errors. Repeated non-idempotent mutations need an operation-ID strategy.',
    question: 'How should an app handle a timed-out optimistic mutation?',
    answer: 'Show a pending/uncertain state and reconcile or safely retry using server-supported deduplication. A timeout says the response is unknown, not that the server rejected the change. Keep cancellation distinct from a known business rejection.',
    quiz: {question: 'Why identify an optimistic change by operation ID?', options: ['To make all writes automatically transactional', 'To reconcile or remove that change without overwriting unrelated state', 'To bypass server validation'], correct: 1, explanation: 'An operation-scoped overlay prevents a stale completion or rollback from clobbering another update.'}},
  {id: 'api-evolution', title: 'API compatibility & old clients', language: 'kotlin',
    summary: 'Mobile releases remain installed for months. Prefer additive optional fields, stable semantics and explicit deprecation periods. Keep old operations working while adoption is measured. Treat unknown enum values and cached payloads deliberately; schema changes still need contract tests.',
    useCase: 'Add a delivery state without crashing older clients or mislabeling orders.',
    code: `// App boundary maps wire values; configure decoder compatibility too.
enum class DeliveryState { QUEUED, SENT, UNKNOWN }
fun parseDeliveryState(raw: String): DeliveryState = when (raw) {
    "queued" -> DeliveryState.QUEUED
    "sent" -> DeliveryState.SENT
    else -> DeliveryState.UNKNOWN
}
data class OrderDto(val id: String, val deliveryState: String?)
fun state(dto: OrderDto) = dto.deliveryState
    ?.let(::parseDeliveryState) ?: DeliveryState.UNKNOWN
// Missing/unknown is not proof that an order failed.`,
    pitfall: 'Adding an enum value can break exhaustive generated clients. Adding a required input breaks old callers; removing a selected GraphQL field breaks their queries. Ignoring unknown JSON fields alone does not fix changed types, meaning or nullability.',
    question: 'When can a deprecated endpoint or GraphQL field be removed?',
    answer: 'After an explicit support policy, usage evidence and migration plan justify it. GraphQL @deprecated communicates intent but keeps the field available. A minimum-version gate needs a graceful upgrade path and should not replace compatibility planning.',
    quiz: {question: 'Which change is most likely to break an existing mutation caller?', options: ['Adding an optional field with a safe default', 'Adding a required argument with no default', 'Documenting an existing field'], correct: 1, explanation: 'Old clients do not send the new required argument, so their operation can fail validation.'}},
  {id: 'account-response-races', title: 'Account switching & stale responses', language: 'kotlin',
    summary: 'Cancel account-scoped work and clear visible state on logout. Also guard result application: a request can complete after switching accounts. Capture account identity plus a session generation, and serialize switching with the check-and-write step.',
    useCase: 'Prevent an old profile response from appearing after another user signs in.',
    code: `// Every switch increments generation, even A → B → A.
data class SessionKey(val accountId: String, val generation: Long)
private val gate = Mutex()
private var session: SessionKey? = null

suspend fun refreshProfile() {
    val key = gate.withLock { session } ?: return
    val profile = api.profileFor(key.accountId) // Account-bound credentials.
    gate.withLock {
        if (session == key) store.putProfile(key.accountId, profile)
    }
}
// switchAccount uses the SAME gate to advance generation,
// clear visible state and select account-specific storage.`,
    pitfall: 'Checking only the account ID fails for logout/login to the same account. Checking before a suspending write without coordinating account switching leaves a race. Isolate database, HTTP/image caches, sockets and queued work too.',
    question: 'Why is cancellation alone insufficient?',
    answer: 'Cancellation is cooperative and completion may already be queued. Session generation rejects stale results even after returning to the same account. The account-scoped store and credentials must remain bound to the captured request context.',
    quiz: {question: 'What closes a race between the session check and saving a response?', options: ['A delay before saving', 'Serializing the check-and-write with account switching', 'Comparing only display names'], correct: 1, explanation: 'Both operations must obey the same coordination rule so an account switch cannot occur between checking and applying the result.'}}
);
})();
