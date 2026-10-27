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
    {id: 'components', title: 'Components & the manifest', summary: "Android components are entry points that the operating system can create independently: Activities present interactive UI, services provide a component for work without a screen, receivers react to broadcasts, and providers expose structured data through content URIs. The manifest describes these components and their access rules. In the example, MainActivity installs a Compose UI during onCreate; its launcher declaration lets Android find and start it.", useCase: "Trace a launcher tap from the manifest intent filter into MainActivity, then explain how an external link reaches the correct destination. Identify which entry points need outside access and which should remain internal to the application.", language: 'kotlin',
      code: `// MainActivity must also be declared in AndroidManifest.xml.
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { Text("Interview ready") }
    }
}
// Launcher activity: android:exported="true" plus MAIN/LAUNCHER.
// Internal components: explicitly set exported="false" where possible.`,
      pitfall: "A Service runs on the process main thread by default; creating one does not make blocking work safe. Exported components also receive requests from outside your app, so validate incoming arguments and authorization. Declaring a permission does not replace requesting runtime access when required.", question: 'Must every app screen be a separate Activity?', answer: "No. One Activity can host many Compose destinations or Fragments, so a screen does not require its own operating-system component. This often simplifies shared navigation and screen state while individual destinations retain their own responsibilities. Separate Activities can still make sense for distinct platform entry points or task behavior. For a deep-link follow-up, describe how the host validates the incoming identifier, selects a destination, and builds appropriate Back behavior rather than assuming each destination needs a manifest declaration.", quiz: {question: 'Which component exposes structured data to other apps?', options: ['Activity', 'ContentProvider', 'BroadcastReceiver'], correct: 1, explanation: 'A ContentProvider exposes data through a URI-based interface, with access controlled by permissions.'}},
    {id: 'state-lifecycle', title: 'Lifecycle & state survival', summary: "State needs an owner and an explicit survival requirement. A ViewModel keeps screen state through configuration recreation, while SavedStateHandle can reconstruct small values after system-initiated process loss when saved state is available. Durable records belong in persistent storage. SearchViewModel exposes a query StateFlow backed by the handle; assigning a new query updates that flow, and collectAsStateWithLifecycle connects it to the visible Compose UI.", useCase: "Keep a user's search text during rotation, restore it when Android recreates a retained task after process loss, and reload matching records from the repository. Treat a fresh launch after deliberate dismissal as a separate restoration scenario.", language: 'kotlin',
      code: `class SearchViewModel(
    private val savedState: SavedStateHandle
) : ViewModel() {
    val query = savedState.getStateFlow("query", "")
    fun search(text: String) { savedState["query"] = text }
}
// In a composable:
val query by viewModel.query.collectAsStateWithLifecycle()`,
      pitfall: "Saved state has limited space and depends on the task's restoration lifecycle; it is not guaranteed permanent storage. Save a query or record ID instead of a full result list. Avoid Activity references in ViewModels, and never rely on onDestroy to persist critical records.", question: 'Does remember survive Activity recreation?', answer: "No. remember retains a value while its call remains in the composition, including ordinary recompositions, but Activity recreation builds a new composition. Use rememberSaveable for small UI values that can be saved directly or through a Saver. Use a ViewModel when the state participates in screen logic, with SavedStateHandle for minimal restoration inputs. Neither saved-state approach replaces a database for durable data. A useful follow-up is distinguishing system process recreation from force-stop or task dismissal, where saved UI state should not be assumed available.", quiz: {question: 'Which alone survives configuration changes but not process death?', options: ['ViewModel', 'A local variable', 'remember'], correct: 0, explanation: 'The ViewModel instance survives configuration changes. Restoring after process death requires saved state or durable storage.'}},
    {id: 'views', title: 'View-based UI', summary: "A Fragment instance and its view have different lifetimes. View Binding provides typed references to the current XML view tree, while RecyclerView's ListAdapter uses DiffUtil to update changed items efficiently. The example binds the view in onViewCreated and collects only while its view lifecycle is at least STARTED. Each emission submits a list snapshot and updates the empty indicator; collection stops and restarts as the view changes lifecycle state.", useCase: "Maintain an XML feed while users navigate to details and back. Collect repository state only for the current view, restore the latest list when it becomes visible, and show an empty message without retaining the destroyed view tree.", language: 'kotlin',
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
      pitfall: "A Fragment can remain on the back stack after its view disappears. Clear any binding field in onDestroyView and release other long-lived view references. Never mutate submitted lists or their diff-relevant item properties in place; DiffUtil needs distinct snapshots to detect changes correctly.", question: 'Why use viewLifecycleOwner rather than the Fragment lifecycle?', answer: "The view is the resource being updated, so its lifecycle should own the collector. A Fragment's lifecycle may continue after onDestroyView, allowing a Fragment-scoped job to retain or touch obsolete bindings. Here, viewLifecycleOwner.lifecycleScope is canceled when that view is destroyed, and repeatOnLifecycle also cancels collection below STARTED and restarts it on return. The recreated view gets its own binding and collector. If a follow-up asks about multiple flows, launch their collectors as separate children inside repeatOnLifecycle so one endless collect does not prevent the next.", quiz: {question: 'Which update is appropriate for ListAdapter?', options: ['Mutate the submitted list in place', 'Submit a new list snapshot', 'Always rebuild the Activity'], correct: 1, explanation: 'DiffUtil compares snapshots. Mutating the old list can hide the changes it needs to detect.'}},
    {id: 'compose', title: 'Compose & state hoisting', summary: "Compose renders a description of the UI from observable state. State hoisting moves a value to an owner and exposes callbacks for changes, creating a clear flow from state to display to user action. SearchBox demonstrates a stateless field: it displays query and reports edits through onQueryChange. The caller decides how edits update state or trigger search, keeping the reusable component independent of repositories and screen-specific logic.", useCase: "Reuse the same search field in multiple screens, preview it with fixed values, and test that typing reports the expected callback. Let each screen choose whether its query remains local, survives recreation, or drives repository requests.", language: 'kotlin',
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
      pitfall: "Composable bodies can run repeatedly or have work discarded, so a network call made directly during composition can duplicate requests. Read observable state and use controlled effects or event handlers for work. A plain mutable variable or list does not automatically notify Compose when changed.", question: 'Where should state live?', answer: "Place state at the lowest common owner that needs to read or modify it, and keep one authoritative value. A local expansion toggle can stay in the composable; a search query used by business logic often belongs in a screen ViewModel. Pass values down and events up rather than giving every child direct ownership. Hoist values that change together to a shared owner. For a follow-up, discuss restoration separately: choosing an owner does not itself decide whether state survives configuration change or process loss.", quiz: {question: 'What should onQueryChange usually do?', options: ['Update the owner’s state', 'Mutate the TextField internals', 'Launch an unmanaged thread'], correct: 0, explanation: 'The owner updates state and Compose renders the new value through unidirectional data flow.'}},
    {id: 'adaptive', title: 'Adaptive & accessible layouts', summary: "Adaptive UI responds to the space and capabilities currently available, rather than assigning one layout permanently to a device category. FeedLayout checks its own constraints: a sufficiently wide parent shows list and detail together, while a narrow parent shows the list and expects navigation to detail. This illustrates local layout adaptation; app-level window size classes and adaptive components can coordinate broader navigation decisions, with accessibility and insets considered alongside width.", useCase: "Build a feed that changes from one pane to list-detail while a user resizes a window or unfolds a device. Preserve the selected article across that change and verify both panes remain readable with enlarged text and system bars.", language: 'kotlin',
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
      pitfall: "The example's width check is a local design choice, not complete foldable or accessibility handling. A hinge can obstruct content even in a wide window. Avoid clipped fixed-height text, respect insets, provide meaningful semantics, and test keyboard, large-font, and screen-reader behavior.", question: 'Why use window space instead of “is tablet”?', answer: "A device category stays the same while its usable window can change substantially. A tablet in split screen may need a single pane, and an unfolded phone may have room for two. Window-based decisions let the interface adapt during the same session. For a local component, use the constraints its parent actually supplies; use window size classes for broader application structure. A follow-up should address posture and continuity: keep the selected record in state, and account for separating hinges rather than relying on width alone.", quiz: {question: 'What should drive an adaptive layout?', options: ['Physical device marketing category', 'Available window size and posture', 'A fixed portrait assumption'], correct: 1, explanation: 'The usable window can change during the same session.'}},
    {id: 'vectors', title: 'Vectors, images & resources', summary: "Choose image resources by their content and rendering cost. VectorDrawable stores paths in Android XML and scales well for simple icons; Android Studio can convert supported SVG features into that format. Photographs usually belong in raster formats sized for their display. BookmarkAction loads a vector resource through painterResource and supplies a localized description of its action, while decorative graphics should avoid unnecessary screen-reader announcements.", useCase: "Ship one bookmark icon that stays crisp across densities, expose its purpose to TalkBack, and translate the action label through string resources. Use a separate image-loading path for article photos, requesting dimensions close to their actual on-screen size.", language: 'kotlin',
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
      pitfall: "An arbitrary SVG file is not an Android VectorDrawable, and unsupported SVG features can be lost during import. Inspect converted artwork rather than trusting a successful import. Complex paths can be expensive, while oversized decoded photos waste memory even when their compressed files look small.", question: 'Should every image be a vector?', answer: "No. Vectors work well for relatively simple geometric artwork, especially icons that need several sizes or tinting. Photos and detailed textured illustrations generally fit raster formats better because describing every detail as paths can increase complexity and rendering cost. Choose an appropriate resolution and compression, then measure visual quality and memory usage. For the bookmark example, the vector is suitable, but the localized action description is a separate accessibility requirement. A follow-up can compare source file size with decoded bitmap memory, which is often much larger.", quiz: {question: 'What is the normal route for a simple SVG icon?', options: ['Put any SVG directly in drawable', 'Convert supported paths to VectorDrawable', 'Render it as text'], correct: 1, explanation: 'VectorDrawable uses Android XML. SVG import supports a subset of SVG features.'}},
    {id: 'background', title: 'Background work & cancellation', summary: "Choose background execution by how long the work must remain relevant. WorkManager persists scheduled work and supports constraints and retry, making it suitable for eventually uploading a durable outbox. The example requires connectivity and appends a sync drain to a unique chain, replacing failed or canceled prerequisites when necessary. Screen-owned interactions instead belong in cancelable coroutine scopes; persistent scheduling does not imply immediate execution or exactly-once network effects.", useCase: "Save offline edits and upload intentions locally, then schedule a worker to drain them when connectivity returns. Let the user leave the screen without losing pending operations, and reconcile outstanding records when the app next starts after an interruption.", language: 'kotlin',
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
      pitfall: "KEEP can ignore a late trigger while work is still unfinished. APPEND_OR_REPLACE preserves another drain opportunity but can accumulate requests. Database writes and scheduling are separate operations, so reconcile durable pending work after interruption and make uploads idempotent. WorkManager does not promise exact timing.", question: 'Should a search-as-you-type request use WorkManager?', answer: "Usually no. Search results become obsolete as the user types or leaves, so use a screen-owned coroutine pipeline with debounce and cancellation of the previous request. Tie UI collection to lifecycle and prevent a late response from replacing results for a newer query; cancellation must also be supported by the underlying client. WorkManager would preserve work beyond its useful interaction and introduce scheduling delays. If the operation changes to a durable upload, persist its input first and use WorkManager with constraints, retry rules, and idempotency.", quiz: {question: 'Which work fits WorkManager?', options: ['An exact animation frame', 'A durable queued upload', 'Every keystroke search'], correct: 1, explanation: 'Queued uploads benefit from persistent scheduling, network constraints and retry support.'}},
    {id: 'performance-testing', title: 'Performance & testing', summary: "Performance work starts with a reproducible symptom and a baseline. LazyColumn composes visible content on demand, while stable article IDs preserve item identity when the feed changes; neither guarantees smooth frames by itself. The example also separates a behavior assertion from performance measurement: clicking Retry and observing Loaded checks an interaction, whereas tracing and benchmarks reveal where time is spent during scrolling or startup.", useCase: "Reproduce a feed hitch on a representative device, record the same scroll journey before and after a targeted fix, and retain a UI test that verifies retry still works. Use fake repositories to isolate loading and error behavior independently.", language: 'kotlin',
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
      pitfall: "A suspend function can still block its caller's thread; the data layer must make blocking operations main-safe. Debug builds and unstable benchmark conditions distort performance conclusions. The sample UI assertion verifies a displayed result, not frame timing or whether real network work completes reliably.", question: 'How would you investigate jank?', answer: "First reproduce a specific gesture or transition with representative data and an optimized build on a relevant device. Capture a system trace and inspect slow frames, main-thread work, rendering, and contention to identify the cause. Establish a Macrobenchmark for the user journey, make one targeted change, and compare repeated measurements under similar conditions. Keep unit and UI tests for correctness, because a faster screen can still be wrong. A useful follow-up is distinguishing excessive recomposition from expensive work within a small number of compositions.", quiz: {question: 'What is the best first step for a slow screen?', options: ['Add caches everywhere', 'Measure a reproducible case', 'Move every function to a thread'], correct: 1, explanation: 'A trace and baseline identify the actual bottleneck and show whether the change helps.'}},
{
  "id": "navigation-lifecycle",
  "title": "Lifecycle, back stack & deep links",
  "summary": "Lifecycle describes when an Activity is initialized, visible, and interactive; navigation describes which destinations remain in its history. These are related but separate concerns. The typed Navigation Compose example passes an article ID to a detail destination, avoids another copy when that destination already tops the stack, and demonstrates popping history. Small route arguments allow the destination to reload current data rather than retaining an entire mutable object graph.",
  "useCase": "Open an article from the feed or an external deep link, load it by ID, and explain what Back should do for each entry path. Verify navigation after rotation, app backgrounding, and both cold and warm deep-link launches.",
  "code": "// Navigation Compose 2 typed routes; requires serialization setup.\n@Serializable data object FeedRoute\n@Serializable data class DetailRoute(val articleId: String)\n\nnavController.navigate(DetailRoute(articleId = \"42\")) {\n    launchSingleTop = true\n}\n// NavHost must declare both destinations.\n// Destination: backStackEntry.toRoute<DetailRoute>().articleId\nnavController.popBackStack() // Inspect false: no destination left.",
  "language": "kotlin",
  "pitfall": "onPause does not necessarily mean an Activity is invisible, and onStop does not mean its process has ended. A verified link still requires record-level authorization. Handle an empty back stack explicitly; launchSingleTop avoids duplication only when the destination is already on top.",
  "question": "How do Back and Up differ?",
  "answer": "Back follows the user's navigation history and may return to another app or the launcher. Up follows your app's hierarchy toward a parent destination, so it should keep the user within the app. They often coincide after normal in-app navigation but can differ when a deep link opens a detail screen directly. Define the parent relationship and use navigation support that constructs the appropriate stack. As a follow-up, test both fresh-task and existing-task entry, and handle a failed pop rather than leaving an empty destination visible.",
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
  "summary": "Permissions are a user-controlled capability, not a permanent feature flag. Ask when the user begins an action that needs access, explain the reason when appropriate, and provide a useful denial path. The example registers a RequestPermission launcher during Activity initialization, then opens the scanner or manual entry when the result arrives. Registration is available again after recreation; the user action decides when to launch the request.",
  "useCase": "Request camera access when a user selects scanning, keep manual code entry available after denial, and recheck access before opening the camera later. For selecting an existing photo, use the system picker when it satisfies the feature's needs.",
  "code": "// Inside a ComponentActivity; manifest declares CAMERA.\nprivate val requestCamera = registerForActivityResult(\n    ActivityResultContracts.RequestPermission()\n) { granted ->\n    if (granted) openScanner() else showManualEntry()\n}\n// On a user action, check permission first and show rationale if needed.\n// Then: requestCamera.launch(Manifest.permission.CAMERA)\n// openScanner/showManualEntry are app-specific handlers.",
  "language": "kotlin",
  "pitfall": "Do not repeatedly prompt after denial or assume an earlier grant still applies. Permissions may be revoked, and access checks are needed before protected operations. Register callbacks consistently before launching; save any additional operation context separately so recreation does not erase what the result refers to.",
  "question": "Why not register a launcher only inside the click callback?",
  "answer": "A result can arrive after the Activity or Fragment has been recreated, before the user clicks anything again. Registering only during a click leaves the new instance without the callback needed to receive that result and can violate lifecycle registration rules. Register launchers unconditionally in a consistent order during initialization, then call launch from the user action. This separates result routing from starting the request. For a follow-up, preserve any input needed to interpret the result and verify that denial or cancellation leaves a usable fallback.",
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
  "summary": "Room maps database tables to typed models and validates supported SQL usage at compile time. Transactions protect local invariants: the example saves a draft and records its pending upload together so neither can exist without the other. Schema versions and migrations handle a different boundary, preserving installed users' records during application updates. The illustrated pinned column needs a default for existing rows, matching the schema expected by the updated entity.",
  "useCase": "Persist an edited draft together with its upload operation, survive an interruption before synchronization, and later add a pinned preference without losing existing drafts. Exercise upgrades from older installed schemas using representative rows and supported migration paths.",
  "code": "// Room 2 API example. AppDatabase extends RoomDatabase.\nsuspend fun saveDraft(db: AppDatabase, draft: DraftEntity) {\n    db.withTransaction {\n        db.drafts().upsert(draft)\n        db.outbox().insert(PendingUpload(draft.id))\n    }\n}\n// Export schemas. Register and test every supported migration path.\n// Example SQL for a new column in an existing notes table:\n// ALTER TABLE notes ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0",
  "language": "kotlin",
  "pitfall": "A database transaction cannot make a network request atomic with local writes. Keep network work outside the transaction and retry from persisted intent. Destructive migration can erase user data. A column added by SQL must match the entity's expected type, nullability, and default declaration.",
  "question": "What should a migration test verify beyond opening the database?",
  "answer": "Seed the old schema with representative records, run the registered migration, validate the resulting schema, and assert the actual data. Check that existing values remain intact, new defaults are correct, and relationships or constraints still hold. Include upgrades that skip releases, since users may move across several versions at once. Opening successfully only proves that Room accepts the resulting schema, not that the migration preserved meaning. A follow-up can cover fresh installation versus upgraded installation, which should produce equivalent current schemas and expected application behavior.",
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
  "summary": "Storage choices should follow the data's structure and access pattern. Room supports queryable records and relationships, files hold larger blobs, and cache storage holds replaceable content. DataStore suits small settings with asynchronous reads and serialized transactional updates. The top-level preferences delegate provides one settings store for the file; edit writes the Boolean preference, and a mapped data flow supplies its stored value or the chosen initial default.",
  "useCase": "Persist compact-layout selection and observe it when rendering settings and article screens. Use one shared DataStore instance for that file, expose the setting through a repository, and plan how an existing SharedPreferences value moves into the new store.",
  "code": "// Top-level property; one DataStore instance per file per process.\nval Context.settings by preferencesDataStore(name = \"settings\")\nval compactKey = booleanPreferencesKey(\"compact\")\n\nsuspend fun setCompact(context: Context, enabled: Boolean) {\n    context.settings.edit { preferences ->\n        preferences[compactKey] = enabled\n    }\n}\n// Read with context.settings.data.map { it[compactKey] ?: false }",
  "language": "kotlin",
  "pitfall": "Creating multiple DataStore instances for the same file in one process can break access. The delegate shown is for single-process use; shared multi-process access needs the appropriate implementation. Handle read failures explicitly, and do not assume ordinary DataStore values are automatically encrypted.",
  "question": "Why not store a growing offline article catalog in DataStore?",
  "answer": "A growing catalog needs indexed filtering, sorting, relationships, and efficient updates to individual records. DataStore persists a small settings object and does not provide relational queries or partial object updates, so catalog growth makes it an awkward model. Use Room for article metadata and files for large content when appropriate; keep preferences such as compact layout in DataStore. A follow-up might ask about a tiny fixed list: size alone is not decisive, so explain whether the access pattern needs database features or simple whole-state persistence.",
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
  "summary": "Dependency injection makes a class's collaborators explicit instead of locating them through hidden global state. Hilt constructs the graph and uses components to manage lifetimes. The example gives DeviceClock an injectable constructor, then binds it to Clock in the application component with Singleton scope. Consumers can request the interface, while tests can supply controlled time. Scope determines instance reuse within a component, not whether its state is persisted.",
  "useCase": "Inject Clock into code that timestamps drafts so tests can use a fixed value instead of the wall clock. Share application services where useful, and keep screen-specific collaborators in a scope that matches their actual owner and cleanup needs.",
  "code": "interface Clock { fun nowMillis(): Long }\nclass DeviceClock @Inject constructor() : Clock {\n    override fun nowMillis() = System.currentTimeMillis()\n}\n@Module\n@InstallIn(SingletonComponent::class)\nabstract class ClockModule {\n    @Binds @Singleton\n    abstract fun bindClock(impl: DeviceClock): Clock\n}\n// Requires Hilt plugin/compiler and @HiltAndroidApp Application.",
  "language": "kotlin",
  "pitfall": "A singleton can retain an Activity or view long after its screen is destroyed, causing a leak. Configuration-retained objects must also avoid references to replaced Activity instances. Unscoped dependencies may be recreated for separate requests, while scoped objects remain in memory until their owning component ends.",
  "question": "How do ActivityScoped and ActivityRetainedScoped differ?",
  "answer": "ActivityScoped reuses an instance within one Activity instance, so configuration recreation creates a new scoped object. ActivityRetainedScoped uses the retained component and survives those recreations until the Activity is permanently finished. ViewModelScoped is narrower: each ViewModel has its own instance, while an ActivityRetainedScoped dependency can be shared by its ViewModels. Choose according to ownership and sharing needs. A follow-up should clarify that retained does not mean persisted: process death loses these instances, and a retained object must not hold the obsolete Activity or its views.",
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
  "summary": "Recomposition can rerun UI functions, so effects give external work an explicit owner and restart policy. TimedHint starts a three-second coroutine when its LaunchedEffect enters composition. The constant Unit key keeps ordinary recompositions from restarting the delay, while rememberUpdatedState makes the eventual callback current. Leaving composition cancels the coroutine. Returning creates a new effect, so this demonstrates one timer per composition entry rather than a durable deadline.",
  "useCase": "Show a hint after the user spends time on a screen while allowing the parent to update the timeout callback. Verify that ordinary recomposition keeps the original timer, and decide whether navigation away or Activity recreation should restart that waiting period.",
  "code": "@Composable\nfun TimedHint(onTimeout: () -> Unit) {\n    val latestTimeout by rememberUpdatedState(onTimeout)\n    LaunchedEffect(Unit) {\n        delay(3_000)\n        latestTimeout()\n    }\n    Text(\"Think aloud before you code\")\n}\n// Leaving composition cancels this effect.\n// Use DisposableEffect for subscriptions requiring cleanup.",
  "language": "kotlin",
  "pitfall": "A constant key does not mean once for the application or even once across recreation. It means this composition entry. Adding Stable annotations also does not make mutation observable; use observable state or publish new immutable values, and clean up external subscriptions with DisposableEffect.",
  "question": "When should an effect key change?",
  "answer": "Change a key when a changed input means the current operation is obsolete and should be canceled and replaced, such as loading a different user's data. Keep values fresh with rememberUpdatedState when they should influence the ongoing operation without resetting it, as onTimeout does here. Too few keys can leave stale work; too many can restart it unnecessarily. A follow-up is timer restoration: if the timeout must span recreation, store a suitable deadline in the appropriate owner instead of treating LaunchedEffect(Unit) as persistent execution.",
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
  "summary": "A View hierarchy measures sizes against parent constraints, assigns positions during layout, and draws its contents. requestLayout requests another size and position pass; invalidate requests a redraw. Parent ViewGroups can intercept gestures. In LegacyLabel, AndroidView creates a TextView through factory and applies the current text through update, allowing a legacy widget to participate in Compose without recreating it whenever the text changes.",
  "useCase": "Use this when migrating a screen that depends on a mature custom widget or SDK View. Keep its construction and resource ownership inside AndroidView, then map Compose state into widget properties and translate widget interactions into callbacks.",
  "code": "@Composable\nfun LegacyLabel(text: String) {\n    AndroidView(\n        factory = { context -> TextView(context) },\n        update = { view -> view.text = text },\n        modifier = Modifier.fillMaxWidth()\n    )\n}\n// factory creates the View; update applies current Compose state.\n// The opposite direction uses ComposeView inside a View hierarchy.",
  "language": "kotlin",
  "pitfall": "Retaining a View outside AndroidView can retain an obsolete Activity context. An update callback may run repeatedly, so avoid accumulating listeners or restarting expensive work on every invocation. Custom gesture handling must reset after ACTION_CANCEL and expose clicks through performClick for accessibility.",
  "question": "Why separate AndroidView factory and update?",
  "answer": "factory constructs the View for a particular AndroidView instance; update synchronizes that existing View with the latest Compose state and also runs after creation. In the example, changing text updates TextView.text while preserving the widget instance. Creating the widget in update would repeatedly discard its state and complicate cleanup. Put initial setup in factory, keep repeated property synchronization in update, and handle release of owned resources when the View leaves composition. For recycled Views, also define how old item state is reset.",
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
  "summary": "A unit test isolates a behavior by controlling its dependencies and asserting observable results. A fake supplies predictable behavior through the same interface as production. Here, Greeting receives FakeUserSource and returns Hello, Ada without a device or network. runTest provides a coroutine test scope and scheduler; virtual time becomes useful when tested work includes delays, debounce, retries, or concurrently scheduled tasks rather than this immediate result.",
  "useCase": "Test repository or ViewModel behavior with a fake that can return cached data, fail a refresh, and succeed on retry. Control the dispatcher and scheduler so each transition is reproducible and the test does not wait for real time.",
  "code": "interface UserSource { suspend fun name(): String }\nclass FakeUserSource : UserSource {\n    override suspend fun name() = \"Ada\"\n}\nclass Greeting(private val source: UserSource) {\n    suspend fun text() = \"Hello, \" + source.name()\n}\n@Test fun greetsLoadedUser() = runTest {\n    assertEquals(\"Hello, Ada\", Greeting(FakeUserSource()).text())\n}\n// Requires kotlinx-coroutines-test and a test assertion library.",
  "language": "kotlin",
  "pitfall": "runTest does not virtualize arbitrary work on Dispatchers.IO or Default. Inject test dispatchers sharing one scheduler, replace Main only where needed, and restore it afterward. A fake that always succeeds cannot validate cancellation, stale content, refresh failures, or recovery behavior.",
  "question": "What should tests assert for a failed refresh with cached data?",
  "answer": "Assert that previously cached items remain available, the state communicates that refreshing failed, and a retry can replace the stale content with a successful result. Use a controllable fake to arrange the failure and recovery, then inspect the public state rather than private method calls. If timing matters, advance the shared scheduler deliberately and check the boundary before and after retry. Distinguish a refresh error with usable content from an initial load failure with no content; they require different user experiences.",
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
  "summary": "UI tests verify that user actions produce the expected screen behavior through the actual toolkit. Compose exposes a semantics tree containing text, roles, state, and supported actions; Espresso operates on Views. The example locates the editable node by its text action, enters Ada, and verifies that Ada is displayed. This checks the SearchBox callback and state loop together, beyond testing its individual functions.",
  "useCase": "Cover a critical search or retry journey using semantic selectors and controlled data. Exercise the visible control, verify the resulting state, and add an error or empty case so a passing happy path does not hide an unusable screen.",
  "code": "// Compose test class; SearchBox comes from the Compose lesson.\n@get:Rule val composeRule = createComposeRule()\n@Test fun editsSearch() {\n    composeRule.setContent {\n        var query by remember { mutableStateOf(\"\") }\n        SearchBox(query, onQueryChange = { query = it })\n    }\n    composeRule.onNode(hasSetTextAction()).performTextInput(\"Ada\")\n    composeRule.onNodeWithText(\"Ada\").assertIsDisplayed()\n}\n// Espresso equivalent for a View button:\n// onView(withId(R.id.retry)).perform(click())",
  "language": "kotlin",
  "pitfall": "Automatic synchronization covers framework work, not every custom coroutine, network operation, or external callback. Use controllable dependencies and suitable idling resources or condition waits. A merged semantics tree can hide child nodes, so inspect the tree before weakening assertions or using coordinates.",
  "question": "Why use semantics instead of pixel positions in Compose tests?",
  "answer": "Semantics identify what a control means and what a user can do with it, rather than where it happens to be drawn. Density, font size, localization, and adaptive layouts can move a text field while preserving its editing action. The example therefore finds hasSetTextAction and checks the entered text. Choose selectors that identify the intended control uniquely, inspect merged versus unmerged semantics when necessary, and separately test visual layout when appearance itself is the requirement. Semantic tests do not establish that every pixel is correct.",
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
  "summary": "An ANR means the app missed a system responsiveness deadline; the relevant deadline depends on the operation. Main-thread I/O, expensive computation, lock contention, and synchronous calls into other processes can contribute. A memory leak instead keeps objects reachable after their useful lifetime. The example enables debug StrictMode logging for main-thread disk and network work, providing diagnostic clues without proving that all responsiveness or retention problems are absent.",
  "useCase": "Investigate a screen that freezes during refresh or retains Activities after navigation. Reproduce the interaction, correlate thread traces with its timing, and inspect heap reference paths so the fix addresses the blocking dependency or retaining owner actually responsible.",
  "code": "// Debug-only diagnostics; invoke during Application startup.\nif (BuildConfig.DEBUG) {\n    StrictMode.setThreadPolicy(\n        StrictMode.ThreadPolicy.Builder()\n            .detectDiskReads()\n            .detectDiskWrites()\n            .detectNetwork()\n            .penaltyLog()\n            .build()\n    )\n}\n// Inspect stacks/traces; remove the cause, not just the detector.",
  "language": "kotlin",
  "pitfall": "A late thread dump may show an idle main thread after the original stall has ended. StrictMode is a detector, not an ANR or leak test. Moving work to I/O still leaves the UI blocked if it waits for that work through a shared lock.",
  "question": "How would you confirm a suspected Activity leak?",
  "answer": "Repeatedly recreate and leave the Activity, then capture a heap dump after giving normal cleanup and garbage collection a chance to run. Identify obsolete Activity instances and inspect their strong reference paths to longer-lived owners, such as a singleton listener registry, queued callback, or running task. A rising allocation count alone is not proof of a leak. Remove or shorten the retaining ownership, repeat the same scenario, and confirm that old instances become collectible rather than merely reducing total heap size in one snapshot.",
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
  "summary": "Build types configure execution and packaging choices such as debugging and optimization, while product flavors represent alternative products or environments. Their combinations form build variants. The release configuration enables code minification and resource shrinking, applies the optimized default rules, and adds project rules. R8 can remove unreachable code, rewrite implementations, and rename symbols, so behavior must be validated in the optimized artifact actually distributed to users.",
  "useCase": "Prepare a release candidate that is smaller and faster while keeping production failures diagnosable. Exercise critical flows in the minified variant, archive its matching mapping file, and verify its selected resources, endpoint configuration, signing, and manifest before distribution.",
  "code": "// Module build.gradle.kts; Android Gradle plugin already configured.\nandroid {\n    buildTypes {\n        getByName(\"release\") {\n            isMinifyEnabled = true\n            isShrinkResources = true\n            proguardFiles(\n                getDefaultProguardFile(\"proguard-android-optimize.txt\"),\n                \"proguard-rules.pro\"\n            )\n        }\n    }\n}",
  "language": "kotlin",
  "pitfall": "Reflection and native lookups can reference code that static analysis cannot discover. Use narrowly justified keep rules; keeping whole packages can hide missing rules while sacrificing optimization. Archive mappings for each released build, and keep signing credentials and private keys outside source control.",
  "question": "How are a build type and a flavor different?",
  "answer": "A build type describes how a version is built, such as a debuggable build or an optimized release. A flavor describes which product configuration is built, such as demo versus full. With those two flavors and debug/release types, variants include demoDebug and fullRelease. Each flavor dimension contributes one choice to a variant. Use source sets and configuration overrides for genuine differences, then test relevant combinations: passing demoDebug does not prove fullRelease works after resource merging, reflection-sensitive shrinking, or changes to service configuration.",
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
  "summary": "Android security depends on explicit trust boundaries: validate external input, limit exported components, and grant access only to intended data. HTTPS should retain certificate and hostname validation, with Network Security Config defining scoped trust exceptions. The example converts a private PDF into a FileProvider content URI and grants temporary read access to its recipient, allowing sharing without making the underlying directory broadly readable.",
  "useCase": "Share an app-generated report with a document viewer or messaging app while keeping the rest of private storage inaccessible. Configure a narrow provider path, verify the recipient can open the content URI, and keep development certificate trust out of release builds.",
  "code": "// FileProvider must be declared with a narrow XML paths policy.\nval uri = FileProvider.getUriForFile(\n    context, context.packageName + \".files\", reportFile\n)\nval share = Intent(Intent.ACTION_SEND).apply {\n    type = \"application/pdf\"\n    putExtra(Intent.EXTRA_STREAM, uri)\n    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)\n}\ncontext.startActivity(Intent.createChooser(share, \"Share report\"))\n// context here is an Activity; reportFile is inside allowed paths.",
  "language": "kotlin",
  "pitfall": "A FileProvider is only as restrictive as its declared paths: exposing a broad root can disclose unrelated files. Temporary access grants do not make sensitive payloads harmless. Never bypass TLS verification to fix connectivity or treat R8 obfuscation as a safe place for secrets.",
  "question": "Why separate debug certificate trust from release?",
  "answer": "Development proxies and private test servers may need certificate authorities that should never become trusted for production traffic. Put those authorities in Network Security Config debug-overrides, which apply when the application is debuggable, and retain normal trust validation for release. Check the merged release manifest and packaged configuration rather than assuming the source folder guarantees isolation. Also verify certificate expiry and hostname failures still fail correctly. This preserves useful debugging access while avoiding a production client that silently trusts interception certificates or accepts every server certificate.",
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
  "summary": "Notifications are a user-controlled presentation surface, while push messages are signals delivered under background execution constraints. Android 8 and later use channels; Android 13 and later require permission for non-exempt notifications. The example creates a messages channel with default importance, but does not post a notification. A reliable inbox still reads durable server or local records, even when alerts are disabled or a push never arrives.",
  "useCase": "Build messaging that remains correct when notification permission is denied, a device is offline, or a push is repeated. Reconcile message records through the repository and use notifications to announce eligible changes without making alerts the only route to those records.",
  "code": "if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {\n    val channel = NotificationChannel(\n        \"messages\",\n        context.getString(R.string.messages_channel),\n        NotificationManager.IMPORTANCE_DEFAULT\n    )\n    context.getSystemService(NotificationManager::class.java)\n        .createNotificationChannel(channel)\n}\n// Before posting: check permission and channel/app settings.\n// Notification taps use explicit, appropriately immutable PendingIntents.",
  "language": "kotlin",
  "pitfall": "Creating an existing channel does not override the user's settings or raise its importance. Push callbacks have limited processing time, and notification payload handling differs between foreground and background. Deduplicate by stable record identity and schedule longer processing through an appropriate persistent mechanism.",
  "question": "What should happen after receiving a “new message” push?",
  "answer": "Treat the push as a hint that the repository should synchronize the inbox. Fetch authorized changes, merge them into durable storage, and deduplicate using stable server message IDs so retries cannot create duplicate rows. Respect notification permission and channel settings before posting an alert. Keep processing within the callback's short execution window or schedule longer work with WorkManager. Reconcile on ordinary app entry as well, because a missing push must not create a permanent gap. Keep sensitive details out of payloads and lock-screen presentation where possible.",
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
  "summary": "Accessibility semantics communicate a control's purpose, role, current state, and available actions. Localization covers resource selection, text direction, plural rules, formatting, and layouts that tolerate different text lengths. CompactSetting makes the whole labeled row toggleable with a switch role; the child Switch has no independent change callback. The user therefore gets one coherent action with its checked state rather than competing row and switch interactions.",
  "useCase": "Review a settings screen with TalkBack, large fonts, and a right-to-left locale. Confirm each row announces its purpose and state, toggles through one accessible action, and leaves enough room for translated labels without clipping or hiding the control.",
  "code": "@Composable\nfun CompactSetting(enabled: Boolean, onChange: (Boolean) -> Unit) {\n    Row(Modifier.fillMaxWidth().toggleable(\n        value = enabled, role = Role.Switch,\n        onValueChange = onChange\n    ).padding(16.dp)) {\n        Text(stringResource(R.string.compact_layout),\n            modifier = Modifier.weight(1f))\n        Switch(checked = enabled, onCheckedChange = null)\n    }\n}\n// One accessible row action; child Switch delegates interaction.",
  "language": "kotlin",
  "pitfall": "Adding content descriptions to every icon or repeating visible labels can make announcements noisy. Concatenated translated fragments break grammar and word order. Do not fix overflow with tiny text; support wrapping, appropriate touch targets, locale-aware formatting, and explicit checks of focus order and RTL behavior.",
  "question": "Why use start/end instead of left/right spacing?",
  "answer": "Start and end describe positions relative to the current layout direction. They place leading content and spacing correctly in both left-to-right and right-to-left layouts without maintaining duplicate arrangements. Physical left and right are appropriate only when the meaning is genuinely physical. Direction-sensitive icons and directional content also need review: media timelines, numbers, and mixed-direction text do not all follow identical mirroring rules. Test the localized screen with actual translated strings and large fonts, since relative spacing alone cannot prevent clipping, incorrect ordering, or confusing announcements.",
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
  "summary": "Android normally hosts an app's components in a Linux process, with separate processes available when explicitly configured. ART runs DEX code using runtime and compilation services and manages garbage collection. Binder transports calls across process boundaries. A Handler targets an existing Looper and its thread: the example queues renderStatus on the main thread, and removeCallbacks can cancel that queued Runnable before delivery; neither operation creates background execution.",
  "useCase": "Explain a freeze caused by posting expensive work to the main Handler or waiting on a remote service. Identify the executing thread, the IPC boundary, and the owning lifecycle before choosing a dispatcher, cancellation mechanism, or smaller data exchange.",
  "language": "kotlin",
  "code": "val mainHandler = Handler(Looper.getMainLooper())\nval update = Runnable { renderStatus(\"Ready\") }\nmainHandler.post(update) // Executes on main; does not create a thread.\n// If the owning UI is destroyed before delivery:\nmainHandler.removeCallbacks(update)\n\n// Prefer lifecycle-scoped coroutines for new screen-owned async work.\n// Blocking Binder calls can wait for another process; avoid on main.\n// renderStatus is an app-specific UI callback.",
  "pitfall": "Posting work changes when it runs, not its thread. In this snippet, removeCallbacks illustrates cleanup: call it at UI teardown, rather than immediately after post if the update should run. Synchronous Binder calls can block; callbacks can retain UI references, and a process singleton is neither cross-process nor persistent.",
  "question": "Does garbage collection prevent memory leaks?",
  "answer": "No. Garbage collection reclaims objects that are no longer strongly reachable; it does not decide that a reachable Activity has become useless. A singleton listener, queued Runnable, or long-running task can keep a destroyed Activity and its entire View hierarchy alive. Release the reference when its owner no longer needs it, remove callbacks or unregister listeners where appropriate, and avoid placing UI owners in process-wide state. Confirm the diagnosis through heap reference paths and repeat the lifecycle scenario after the fix rather than assuming GC will eventually compensate.",
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
