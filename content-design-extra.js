/* Additional compact mobile system-design exercises; app types are illustrative. */
(() => {
  const section = window.PRIMERS.find(primer => primer.id === 'design');
  section.sources.push(
    {title: 'Bitmap cache budgeting', url: 'https://developer.android.com/topic/performance/graphics/cache-bitmap'},
    {title: 'Location and battery', url: 'https://developer.android.com/develop/sensors-and-location/location/battery'},
    {title: 'Background transfer options', url: 'https://developer.android.com/develop/background-work/background-tasks/data-transfer-options'},
    {title: 'FCM message priority', url: 'https://firebase.google.com/docs/cloud-messaging/customize-messages/setting-message-priority'},
    {title: 'App modularization', url: 'https://developer.android.com/topic/modularization'},
    {title: 'Android vitals', url: 'https://developer.android.com/topic/performance/vitals'}
  );
  section.lessons.push(
    {id: 'chat-delivery', title: 'Chat: ordering, ACKs & reconnect', language: 'kotlin',
      summary: 'Persist an optimistic message with a client-generated ID. The server deduplicates retries and assigns conversation order. Distinguish queued, accepted, delivered and read; reconnect by fetching events after a durable cursor.',
      useCase: 'Design a conversation that recovers after a sent message receives no response.',
      code: `data class Ack(val clientId: String, val sequence: Long)
// App-defined database/API; server deduplicates clientId.
suspend fun sendPending(message: PendingMessage) {
    val ack = api.send(message.clientId, message.text)
    database.withTransaction {
        messages.markAccepted(ack.clientId, ack.sequence)
        outbox.remove(ack.clientId)
    }
}
// On reconnect, fetch after the last contiguous saved sequence.
// Merge replayed events by ID, then advance cursor atomically.`,
      pitfall: 'A send timeout does not prove failure. Device clocks cannot reliably order participants. Detect sequence gaps; a send ACK alone must not move the replay cursor past missing incoming events.',
      question: 'How do you avoid duplicate messages after a lost ACK?',
      answer: 'Retry the same persisted client ID. The server returns the existing result for that ID. Reconcile optimistic and canonical records; server acceptance and recipient delivery remain separate states.',
      quiz: {question: 'A send ACK is lost. What should the retry reuse?', options: ['A fresh timestamp as the message identity', 'The persisted client message ID', 'The last incoming message ID'], correct: 1, explanation: 'A stable client ID lets the server deduplicate and the client reconcile the pending message.'}},
    {id: 'image-pipeline', title: 'Image feeds & cache budgets', language: 'kotlin',
      summary: 'An image pipeline checks memory, disk and network, decodes near display size, and cancels obsolete requests. Key transformed images by identity, version and size. Bound cache bytes and prefetch distance; use a maintained loader in production.',
      useCase: 'Keep a photo feed smooth on a memory-constrained phone.',
      code: `// Android LruCache; budget is selected after measurement.
class BitmapCache(budgetBytes: Int) : LruCache<String, Bitmap>(budgetBytes) {
    override fun sizeOf(key: String, value: Bitmap): Int = value.byteCount
}
data class ImageKey(
    val accountId: String,
    val contentId: String,
    val version: String,
    val widthPx: Int,
    val heightPx: Int
)
val decodedBytes = 1080L * 1080 * 4 // Approx. ARGB_8888 pixels.
// Disk/network I/O and decoding belong off the main thread.`,
      pitfall: 'Compressed download bytes differ from decoded bitmap memory. Unbounded prefetch can evict visible images. A cache is evictable; an explicit offline download needs durable ownership and a storage policy.',
      question: 'Why include requested size and version in a cache key?',
      answer: 'Different sizes may need different decoded outputs, and a new version must not reuse stale pixels. Account scoping also helps isolate private media; clear corresponding entries on logout.',
      quiz: {question: 'Which best estimates a 1000 × 1000 ARGB_8888 bitmap’s pixel storage?', options: ['Its JPEG file size', 'About 4 million bytes', 'Exactly 1000 bytes'], correct: 1, explanation: 'Four bytes per pixel gives about 4 MB, excluding overhead and additional copies.'}},
    {id: 'maps-location', title: 'Maps, location & battery', language: 'kotlin',
      summary: 'Fetch map content by viewport and zoom, debounce gestures and discard stale responses. Match location accuracy and update frequency to the journey. Nearby discovery can accept coarse or manual location; active navigation has different requirements.',
      useCase: 'Design a nearby-places screen that remains useful when location permission is denied.',
      code: `// Google Play services location; permission handling is separate.
val request = LocationRequest.Builder(
    Priority.PRIORITY_BALANCED_POWER_ACCURACY,
    60_000L
).setMinUpdateIntervalMillis(30_000L).build()
// Illustrative foreground screen subscription:
fusedLocationClient.requestLocationUpdates(
    request, callback, Looper.getMainLooper()
)
// Call when the screen no longer needs updates:
fusedLocationClient.removeLocationUpdates(callback)
// Offer manual area search and check location age/accuracy.`,
      pitfall: 'An update interval is a request, not a delivery guarantee. Do not require precise or background location for a feature that can work without it. Avoid querying on every map animation frame.',
      question: 'How does a map screen avoid showing an old viewport response?',
      answer: 'Associate requests with a viewport key or generation. Cancel obsolete work and apply results only to the current key. Cache nearby regions with expiry, and use clustering or server aggregation at wide zooms.',
      quiz: {question: 'What is the best default for simple nearby browsing?', options: ['Continuous highest-accuracy background tracking', 'The least accuracy and frequency that satisfy the feature', 'Fail whenever precise location is unavailable'], correct: 1, explanation: 'Accuracy, frequency and delivery latency trade against battery use; manual or coarse search may be sufficient.'}},
    {id: 'resumable-media', title: 'Resumable uploads & downloads', language: 'kotlin',
      summary: 'Persist transfer identity, local file access and progress. Resume against a server-confirmed offset, stream bounded chunks and verify completion. Choose scheduling by urgency: deferrable work, user-initiated transfers and media playback have different platform APIs.',
      useCase: 'Upload a large attachment across network changes without starting over.',
      code: `// Illustrative resumable protocol and durable source access.
suspend fun upload(id: String, source: SeekableSource) {
    var offset = api.confirmedOffset(id)
    while (offset < source.size) {
        currentCoroutineContext().ensureActive()
        val chunk = source.readAt(offset, maxBytes = 256 * 1024)
        check(chunk.isNotEmpty())
        val next = api.putChunk(id, offset, chunk)
        check(next > offset && next <= source.size)
        transfers.saveOffset(id, next)
        offset = next
    }
    api.finishAndVerify(id)
}`,
      pitfall: 'A saved local offset may lag the server after a crash. Keep permission to the source URI or a managed copy, cap retries, handle expired sessions, and never load an entire large file into memory.',
      question: 'What makes a download resumable safely?',
      answer: 'Persist the partial file and stable resource version. Use a server-supported range request and validate its response; restart if the content changed or ranges are unsupported. Publish the completed file only after integrity checks.',
      quiz: {question: 'Which offset is authoritative after a lost chunk response?', options: ['Bytes the UI tried to send', 'The server-confirmed offset', 'Always zero'], correct: 1, explanation: 'The server may already have accepted the chunk even though the client did not receive its response.'}},
    {id: 'realtime-transport', title: 'Push, sockets & polling', language: 'kotlin',
      summary: 'Use a socket for low-latency bidirectional interaction while needed. Push can signal background changes or user-visible events; polling can fit relaxed freshness needs. All transports feed the same durable synchronization path.',
      useCase: 'Keep chat fresh in the foreground and recover after the app is backgrounded.',
      code: `// Illustrative app policy, not an Android execution exemption.
enum class Transport { SOCKET, POLL, PUSH_HINT }
fun transport(visible: Boolean, interactive: Boolean): Transport = when {
    !visible -> Transport.PUSH_HINT
    interactive -> Transport.SOCKET
    else -> Transport.POLL
}
suspend fun onReconnect() {
    val cursor = events.lastDurableCursor()
    sync.fetchAndStoreAfter(cursor)
}
// Reconnect with bounded exponential backoff + jitter.`,
      pitfall: 'Neither push delivery nor a socket provides exactly-once application effects. Background execution restrictions still apply. High-priority FCM is for time-sensitive user-visible content, not a continuous sync loophole.',
      question: 'Should a push payload be the sole source of truth?',
      answer: 'Usually treat it as a hint to reconcile canonical data. Messages can be delayed, duplicated or missed; startup and reconnect sync must recover independently. Protect sensitive notification content.',
      quiz: {question: 'What repairs data missed during disconnection?', options: ['Assuming every push arrived', 'A durable cursor and replay/reconciliation API', 'Keeping all events only in RAM'], correct: 1, explanation: 'A durable checkpoint lets the app request changes after its last saved position.'}},
    {id: 'data-budgets', title: 'Scale feeds with explicit budgets', language: 'kotlin',
      summary: 'Scale the client by bounding page sizes, decoded images, retained rows and concurrent requests. Prefer server thumbnails and conditional refreshes. Bigger pages reduce request overhead but increase latency, wasted data and memory pressure.',
      useCase: 'Explain pagination and prefetch choices for a feed on slow or metered networks.',
      code: `data class FeedBudget(
    val pageSize: Int,
    val prefetchItems: Int,
    val concurrentImages: Int
)
fun budget(dataSaver: Boolean) = if (dataSaver) {
    FeedBudget(pageSize = 15, prefetchItems = 2, concurrentImages = 2)
} else {
    FeedBudget(pageSize = 30, prefetchItems = 6, concurrentImages = 4)
}
// Illustrative starting points, not universal constants.
val sessionBytes = 5L * 30 * 2_000 // Five pages of metadata.
// Add image bytes separately; measure actual user journeys.`,
      pitfall: 'Increasing client concurrency can worsen contention and server load. Bounded memory does not imply bounded disk: add expiry/eviction while preserving pinned downloads and unsynced edits.',
      question: 'Which measurements would tune a page size?',
      answer: 'Time to first content, scroll stalls, bytes wasted after navigation, memory peaks, cache hit rate and request overhead on representative devices and networks. Optimize for the product’s actual freshness and data constraints.',
      quiz: {question: 'What is a downside of aggressively prefetching many pages?', options: ['It eliminates all network failures', 'It can waste bandwidth and evict useful cache entries', 'It guarantees lower memory use'], correct: 1, explanation: 'Prefetched content may never be viewed and still consumes network, memory or disk budgets.'}},
    {id: 'observability-rollout', title: 'Observe, test & roll out safely', language: 'kotlin',
      summary: 'Instrument user journeys with latency, failure and freshness metrics. Track crash/ANR and device/network segments. Test interruption, duplicates and old client compatibility, then release gradually with a rollback or feature-disable path.',
      useCase: 'Validate an offline sync redesign without hiding failures behind successful HTTP requests.',
      code: `// App-defined metrics; never include tokens or message bodies.
suspend fun refreshMeasured() {
    val start = SystemClock.elapsedRealtime()
    var outcome = "success"
    try {
        repository.refresh()
    } catch (e: CancellationException) {
        outcome = "cancelled"
        throw e
    } catch (e: Exception) {
        outcome = "failure"
        throw e
    } finally {
        metrics.refresh(outcome, SystemClock.elapsedRealtime() - start)
    }
}`,
      pitfall: 'An average can hide bad tail latency. Do not log private payloads or unbounded identifiers as metric labels. A feature flag cannot reverse a destructive database migration; preserve compatibility deliberately.',
      question: 'What belongs in a sync failure test matrix?',
      answer: 'Disconnect before and after server acceptance, terminate between persistence steps, replay duplicates, expire credentials, switch accounts and migrate old databases. Assert durable invariants, such as no lost local edit and no duplicate logical effect.',
      quiz: {question: 'Which metric exposes a growing offline-write backlog?', options: ['App icon taps alone', 'Age of the oldest unacknowledged operation', 'Only average HTTP status'], correct: 1, explanation: 'Backlog age reflects whether user changes are reaching durable acknowledgement, even if some requests succeed.'}},
    {id: 'module-boundaries', title: 'Modules & dependency direction', language: 'kotlin',
      summary: 'Use modules when boundaries, ownership or build needs justify them. Features depend on small contracts; data implementations depend on those contracts too. The application composes implementations. Keep the dependency graph acyclic.',
      useCase: 'Let a chat feature be tested without constructing its database and HTTP stack.',
      code: `// :core:messages-api
interface MessageRepository {
    fun observe(threadId: String): Flow<List<Message>>
}
// :feature:chat depends on :core:messages-api
class ObserveConversation(private val repository: MessageRepository) {
    operator fun invoke(id: String) = repository.observe(id)
}
// :data:messages implements the contract; app wires dependencies.
// Gradle Kotlin DSL for :feature:chat:
// dependencies { implementation(project(":core:messages-api")) }
// Keep implementation helpers internal to their owning module.`,
      pitfall: 'A module per class adds build and maintenance overhead. Shared modules can become dumping grounds. Exposing Room entities or HTTP response types through contracts couples features to implementation details.',
      question: 'When would you add a domain/use-case layer?',
      answer: 'When reusable or complex business rules benefit from a separate owner. A simple repository call may not need a wrapper. Explain the testability and ownership benefit against the extra indirection.',
      quiz: {question: 'Who should select the concrete repository implementation?', options: ['Every composable independently', 'The app composition/DI boundary', 'The transport DTO'], correct: 1, explanation: 'Central wiring keeps consumers dependent on contracts and makes substitutions explicit.'}},
    {id: 'conflict-deletion', title: 'Conflicts, tombstones & sync', language: 'kotlin',
      summary: 'Send an edit with its base server revision. On mismatch, merge according to domain rules or ask the user. Represent deletions as versioned tombstones so offline clients can learn them; define retention and full-resync rules.',
      useCase: 'Prevent an old offline device from silently restoring a deleted shared note.',
      code: `data class NoteVersion(
    val id: String, val revision: Long,
    val text: String?, val deleted: Boolean
)
sealed interface EditResult {
    data class Saved(val note: NoteVersion) : EditResult
    data class Conflict(val remote: NoteVersion) : EditResult
}
fun canApply(baseRevision: Long, current: NoteVersion): Boolean =
    baseRevision == current.revision
// Server performs revision check + write atomically.
// A stale edit against a tombstone is a conflict, not an insert.`,
      pitfall: 'Wall-clock last-write-wins can lose edits when clocks differ. Tombstones cannot be dropped arbitrarily: clients older than the retention boundary need a snapshot reset. Preserve pending local edits during that reset.',
      question: 'Does every collaborative app need a CRDT?',
      answer: 'No. Server serialization or revision checks with explicit resolution may satisfy the product. CRDTs help selected concurrent merge problems but require suitable data types, metadata, deletion rules and complexity tradeoffs.',
      quiz: {question: 'Why retain a deletion tombstone?', options: ['To inform offline replicas that an entity was deleted', 'To avoid ever syncing again', 'To make clock timestamps perfectly ordered'], correct: 0, explanation: 'Without deletion history, an offline replica can mistake an absent record for one that should be uploaded again.'}},
    {id: 'design-walkthrough', title: 'A system design interview walkthrough', language: 'kotlin',
      summary: 'For “design a photo feed,” clarify journeys and constraints first. Sketch UI → state owner → repository → database/API, then walk through launch, refresh, offline use and upload. Estimate scale with stated assumptions and investigate the riskiest path.',
      useCase: 'Structure a discussion around decisions, rough capacity and failure recovery.',
      code: `// Hypothetical requirements: label assumptions, then refine.
data class Usage(val dailyUsers: Long, val opensPerDay: Int)
val usage = Usage(dailyUsers = 100_000, opensPerDay = 5)
val requestsPerDay = usage.dailyUsers * usage.opensPerDay
val averageRps = requestsPerDay / 86_400.0 // About 5.8.
val peakRps = averageRps * 10 // Assumed peak multiplier.
val metadataBytesPerSession = 30L * 2_000 // ~60 KB/page.
val imageBytesPerSession = 10L * 80_000 // ~800 KB thumbnails.
// Does not include retries, extra pages, headers or uploads.
// Server request load and device memory are separate budgets.`,
      pitfall: 'User count alone does not determine requests per second. State your access pattern and units. Do not spend the entire discussion on backend boxes while omitting lifecycle, device storage, permissions and unreliable networks.',
      question: 'What would your final design recap cover?',
      answer: 'Requirements and exclusions, data ownership, API/sync contract, one end-to-end journey, failure handling, resource budgets, tradeoffs and measurements. Identify what changes if freshness, scale or offline-writing needs increase.',
      quiz: {question: 'What should happen before selecting storage and transports?', options: ['Choose the most complex stack available', 'Clarify journeys, constraints and failure expectations', 'Promise exactly-once delivery'], correct: 1, explanation: 'The requirements determine whether those implementation choices are appropriate.'}}
  );
})();
