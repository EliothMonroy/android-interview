/* Contextual Android snippets omit imports and app-specific models. */
window.PRIMERS = [...(window.PRIMERS || []), {
  id: 'android', title: 'Android Primer', subtitle: 'Build resilient UI, from lifecycle to large screens.', icon: '◈',
  sources: [
    {title: 'Android application fundamentals', url: 'https://developer.android.com/guide/components/fundamentals'},
    {title: 'Architecture recommendations', url: 'https://developer.android.com/topic/architecture/recommendations'},
    {title: 'Save UI states', url: 'https://developer.android.com/topic/libraries/architecture/saving-states'},
    {title: 'Adaptive apps', url: 'https://developer.android.com/develop/ui/compose/build-adaptive-apps'},
    {title: 'Vector drawables', url: 'https://developer.android.com/develop/ui/views/graphics/vector-drawable-resources'},
    {title: 'Unique work policies', url: 'https://developer.android.com/reference/androidx/work/ExistingWorkPolicy'},
    {title: 'WorkManager', url: 'https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started'},
    {title: 'Performance guide', url: 'https://developer.android.com/topic/performance/overview'}
,
    {"title": "Navigation and back stack", "url": "https://developer.android.com/guide/navigation/backstack"},
    {"title": "Runtime permissions", "url": "https://developer.android.com/training/permissions/requesting"},
    {"title": "Room migrations", "url": "https://developer.android.com/training/data-storage/room/migrating-db-versions"},
    {"title": "DataStore", "url": "https://developer.android.com/topic/libraries/architecture/datastore"},
    {"title": "Hilt injection and scopes", "url": "https://developer.android.com/training/dependency-injection/hilt-android"},
    {"title": "Compose side effects", "url": "https://developer.android.com/develop/ui/compose/side-effects"},
    {"title": "Views in Compose", "url": "https://developer.android.com/develop/ui/compose/migrate/interoperability-apis/views-in-compose"},
    {"title": "Coroutine tests", "url": "https://developer.android.com/kotlin/coroutines/test"},
    {"title": "Compose UI tests", "url": "https://developer.android.com/develop/ui/compose/testing"},
    {"title": "ANR diagnostics", "url": "https://developer.android.com/topic/performance/vitals/anr"},
    {"title": "Build variants", "url": "https://developer.android.com/build/build-variants"},
    {"title": "Network security configuration", "url": "https://developer.android.com/privacy-and-security/security-config"},
    {"title": "Notification channels", "url": "https://developer.android.com/develop/ui/compose/notifications/channels"},
    {"title": "Accessibility semantics", "url": "https://developer.android.com/develop/ui/compose/accessibility/semantics"}
,
    {"title": "Processes and threads", "url": "https://developer.android.com/guide/components/processes-and-threads"},
    {"title": "Android runtime", "url": "https://source.android.com/docs/core/runtime"},
    {"title": "Binder IPC", "url": "https://source.android.com/docs/core/architecture/ipc/binder-overview"},
    {"title": "Handler API", "url": "https://developer.android.com/reference/android/os/Handler"}
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
    "sync", ExistingWorkPolicy.APPEND_OR_REPLACE, request
)
// SyncWorker extends CoroutineWorker; retry transient failures.
// Each trigger appends a drain; failed/cancelled chains are replaced.
// Drain durable operations idempotently; reconcile at startup too.`,
      pitfall: 'KEEP ignores a trigger while work is unfinished, so an edit after the final outbox read can miss scheduling. APPEND_OR_REPLACE queues another drain but can build a backlog; coalesce high-rate edits deliberately. Scheduling is not atomic with a Room write: reconcile pending operations after interruption. WorkManager does not promise exact timing.', question: 'Should a search-as-you-type request use WorkManager?', answer: 'Usually no. Use a lifecycle-scoped coroutine with debounce and cancellation. Persistent scheduling would outlive the immediate interaction.', quiz: {question: 'Which work fits WorkManager?', options: ['An exact animation frame', 'A durable queued upload', 'Every keystroke search'], correct: 1, explanation: 'Queued uploads benefit from persistent scheduling, network constraints and retry support.'}},
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
      pitfall: 'suspend does not automatically move blocking work off the main thread. Performance measured in a debug build can be misleading.', question: 'How would you investigate jank?', answer: 'Reproduce on a representative device, inspect a trace, then measure the suspected fix. Use Macrobenchmark for user journeys and unit tests with fakes for logic.', quiz: {question: 'What is the best first step for a slow screen?', options: ['Add caches everywhere', 'Measure a reproducible case', 'Move every function to a thread'], correct: 1, explanation: 'A trace and baseline identify the actual bottleneck and show whether the change helps.'}},
{
  "id": "navigation-lifecycle",
  "title": "Lifecycle, back stack & deep links",
  "summary": "Created → started → resumed describes setup, visibility and interaction. Pause/stop release appropriately scoped resources. Navigation destinations form a back stack; external deep links are untrusted entry points.",
  "useCase": "Explain backgrounding, rotation and returning from a detail screen.",
  "code": "// Navigation Compose 2 typed routes; requires serialization setup.\n@Serializable data object FeedRoute\n@Serializable data class DetailRoute(val articleId: String)\n\nnavController.navigate(DetailRoute(articleId = \"42\")) {\n    launchSingleTop = true\n}\n// NavHost must declare both destinations.\n// Destination: backStackEntry.toRoute<DetailRoute>().articleId\nnavController.popBackStack() // Inspect false: no destination left.",
  "language": "kotlin",
  "pitfall": "Do not equate onPause with invisibility or onStop with process termination. Pass IDs, reload data, and authorize access even for verified App Links.",
  "question": "How do Back and Up differ?",
  "answer": "Back follows navigation history, potentially leaving the app. Up follows the app hierarchy. A deep link may need a constructed parent stack; test cold and warm entry.",
  "quiz": {
    "question": "What should a detail route normally carry?",
    "options": [
      "A serialized Activity",
      "A stable record ID",
      "The full mutable database graph"
    ],
    "correct": 1,
    "explanation": "An ID keeps arguments small and lets the destination restore data through its repository."
  }
},
{
  "id": "permissions-results",
  "title": "Permissions & Activity Result APIs",
  "summary": "Request access at the feature boundary, explain why when appropriate, and handle denial. Register Activity Result launchers consistently during initialization so results survive recreation.",
  "useCase": "Ask for camera access only after the user chooses the scanner.",
  "code": "// Inside a ComponentActivity; manifest declares CAMERA.\nprivate val requestCamera = registerForActivityResult(\n    ActivityResultContracts.RequestPermission()\n) { granted ->\n    if (granted) openScanner() else showManualEntry()\n}\n// On a user action, check permission first and show rationale if needed.\n// Then: requestCamera.launch(Manifest.permission.CAMERA)\n// openScanner/showManualEntry are app-specific handlers.",
  "language": "kotlin",
  "pitfall": "Permission can be revoked. Recheck before protected operations. Prefer the system photo picker instead of broad media access when selecting a photo.",
  "question": "Why not register a launcher only inside the click callback?",
  "answer": "Results may return after recreation, before another click occurs. Registration must be available consistently; launch is the user-triggered step.",
  "quiz": {
    "question": "A user denies camera access. What next?",
    "options": [
      "Keep requesting immediately",
      "Offer manual input or another fallback",
      "Crash the feature"
    ],
    "correct": 1,
    "explanation": "Denial is an expected state; preserve the parts of the app that do not need the permission."
  }
},
{
  "id": "room",
  "title": "Room, transactions & migrations",
  "summary": "Room validates SQL and maps rows to typed models. Transactions preserve invariants across writes. Versioned migrations preserve installed users’ data as schemas change.",
  "useCase": "Save a draft and its upload operation together, then evolve the schema safely.",
  "code": "// Room 2 API example. AppDatabase extends RoomDatabase.\nsuspend fun saveDraft(db: AppDatabase, draft: DraftEntity) {\n    db.withTransaction {\n        db.drafts().upsert(draft)\n        db.outbox().insert(PendingUpload(draft.id))\n    }\n}\n// Export schemas. Register and test every supported migration path.\n// Example SQL for a new column in an existing notes table:\n// ALTER TABLE notes ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0",
  "language": "kotlin",
  "pitfall": "Destructive migration deletes data. Keep network calls outside database transactions; long transactions hold resources and delay other work.",
  "question": "What should a migration test verify beyond opening the database?",
  "answer": "Create an old schema with representative records, migrate, validate the new schema, and assert preserved values and defaults. Include multi-version upgrade paths.",
  "quiz": {
    "question": "Why wrap the draft and outbox writes in a transaction?",
    "options": [
      "For faster HTTP",
      "To persist both or neither",
      "To prevent all process death"
    ],
    "correct": 1,
    "explanation": "Atomicity prevents a saved draft without upload intent or upload intent without the draft."
  }
},
{
  "id": "datastore",
  "title": "Storage choices & DataStore",
  "summary": "Use Room for queryable relational records, DataStore for small settings, files for blobs and cache directories for replaceable data. DataStore exposes asynchronous reads and transactional updates.",
  "useCase": "Persist a user preference without blocking the main thread.",
  "code": "// Top-level property; one DataStore instance per file per process.\nval Context.settings by preferencesDataStore(name = \"settings\")\nval compactKey = booleanPreferencesKey(\"compact\")\n\nsuspend fun setCompact(context: Context, enabled: Boolean) {\n    context.settings.edit { preferences ->\n        preferences[compactKey] = enabled\n    }\n}\n// Read with context.settings.data.map { it[compactKey] ?: false }",
  "language": "kotlin",
  "pitfall": "DataStore is not a relational database and does not encrypt values automatically. Handle read failures and design migration from older settings storage.",
  "question": "Why not store a growing offline article catalog in DataStore?",
  "answer": "The catalog needs indexed queries, partial updates and relationships. Room is a better match; DataStore suits compact settings or small typed state.",
  "quiz": {
    "question": "Which store best fits a Boolean display preference?",
    "options": [
      "DataStore",
      "An entire SQL server",
      "A Bitmap"
    ],
    "correct": 0,
    "explanation": "DataStore provides an asynchronous, durable settings API without the overhead of relational modeling."
  }
},
{
  "id": "dependency-injection",
  "title": "Dependency injection & Hilt scopes",
  "summary": "Constructor injection makes dependencies explicit. Hilt assembles the graph; scopes reuse instances within component lifetimes. Singleton means application-process lifetime, not permanent storage.",
  "useCase": "Replace a repository in tests while sharing expensive application services.",
  "code": "interface Clock { fun nowMillis(): Long }\nclass DeviceClock @Inject constructor() : Clock {\n    override fun nowMillis() = System.currentTimeMillis()\n}\n@Module\n@InstallIn(SingletonComponent::class)\nabstract class ClockModule {\n    @Binds @Singleton\n    abstract fun bindClock(impl: DeviceClock): Clock\n}\n// Requires Hilt plugin/compiler and @HiltAndroidApp Application.",
  "language": "kotlin",
  "pitfall": "An application-scoped object must not retain an Activity or its Views. Choose the narrowest useful scope; unscoped bindings are created when requested.",
  "question": "How do ActivityScoped and ActivityRetainedScoped differ?",
  "answer": "ActivityScoped belongs to an Activity instance. ActivityRetainedScoped spans its configuration recreations. ViewModelScoped belongs to one ViewModel.",
  "quiz": {
    "question": "What is the main testing benefit of constructor injection?",
    "options": [
      "Tests can supply a fake dependency",
      "It removes all interfaces",
      "It prevents runtime exceptions"
    ],
    "correct": 0,
    "explanation": "Explicit dependencies let a test control time, networking and data without replacing global state."
  }
},
{
  "id": "compose-effects",
  "title": "Compose effects & recomposition",
  "summary": "Recomposition reruns affected UI functions. Effect keys control restarts; rememberUpdatedState supplies a fresh value without restarting long-lived work. Stable contracts help optimization but must be truthful.",
  "useCase": "Run a timeout once per composition entry while invoking the latest callback.",
  "code": "@Composable\nfun TimedHint(onTimeout: () -> Unit) {\n    val latestTimeout by rememberUpdatedState(onTimeout)\n    LaunchedEffect(Unit) {\n        delay(3_000)\n        latestTimeout()\n    }\n    Text(\"Think aloud before you code\")\n}\n// Leaving composition cancels this effect.\n// Use DisposableEffect for subscriptions requiring cleanup.",
  "language": "kotlin",
  "pitfall": "Adding @Stable does not make mutation observable. A mutableListOf change alone does not notify Compose; use observable state and publish new values.",
  "question": "When should an effect key change?",
  "answer": "When the operation should cancel and restart, such as switching a user ID. Use updated state for values that should be fresh without restarting the operation.",
  "quiz": {
    "question": "What happens if a LaunchedEffect key changes?",
    "options": [
      "The old work cancels and new work starts",
      "Nothing ever changes",
      "The Activity must restart"
    ],
    "correct": 0,
    "explanation": "Effect keys define the identity of the composition-scoped coroutine."
  }
},
{
  "id": "view-internals",
  "title": "View layout, touch & Compose interop",
  "summary": "Views measure desired sizes within parent constraints, lay out positions, then draw. requestLayout schedules size/position work; invalidate requests drawing. Touch dispatch can be intercepted by a parent.",
  "useCase": "Embed an existing widget in Compose during gradual migration.",
  "code": "@Composable\nfun LegacyLabel(text: String) {\n    AndroidView(\n        factory = { context -> TextView(context) },\n        update = { view -> view.text = text },\n        modifier = Modifier.fillMaxWidth()\n    )\n}\n// factory creates the View; update applies current Compose state.\n// The opposite direction uses ComposeView inside a View hierarchy.",
  "language": "kotlin",
  "pitfall": "Do not create a View outside AndroidView and retain an obsolete Context. Custom touch handlers should support performClick and handle cancellation.",
  "question": "Why separate AndroidView factory and update?",
  "answer": "Creation should happen when the View is needed. Updates can happen repeatedly as state changes, without rebuilding the widget or losing its internal state.",
  "quiz": {
    "question": "A custom View changes desired dimensions. Which call fits?",
    "options": [
      "requestLayout()",
      "Only set a background color",
      "Always recreate the Activity"
    ],
    "correct": 0,
    "explanation": "requestLayout asks the hierarchy to run measurement and layout again."
  }
},
{
  "id": "unit-tests",
  "title": "Unit tests, fakes & virtual time",
  "summary": "Test observable behavior with controlled dependencies. Fakes implement a useful subset of production behavior. Coroutine tests control scheduling and virtual time instead of sleeping.",
  "useCase": "Verify business logic without a device or live network.",
  "code": "interface UserSource { suspend fun name(): String }\nclass FakeUserSource : UserSource {\n    override suspend fun name() = \"Ada\"\n}\nclass Greeting(private val source: UserSource) {\n    suspend fun text() = \"Hello, \" + source.name()\n}\n@Test fun greetsLoadedUser() = runTest {\n    assertEquals(\"Hello, Ada\", Greeting(FakeUserSource()).text())\n}\n// Requires kotlinx-coroutines-test and a test assertion library.",
  "language": "kotlin",
  "pitfall": "runTest does not make arbitrary real dispatchers virtual. Inject test dispatchers sharing a scheduler; replace Main when testing Main-dependent ViewModels.",
  "question": "What should tests assert for a failed refresh with cached data?",
  "answer": "The cached content remains available, refresh failure is represented, and retry can recover. Avoid asserting private method calls when state is the real contract.",
  "quiz": {
    "question": "Why prefer virtual time over Thread.sleep in coroutine tests?",
    "options": [
      "It controls scheduling deterministically",
      "It speeds up the network",
      "It disables cancellation"
    ],
    "correct": 0,
    "explanation": "A test scheduler advances coroutine delays without wall-clock waiting or timing races."
  }
},
{
  "id": "ui-tests",
  "title": "Compose & Espresso UI tests",
  "summary": "Instrumented tests run against Android UI behavior. Compose tests query semantics; Espresso finds Views. Cover critical journeys and synchronize with work instead of relying on sleeps.",
  "useCase": "Confirm a user action changes visible state in either UI toolkit.",
  "code": "// Compose test class; SearchBox comes from the Compose lesson.\n@get:Rule val composeRule = createComposeRule()\n@Test fun editsSearch() {\n    composeRule.setContent {\n        var query by remember { mutableStateOf(\"\") }\n        SearchBox(query, onQueryChange = { query = it })\n    }\n    composeRule.onNode(hasSetTextAction()).performTextInput(\"Ada\")\n    composeRule.onNodeWithText(\"Ada\").assertIsDisplayed()\n}\n// Espresso equivalent for a View button:\n// onView(withId(R.id.retry)).perform(click())",
  "language": "kotlin",
  "pitfall": "Framework idle detection does not cover every custom background operation. Expose controllable dependencies or appropriate idling resources; avoid brittle screen coordinates.",
  "question": "Why use semantics instead of pixel positions in Compose tests?",
  "answer": "Semantics express the user-facing role, label and actions. Coordinates change with density, fonts and layout, while semantic behavior is the intended contract.",
  "quiz": {
    "question": "Which assertion is most resilient?",
    "options": [
      "Button at exact pixel x=122",
      "Expected text or role is available",
      "A fixed 2-second delay elapsed"
    ],
    "correct": 1,
    "explanation": "Tests should describe user-observable behavior and use synchronization for completion."
  }
},
{
  "id": "anrs-leaks",
  "title": "ANRs, leaks & profiling",
  "summary": "ANRs occur when required responsiveness deadlines are missed. Blocking I/O, lock contention and slow callbacks can contribute. A leak retains objects after their useful lifetime and increases memory pressure.",
  "useCase": "Investigate an unresponsive screen using traces and heap evidence.",
  "code": "// Debug-only diagnostics; invoke during Application startup.\nif (BuildConfig.DEBUG) {\n    StrictMode.setThreadPolicy(\n        StrictMode.ThreadPolicy.Builder()\n            .detectDiskReads()\n            .detectDiskWrites()\n            .detectNetwork()\n            .penaltyLog()\n            .build()\n    )\n}\n// Inspect stacks/traces; remove the cause, not just the detector.",
  "language": "kotlin",
  "pitfall": "An idle-looking main thread in one dump may not reveal the original stall. Examine timing and other threads; moving a task to I/O does not fix lock contention.",
  "question": "How would you confirm a suspected Activity leak?",
  "answer": "Recreate and close the screen repeatedly, then inspect retained instances and reference paths in a heap dump. Find the longer-lived owner retaining the Activity.",
  "quiz": {
    "question": "Which can freeze the main thread without doing I/O there?",
    "options": [
      "Waiting for a lock held by another thread",
      "Using a string resource",
      "Calling a pure constant getter"
    ],
    "correct": 0,
    "explanation": "Lock contention can block responsiveness even when the expensive work occurs elsewhere."
  }
},
{
  "id": "build-release",
  "title": "Gradle, variants & R8",
  "summary": "Build types separate debug/release behavior; product flavors represent product dimensions. R8 shrinks, optimizes and obfuscates release code. Validate the actual release artifact, not only debug.",
  "useCase": "Prepare an optimized build while keeping stack traces diagnosable.",
  "code": "// Module build.gradle.kts; Android Gradle plugin already configured.\nandroid {\n    buildTypes {\n        getByName(\"release\") {\n            isMinifyEnabled = true\n            isShrinkResources = true\n            proguardFiles(\n                getDefaultProguardFile(\"proguard-android-optimize.txt\"),\n                \"proguard-rules.pro\"\n            )\n        }\n    }\n}",
  "language": "kotlin",
  "pitfall": "Overbroad keep rules disable useful optimization; missing rules can break reflection. Preserve mapping files per release and keep signing credentials out of source control.",
  "question": "How are a build type and a flavor different?",
  "answer": "A build type configures how to build, such as debug versus release. Flavors model product choices such as demo versus full; variants combine them.",
  "quiz": {
    "question": "Which artifact helps deobfuscate a release crash?",
    "options": [
      "The matching R8 mapping file",
      "Any old debug APK",
      "Only the app icon"
    ],
    "correct": 0,
    "explanation": "Mappings correspond to a particular build and translate obfuscated symbols back to source names."
  }
},
{
  "id": "security-config",
  "title": "Android security & network trust",
  "summary": "Use HTTPS with platform trust validation and Network Security Config for scoped trust policies. Minimize exported surfaces, validate incoming URIs, and avoid exposing private files directly.",
  "useCase": "Share a generated file with temporary access rather than a broad storage permission.",
  "code": "// FileProvider must be declared with a narrow XML paths policy.\nval uri = FileProvider.getUriForFile(\n    context, context.packageName + \".files\", reportFile\n)\nval share = Intent(Intent.ACTION_SEND).apply {\n    type = \"application/pdf\"\n    putExtra(Intent.EXTRA_STREAM, uri)\n    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)\n}\ncontext.startActivity(Intent.createChooser(share, \"Share report\"))\n// context here is an Activity; reportFile is inside allowed paths.",
  "language": "kotlin",
  "pitfall": "Never install a trust-all certificate verifier to fix TLS errors. Do not expose the entire filesystem through FileProvider or assume obfuscation protects embedded secrets.",
  "question": "Why separate debug certificate trust from release?",
  "answer": "Local proxy or development certificates may help debugging but weaken production trust. Use debug-only overrides and verify the merged release manifest/configuration.",
  "quiz": {
    "question": "What is safer for sharing an app-private report?",
    "options": [
      "A raw file:// URI",
      "A narrow content URI with a temporary grant",
      "Making all app files public"
    ],
    "correct": 1,
    "explanation": "FileProvider can expose only the intended file while the recipient receives limited URI access."
  }
},
{
  "id": "notifications-push",
  "title": "Notifications & push delivery",
  "summary": "Notification channels group user-controlled alert behavior on Android 8+. Android 13+ adds notification permission for non-exempt notifications. Push should trigger a data refresh, not be the sole durable record.",
  "useCase": "Notify about a message while preserving a reliable in-app inbox.",
  "code": "if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {\n    val channel = NotificationChannel(\n        \"messages\",\n        context.getString(R.string.messages_channel),\n        NotificationManager.IMPORTANCE_DEFAULT\n    )\n    context.getSystemService(NotificationManager::class.java)\n        .createNotificationChannel(channel)\n}\n// Before posting: check permission and channel/app settings.\n// Notification taps use explicit, appropriately immutable PendingIntents.",
  "language": "kotlin",
  "pitfall": "Channel importance cannot simply be raised after creation; users control it. Push delivery may be delayed or duplicated, so reconcile using stable server IDs.",
  "question": "What should happen after receiving a “new message” push?",
  "answer": "Reconcile the inbox through the repository and deduplicate by message ID. Keep payloads minimal and avoid putting sensitive content on the lock screen by default.",
  "quiz": {
    "question": "Can push delivery replace a durable inbox API?",
    "options": [
      "Yes, it is an exactly-once log",
      "No, use it as a signal to reconcile",
      "Only if the payload is large"
    ],
    "correct": 1,
    "explanation": "Offline devices and retries make reconciliation necessary; push alone cannot guarantee a complete history."
  }
},
{
  "id": "accessibility-localization",
  "title": "Accessibility & localization",
  "summary": "Provide semantic roles and states, meaningful labels and scalable text. Put user-visible strings in resources; support plurals, locale-aware formatting, RTL and different text lengths.",
  "useCase": "Make a settings toggle understandable to TalkBack and usable with large fonts.",
  "code": "@Composable\nfun CompactSetting(enabled: Boolean, onChange: (Boolean) -> Unit) {\n    Row(Modifier.fillMaxWidth().toggleable(\n        value = enabled, role = Role.Switch,\n        onValueChange = onChange\n    ).padding(16.dp)) {\n        Text(stringResource(R.string.compact_layout),\n            modifier = Modifier.weight(1f))\n        Switch(checked = enabled, onCheckedChange = null)\n    }\n}\n// One accessible row action; child Switch delegates interaction.",
  "language": "kotlin",
  "pitfall": "Do not label every decorative icon or concatenate translated sentences. Test with TalkBack, large fonts and RTL; content descriptions should not duplicate visible text needlessly.",
  "question": "Why use start/end instead of left/right spacing?",
  "answer": "Start/end follow layout direction, so navigation and alignment adapt naturally to right-to-left languages. Some content, such as media progress, still needs domain-specific treatment.",
  "quiz": {
    "question": "What improves accessibility for this toggle row?",
    "options": [
      "Two competing click actions",
      "One labeled action with switch semantics",
      "Removing the visible label"
    ],
    "correct": 1,
    "explanation": "A unified control communicates both purpose and checked state without redundant interaction targets."
  }
},
{
  "id": "runtime-threads",
  "title": "Processes, ART, Binder & the main looper",
  "summary": "An app usually runs components in one Linux process. ART executes DEX code using compilation/runtime services and garbage collection. Binder provides IPC. The main thread’s Looper dispatches queued callbacks; a Handler posts to a chosen Looper.",
  "useCase": "Explain why posting expensive work to the main Handler still causes jank or ANRs.",
  "language": "kotlin",
  "code": "val mainHandler = Handler(Looper.getMainLooper())\nval update = Runnable { renderStatus(\"Ready\") }\nmainHandler.post(update) // Executes on main; does not create a thread.\n// If the owning UI is destroyed before delivery:\nmainHandler.removeCallbacks(update)\n\n// Prefer lifecycle-scoped coroutines for new screen-owned async work.\n// Blocking Binder calls can wait for another process; avoid on main.\n// renderStatus is an app-specific UI callback.",
  "pitfall": "A process-wide singleton is not shared across processes and disappears on process death. Binder calls can block or arrive concurrently; avoid large IPC payloads and protect shared state.",
  "question": "Does garbage collection prevent memory leaks?",
  "answer": "No. GC reclaims unreachable objects. A listener or singleton can keep an obsolete Activity reachable indefinitely; release references at the owner’s lifecycle boundary.",
  "quiz": {
    "question": "Handler(Looper.getMainLooper()).post { heavyWork() } runs where?",
    "options": [
      "A newly created worker thread",
      "The main thread when its queue reaches the callback",
      "A separate Linux process"
    ],
    "correct": 1,
    "explanation": "A Handler targets its Looper’s existing thread. Posting changes scheduling, not the execution thread."
  }
}
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
