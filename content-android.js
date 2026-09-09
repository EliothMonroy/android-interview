/* Contextual Android snippets omit imports and app-specific models. */
window.PRIMERS = [...(window.PRIMERS || []), {
  id: 'android', title: 'Android Primer', subtitle: 'Build resilient UI, from lifecycle to large screens.', icon: '◈',
  sources: [
    {title: 'Android application fundamentals', url: 'https://developer.android.com/guide/components/fundamentals'},
    {title: 'Architecture recommendations', url: 'https://developer.android.com/topic/architecture/recommendations'},
    {title: 'Save UI states', url: 'https://developer.android.com/topic/libraries/architecture/saving-states'},
    {title: 'Adaptive apps', url: 'https://developer.android.com/develop/ui/compose/build-adaptive-apps'},
    {title: 'Vector drawables', url: 'https://developer.android.com/develop/ui/views/graphics/vector-drawable-resources'},
    {title: 'WorkManager', url: 'https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started'},
    {title: 'Performance guide', url: 'https://developer.android.com/topic/performance/overview'}
  ], lessons: [
    {id: 'components', title: 'Components & the manifest', summary: 'Activities host user interaction; services perform work without UI; receivers handle broadcasts; providers expose structured data. The manifest declares components, permissions and entry points.', useCase: 'Explain how tapping a launcher icon or deep link enters an app.', language: 'kotlin',
      code: `// MainActivity must also be declared in AndroidManifest.xml.
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { Text("Interview ready") }
    }
}
// Launcher activity: android:exported="true" plus MAIN/LAUNCHER.
// Internal components: explicitly set exported="false" where possible.`,
      pitfall: 'A Service is not automatically a background thread. Validate inputs to exported components; a manifest permission does not grant a runtime permission.', question: 'Must every app screen be a separate Activity?', answer: 'No. A single Activity can host multiple Compose destinations or Fragments. Components are OS entry points, not a mandatory mapping of screens.', quiz: {question: 'Which component exposes structured data to other apps?', options: ['Activity', 'ContentProvider', 'BroadcastReceiver'], correct: 1, explanation: 'A ContentProvider exposes data through a URI-based interface, with access controlled by permissions.'}},
    {id: 'state-lifecycle', title: 'Lifecycle & state survival', summary: 'An Activity can be recreated. A ViewModel survives configuration changes; saved state restores small UI inputs after system process recreation. Store durable records in a database.', useCase: 'Keep a search query through rotation and restore it after process recreation.', language: 'kotlin',
      code: `class SearchViewModel(
    private val savedState: SavedStateHandle
) : ViewModel() {
    val query = savedState.getStateFlow("query", "")
    fun search(text: String) { savedState["query"] = text }
}
// In a composable:
val query by viewModel.query.collectAsStateWithLifecycle()`,
      pitfall: 'Do not put large objects in saved state or retain an Activity in a ViewModel. onDestroy is not guaranteed on process termination.', question: 'Does remember survive Activity recreation?', answer: 'No. remember retains values across recomposition. rememberSaveable supports saved-state restoration for suitable small values; persistent storage handles durable data.', quiz: {question: 'Which alone survives configuration changes but not process death?', options: ['ViewModel', 'A local variable', 'remember'], correct: 0, explanation: 'The ViewModel instance survives configuration changes. Restoring after process death requires saved state or durable storage.'}},
    {id: 'views', title: 'View-based UI', summary: 'Use Fragments and View Binding for existing View screens. Collect UI state against the view lifecycle and use RecyclerView with DiffUtil for changing lists.', useCase: 'Maintain a mature XML-based app without leaking a destroyed Fragment view.', language: 'kotlin',
      code: `// Inside Fragment.onViewCreated(view, savedInstanceState):
val binding = FragmentFeedBinding.bind(view)
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.items.collect { items ->
            adapter.submitList(items)
            binding.empty.isVisible = items.isEmpty()
        }
    }
}
// adapter is a ListAdapter with a correct DiffUtil.ItemCallback.`,
      pitfall: 'A Fragment outlives its view. Clear a binding field in onDestroyView if you keep one. Do not mutate a list already submitted to ListAdapter.', question: 'Why use viewLifecycleOwner rather than the Fragment lifecycle?', answer: 'The view may be destroyed while the Fragment remains on the back stack. The view lifecycle cancels collection when that UI is gone.', quiz: {question: 'Which update is appropriate for ListAdapter?', options: ['Mutate the submitted list in place', 'Submit a new list snapshot', 'Always rebuild the Activity'], correct: 1, explanation: 'DiffUtil compares snapshots. Mutating the old list can hide the changes it needs to detect.'}},
    {id: 'compose', title: 'Compose & state hoisting', summary: 'Compose describes UI from state. Hoist state to its owner, pass values down and callbacks up, and keep composition free of uncontrolled side effects.', useCase: 'Make a search field reusable, previewable and easy to test.', language: 'kotlin',
      code: `@Composable
fun SearchBox(query: String, onQueryChange: (String) -> Unit) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        label = { Text("Search") },
        modifier = Modifier.fillMaxWidth()
    )
}
// Call from a screen that owns query state.
// Use LaunchedEffect(key) for composition-scoped suspend work.`,
      pitfall: 'Composable bodies may run repeatedly. Do not start network calls directly in them. Effect keys determine cancellation and restart.', question: 'Where should state live?', answer: 'At the lowest common owner that needs to read or change it. Keep simple presentation state local; expose screen state through a ViewModel when business logic is involved.', quiz: {question: 'What should onQueryChange usually do?', options: ['Update the owner’s state', 'Mutate the TextField internals', 'Launch an unmanaged thread'], correct: 0, explanation: 'The owner updates state and Compose renders the new value through unidirectional data flow.'}},
    {id: 'adaptive', title: 'Adaptive & accessible layouts', summary: 'Adapt to available window space, including split screen and foldables. Prefer list-detail panes on wide windows. Support font scaling, insets, meaningful labels and generous touch targets.', useCase: 'Make a feed work on phones, tablets and resizable windows.', language: 'kotlin',
      code: `// Local component example; app navigation can use window size classes.
@Composable
fun FeedLayout(list: @Composable () -> Unit,
               detail: @Composable () -> Unit) {
    BoxWithConstraints(Modifier.fillMaxSize()) {
        if (maxWidth >= 840.dp) {
            Row { Box(Modifier.weight(1f)) { list() }
                  Box(Modifier.weight(1f)) { detail() } }
        } else {
            list() // Navigate to a separate detail destination on selection.
        }
    }
}`,
      pitfall: 'Device model or orientation is not a reliable proxy for usable width. Test large fonts, keyboard visibility and edge-to-edge system bars.', question: 'Why use window space instead of “is tablet”?', answer: 'A tablet in split screen may have a narrow window, while an unfolded device may have ample space. Layout decisions should follow the current space.', quiz: {question: 'What should drive an adaptive layout?', options: ['Physical device marketing category', 'Available window size and posture', 'A fixed portrait assumption'], correct: 1, explanation: 'The usable window can change during the same session.'}},
    {id: 'vectors', title: 'Vectors, images & resources', summary: 'Use VectorDrawable for suitable scalable icons. Android Studio can import supported SVG paths into vector XML; arbitrary SVG files are not native drawable resources. Use raster formats for photos.', useCase: 'Keep icons sharp at multiple densities with accessible descriptions.', language: 'kotlin',
      code: `// res/drawable/ic_bookmark.xml is a VectorDrawable.
@Composable
fun BookmarkAction(onClick: () -> Unit) {
    IconButton(onClick = onClick) {
        Icon(
            painterResource(R.drawable.ic_bookmark),
            contentDescription = stringResource(R.string.save_item)
        )
    }
}
// Decorative images use contentDescription = null.`,
      pitfall: 'SVG filters and other complex features may not convert. Avoid enormous path sets and decode photos near their display size.', question: 'Should every image be a vector?', answer: 'No. Vectors suit simple shapes. Photos and complex artwork are usually better as appropriately sized raster images.', quiz: {question: 'What is the normal route for a simple SVG icon?', options: ['Put any SVG directly in drawable', 'Convert supported paths to VectorDrawable', 'Render it as text'], correct: 1, explanation: 'VectorDrawable uses Android XML. SVG import supports a subset of SVG features.'}},
    {id: 'background', title: 'Background work & cancellation', summary: 'Use WorkManager for persistent, deferrable work with constraints and retries. Use scoped coroutines for work tied to a screen. Choose foreground services only for eligible user-visible work.', useCase: 'Upload queued edits once a network is available, even after the app closes.', language: 'kotlin',
      code: `val request = OneTimeWorkRequestBuilder<SyncWorker>()
    .setConstraints(Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED).build())
    .build()
WorkManager.getInstance(context).enqueueUniqueWork(
    "sync", ExistingWorkPolicy.KEEP, request
)
// SyncWorker extends CoroutineWorker; retry transient failures.
// The worker must re-read durable pending operations.`,
      pitfall: 'WorkManager does not promise exact execution time. A connected network can still fail, and retries require idempotent operations.', question: 'Should a search-as-you-type request use WorkManager?', answer: 'Usually no. Use a lifecycle-scoped coroutine with debounce and cancellation. Persistent scheduling would outlive the immediate interaction.', quiz: {question: 'Which work fits WorkManager?', options: ['An exact animation frame', 'A durable queued upload', 'Every keystroke search'], correct: 1, explanation: 'Queued uploads benefit from persistent scheduling, network constraints and retry support.'}},
    {id: 'performance-testing', title: 'Performance & testing', summary: 'Measure startup and frame timing before optimizing. Keep blocking I/O off the main thread, use lazy lists with stable keys, and test logic separately from UI behavior.', useCase: 'Diagnose a stuttering feed and verify that retry remains usable.', language: 'kotlin',
      code: `@Composable
fun Feed(items: List<Article>) {
    LazyColumn {
        items(items, key = { it.id }) { article ->
            Text(article.title)
        }
    }
}
// Compose UI test; a test rule and screen setup are required:
composeRule.onNodeWithText("Retry").performClick()
composeRule.onNodeWithText("Loaded").assertIsDisplayed()`,
      pitfall: 'suspend does not automatically move blocking work off the main thread. Performance measured in a debug build can be misleading.', question: 'How would you investigate jank?', answer: 'Reproduce on a representative device, inspect a trace, then measure the suspected fix. Use Macrobenchmark for user journeys and unit tests with fakes for logic.', quiz: {question: 'What is the best first step for a slow screen?', options: ['Add caches everywhere', 'Measure a reproducible case', 'Move every function to a thread'], correct: 1, explanation: 'A trace and baseline identify the actual bottleneck and show whether the change helps.'}}
  ]
}, {
  id: 'design', title: 'Mobile System Design Primer', subtitle: 'Reason about data, boundaries and unreliable networks.', icon: '◇',
  sources: [
    {title: 'Offline-first data layer', url: 'https://developer.android.com/topic/architecture/data-layer/offline-first'},
    {title: 'Android app architecture', url: 'https://developer.android.com/topic/architecture'},
    {title: 'Retrofit coroutine support', url: 'https://github.com/square/retrofit/blob/trunk/CHANGELOG.md'},
    {title: 'Apollo Kotlin normalized cache', url: 'https://www.apollographql.com/docs/kotlin/caching/normalized-cache'},
    {title: 'Paging network and database', url: 'https://developer.android.com/topic/libraries/architecture/paging/v3-network-db'},
    {title: 'OAuth native apps (RFC 8252)', url: 'https://www.rfc-editor.org/rfc/rfc8252'}
  ], lessons: [
    {id: 'architecture', title: 'Start with boundaries', summary: 'For a news app, clarify users, core journeys, freshness and offline needs. UI observes screen state; a ViewModel coordinates actions; repositories own data access. Add use cases when logic warrants them.', useCase: 'Sketch an app architecture with replaceable data sources and testable behavior.', language: 'kotlin',
      code: `interface ArticleRepository {
    fun observeArticles(): Flow<List<Article>>
    suspend fun refresh()
}
class FeedViewModel(repo: ArticleRepository) : ViewModel() {
    val articles = repo.observeArticles().stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        emptyList()
    )
}
// Real screen state should distinguish loading, empty and error.`,
      pitfall: 'Do not begin by adding layers without requirements. Avoid passing Activity, SQL or transport models throughout the app.', question: 'What would you clarify before drawing boxes?', answer: 'Primary journeys, expected list sizes, offline reads/writes, freshness, privacy, latency and failure behavior. Those requirements determine the design tradeoffs.', quiz: {question: 'Who should coordinate local and remote data?', options: ['A reusable UI widget', 'A repository', 'The Android manifest'], correct: 1, explanation: 'A repository hides data-source coordination behind an app-facing contract.'}},
    {id: 'offline-sync', title: 'Offline notes & synchronization', summary: 'For a notes app, observe Room as the local source of truth. Save the edit and an outbox operation atomically; a worker uploads later. Choose a conflict policy explicitly, such as server revisions with user resolution.', useCase: 'Let edits survive airplane mode, retries and process termination.', language: 'kotlin',
      code: `// App-specific DAOs; Room database transaction.
suspend fun saveNote(note: NoteEntity) {
    database.withTransaction {
        notes.upsert(note)
        outbox.insert(PendingEdit(
            operationId = UUID.randomUUID().toString(),
            noteId = note.id,
            text = note.text,
            baseRevision = note.revision
        ))
    }
    scheduleSync() // Also reconcile unsent entries at startup.
}`,
      pitfall: 'A retry may reach the server twice. Use stable operation IDs for server deduplication; remove only acknowledged operations. A clock timestamp alone is a weak conflict policy.', question: 'Why must the edit and outbox insert be atomic?', answer: 'Otherwise a crash could persist the edit without any record that it needs uploading, or enqueue an operation for data that was never saved.', quiz: {question: 'What makes retrying an edit safer?', options: ['Generate a new operation ID each retry', 'Reuse a stable idempotency key', 'Assume a timeout means no write'], correct: 1, explanation: 'A server that deduplicates the same key can recognize a repeated operation after a lost response.'}},
    {id: 'rest', title: 'REST & failure handling', summary: 'For a catalog, define resource endpoints and DTOs. Separate transport errors from empty results. Set timeouts, preserve cancellation, and retry only suitable transient failures with bounded backoff.', useCase: 'Fetch a product list with explicit HTTP and network failure handling.', language: 'kotlin',
      code: `// Retrofit; ArticleDto and ArticleApi are app types.
interface ArticleApi {
    @GET("articles")
    suspend fun list(): Response<List<ArticleDto>>
}
suspend fun load(api: ArticleApi): List<ArticleDto> {
    val response = api.list() // IOException can propagate.
    if (!response.isSuccessful) throw HttpException(response)
    return response.body() ?: error("Missing response body")
}
// Repository maps DTOs; UI maps failures to retryable states.`,
      pitfall: 'Do not swallow CancellationException in broad catch blocks. Retrying non-idempotent POST requests blindly can create duplicates.', question: 'When is an empty list different from an error?', answer: 'A successful empty response means no records. A failed request means records are unknown or stale; preserve cached results and communicate refresh failure.', quiz: {question: 'A timed-out POST should be retried how?', options: ['Forever, immediately', 'Only with a deliberate idempotency strategy', 'Always as a GET'], correct: 1, explanation: 'The server may have completed the POST before the response was lost.'}},
    {id: 'graphql', title: 'GraphQL & normalized caching', summary: 'For a profile screen spanning related entities, GraphQL selects needed fields and generates typed models. A normalized cache shares entities across queries when stable keys are configured. Handle partial data and GraphQL errors.', useCase: 'Load a profile and distinguish usable partial content from total failure.', language: 'kotlin',
      code: `// ProfileQuery is generated from a .graphql operation.
val response = apolloClient.query(ProfileQuery(userId)).execute()
val profile = response.data?.user
val errors = response.errors.orEmpty()
when {
    profile != null -> showProfile(profile, hasWarnings = errors.isNotEmpty())
    else -> showError() // Also account for transport exceptions.
}
// showProfile/showError stand for app state updates.`,
      pitfall: 'HTTP 200 does not guarantee a successful GraphQL operation. Cache identity and invalidation need design; GraphQL does not automatically solve offline writes.', question: 'How does normalized caching differ from caching whole responses?', answer: 'It stores identifiable entities separately, allowing multiple queries to refer to the same record. Stable cache keys and field policies determine consistency.', quiz: {question: 'Can a GraphQL response contain both data and errors?', options: ['Yes', 'No, HTTP forbids it', 'Only when offline'], correct: 0, explanation: 'A field can fail while other fields resolve. The screen must decide whether partial data is useful.'}},
    {id: 'pagination', title: 'Feeds, pagination & caches', summary: 'Use cursor pagination for changing feeds. Scope cursors to filters and sort order, deduplicate by ID, and define refresh behavior. Paging with RemoteMediator can coordinate network pages and a Room-backed feed.', useCase: 'Design an infinite feed without skipped rows or cross-filter cache pollution.', language: 'kotlin',
      code: `data class FeedKey(val query: String, val sort: String)
data class Page<T>(val items: List<T>, val nextCursor: String?)

fun merge(existing: List<Article>, page: Page<Article>): List<Article> {
    val byId = LinkedHashMap<String, Article>()
    existing.forEach { byId[it.id] = it }
    page.items.forEach { byId[it.id] = it }
    return byId.values.toList()
}
// Reset items and cursor when FeedKey changes.
// Preserve server order; invalidate when ordering has changed.`,
      pitfall: 'Deduplication cannot fix missing records caused by an unstable backend order. Store remote keys and page rows in one transaction when using a database.', question: 'Why can offset pagination skip an item?', answer: 'An insertion or deletion before the next offset shifts positions between requests. A cursor tied to a stable ordering reduces that risk.', quiz: {question: 'A user changes feed filters. What happens to the old cursor?', options: ['Reuse it for speed', 'Reset it or use a separately keyed feed', 'Increment it'], correct: 1, explanation: 'A cursor belongs to the query and ordering that produced it.'}},
    {id: 'auth', title: 'Authentication & private data', summary: 'For a signed-in app, use a system browser OAuth flow with authorization code and PKCE. Treat the app as a public client. Centralize token refresh, isolate per-user caches and clear private data on logout.', useCase: 'Handle concurrent expired requests without racing refresh or leaking a previous user’s feed.', language: 'kotlin',
      code: `// Illustrative coordinator; production adds expiry skew and errors.
class TokenCoordinator(private val session: Session) {
    private val mutex = Mutex()
    suspend fun freshToken(): String = mutex.withLock {
        if (session.tokenIsExpired()) session.refresh()
        session.accessToken()
    }
}
// Session is app-defined; never log tokens.
// Persist sensitive material with a platform-aware protection strategy.`,
      pitfall: 'Never embed a client secret as proof of app identity. Refresh failure may require sign-in. Protect stored credentials, and cancel account-scoped work when switching users.', question: 'Why serialize refresh?', answer: 'Several requests may discover expiry together. A lock plus an expiry recheck avoids duplicate refreshes and races, particularly when refresh tokens rotate.', quiz: {question: 'Can a secret bundled in a mobile APK remain confidential?', options: ['Yes, if renamed', 'No; native apps are public clients', 'Yes, if Base64 encoded'], correct: 1, explanation: 'Distributed app binaries can be inspected. PKCE protects the authorization-code exchange without relying on a bundled client secret.'}}
  ]
}];
