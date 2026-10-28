/* Android UI architecture. Load after content-android.js.
 * Kotlin examples are contextual: imports and app wiring are described inline.
 */
(() => {
  const android = (window.PRIMERS || []).find(section => section.id === 'android');
  if (!android) throw new Error('Load the Android Primer before its architecture lessons.');

  const sources = [
    {title: 'Android UI layer and unidirectional data flow', url: 'https://developer.android.com/topic/architecture/ui-layer'},
    {title: 'Android state holders and UI state', url: 'https://developer.android.com/topic/architecture/ui-layer/stateholders'},
    {title: 'MVVM responsibilities (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm'},
    {title: 'MVI: View and Intent (Hannes Dorfmann)', url: 'https://hannesdorfmann.com/android/mosby3-mvi-2/'},
    {title: 'MVI: State Reducer (Hannes Dorfmann)', url: 'https://hannesdorfmann.com/android/mosby3-mvi-3/'}
  ];
  for (const source of sources) {
    if (!android.sources.some(existing => existing.url === source.url)) android.sources.push(source);
  }

  const lessons = [
    {
      id: 'android-mvvm', title: 'What is MVVM?',
      summary: "Model-View-ViewModel separates responsibilities: the Model holds application data and business rules; the View renders the UI; the ViewModel exposes presentation state and handles actions without owning the View. In this searchable articles screen, a repository supplies model data, ArticlesMvvmViewModel exposes one read-only state stream, and the View forwards query edits. This is MVVM with unidirectional data flow: actions go up and state comes down. MVVM does not require two-way binding, XML, or a particular library.",
      useCase: "Explain who owns search text, loading, results, and errors when building a Compose or Fragment articles screen. Trace an edit from the View into the ViewModel, through a replaceable repository, and back into renderable state; then test that flow without creating a View.",
      language: 'kotlin',
      code: `// Imports omitted: lifecycle ViewModel/viewModelScope; coroutines
// Job/launch/ensureActive; flow MutableStateFlow/asStateFlow; IOException.
// @MainThread is androidx.annotation.MainThread. Article is immutable.
data class Article(val id: String, val title: String)
data class ArticleSearchState(
    val query: String = "", val articles: List<Article> = emptyList(),
    val loading: Boolean = false, val error: String? = null
)
// search is main-safe, returns immutable snapshots, and can throw IOException.
interface ArticleRepository {
    suspend fun search(query: String): List<Article>
}
class ArticlesMvvmViewModel(private val repo: ArticleRepository) : ViewModel() {
    private val mutableState = MutableStateFlow(ArticleSearchState())
    val state = mutableState.asStateFlow()
    private var searchJob: Job? = null

    @MainThread fun onQueryChange(query: String) {
        searchJob?.cancel()
        mutableState.value = ArticleSearchState(
            query = query, loading = query.isNotBlank()
        )
        if (query.isBlank()) return
        searchJob = viewModelScope.launch {
            try {
                val rows = repo.search(query)
                coroutineContext.ensureActive() // Reject canceled results.
                mutableState.value = ArticleSearchState(query, rows)
            } catch (error: IOException) {
                coroutineContext.ensureActive()
                mutableState.value = ArticleSearchState(
                    query = query, error = "Search unavailable"
                )
            }
        }
    }
}
// View: collect state with lifecycle awareness; send edits to onQueryChange.`,
      pitfall: "A Jetpack ViewModel instance alone does not establish MVVM boundaries. Keep View references out, delegate data access, and expose read-only state. Here, actions and state commits run on the main thread; canceling the previous job and checking cancellation before commits prevent old results replacing a newer query. The pattern name supplies neither thread safety nor durable event delivery.",
      question: 'Is MVVM necessarily bidirectional, and is every Android ViewModel MVVM?',
      answer: "No to both. MVVM describes the responsibilities of the Model, View, and ViewModel; it does not require the View to mutate public ViewModel properties through two-way binding. This example uses callbacks and a read-only StateFlow, so it also follows unidirectional data flow. Jetpack ViewModel is a lifecycle-aware state-holder class, not a complete architecture: it can host MVVM, an MVI store, or poorly separated code. In an interview, identify the observable state, action entry points, data dependencies, and lifecycle owner. Then explain cancellation, restoration, and testing as explicit implementation decisions rather than benefits guaranteed by the acronym.",
      quiz: {
        question: 'Which implementation can still be MVVM?',
        options: ['A View observes read-only state and calls ViewModel methods', 'Only XML with two-way data binding', 'Only a screen using an MVVM framework'],
        correct: 0,
        explanation: 'MVVM separates responsibilities. Read-only state plus callbacks is compatible with MVVM and unidirectional data flow.'
      }
    },
    {
      id: 'android-mvi', title: 'What is MVI?',
      summary: "Model-View-Intent organizes interaction as a cycle: the View describes user intent, processing produces new Model state, and the View renders that state. Intent here means a UI action such as QueryChanged, not android.content.Intent. MVI implementations vary; this lesson uses typed intents, immutable state snapshots, a pure reducer, and asynchronous effects outside that reducer. The same articles search runs inside a Jetpack ViewModel, showing that MVI and the ViewModel class are compatible rather than competing choices.",
      useCase: "Make a search screen's transitions explicit enough to review and test independently of networking. Trace QueryChanged to a loading state, run the repository effect, and reduce its success or failure into the next state. Use reducer tests for transitions and coroutine tests for cancellation and effect ordering.",
      language: 'kotlin',
      code: `// Reuse ArticleSearchState/ArticleRepository from the MVVM lesson.
// Same omitted imports and main-safe repository contract; add no framework.
sealed interface SearchIntent {
    data class QueryChanged(val text: String) : SearchIntent
}
sealed interface SearchChange {
    data class Started(val query: String) : SearchChange
    data class Loaded(val rows: List<Article>) : SearchChange
    data object Failed : SearchChange
}
fun reduce(s: ArticleSearchState, change: SearchChange): ArticleSearchState =
    when (change) { // Pure: no network, coroutine launch, or mutation.
        is SearchChange.Started -> ArticleSearchState(
            query = change.query, loading = change.query.isNotBlank())
        is SearchChange.Loaded -> s.copy(articles = change.rows, loading = false, error = null)
        SearchChange.Failed -> s.copy(loading = false, error = "Search unavailable")
    }
class ArticlesMviViewModel(private val repo: ArticleRepository) : ViewModel() {
    private val mutableState = MutableStateFlow(ArticleSearchState())
    val state = mutableState.asStateFlow()
    private var searchJob: Job? = null
    private fun commit(change: SearchChange) {
        mutableState.value = reduce(mutableState.value, change)
    }
    @MainThread fun accept(intent: SearchIntent) {
        when (intent) {
            is SearchIntent.QueryChanged -> {
                searchJob?.cancel()
                commit(SearchChange.Started(intent.text))
                if (intent.text.isBlank()) return
                searchJob = viewModelScope.launch { // Async effect, outside reduce.
                    try {
                        val rows = repo.search(intent.text)
                        coroutineContext.ensureActive()
                        commit(SearchChange.Loaded(rows))
                    } catch (error: IOException) {
                        coroutineContext.ensureActive()
                        commit(SearchChange.Failed)
                    }
                }
            }
        }
    }
}
// View sends accept(SearchIntent.QueryChanged(text)) and observes state.`,
      pitfall: "Do not launch requests inside a reducer: a pure reducer must produce the same next state from the same inputs. Intent and result names are implementation conventions, not universal MVI rules. Here, main-thread confinement plus cancellation checks prevent stale commits; a different concurrent effect policy needs its own ordering or request-identity rules. CancellationException is allowed to propagate, and MVI does not itself guarantee event delivery.",
      question: 'What makes the reducer useful, and where does asynchronous work belong?',
      answer: "The reducer turns a previous state and a change into a new state without performing side effects. A unit test can therefore pass Started, Loaded, or Failed and check the exact result without Android or a repository. The surrounding ViewModel interprets QueryChanged, cancels obsolete work, performs the repository call, and commits a result only while its job is active. Test that orchestration separately with controlled coroutine execution. This is one common reducer-based MVI design; other implementations organize processing differently. Typed intents make the input vocabulary explicit, but they do not automatically serialize effects, preserve actions through process death, or make shared mutable objects safe.",
      quiz: {
        question: 'What belongs inside this pure MVI reducer?',
        options: ['Launching the repository request', 'Computing the next immutable state from state and change', 'Sending an Android Intent to another Activity'],
        correct: 1,
        explanation: 'The reducer computes state. The ViewModel performs the asynchronous repository effect and sends its result back as a change.'
      }
    },
    {
      id: 'android-mvvm-vs-mvi', title: 'MVVM vs MVI',
      summary: "MVVM emphasizes the separation between View, presentation state, and application model. MVI emphasizes an explicit intent-to-state cycle, often with a reducer and controlled effects. They overlap: MVVM can use unidirectional data flow, and an MVI implementation commonly lives in a Jetpack ViewModel. For the same searchable articles screen, both can expose identical state and behavior. The adapters below connect the same UI to either implementation; the design difference is how actions and transitions are organized internally.",
      useCase: "Compare architecture choices using one scenario: type kot, replace it with kotlin before the first request finishes, and show only the latest results. Evaluate how each design expresses loading, failure, cancellation, restoration, and tests. Prefer the smallest conventions that make your team's actual transition complexity clear.",
      language: 'kotlin',
      code: `// Uses both previous ViewModels and their common ArticleSearchState.
// Imports omitted: StateFlow, Compose Material3/layout/lazy APIs,
// getValue, and androidx.lifecycle.compose.collectAsStateWithLifecycle.
interface ArticleSearchPort {
    val state: StateFlow<ArticleSearchState>
    fun queryChanged(text: String) // Called on the main thread.
}
fun mvvmPort(vm: ArticlesMvvmViewModel) = object : ArticleSearchPort {
    override val state = vm.state
    override fun queryChanged(text: String) = vm.onQueryChange(text)
}
fun mviPort(vm: ArticlesMviViewModel) = object : ArticleSearchPort {
    override val state = vm.state
    override fun queryChanged(text: String) =
        vm.accept(SearchIntent.QueryChanged(text))
}
@Composable
fun ArticleSearchScreen(port: ArticleSearchPort) {
    val state by port.state.collectAsStateWithLifecycle()
    Column {
        OutlinedTextField(
            value = state.query,
            onValueChange = port::queryChanged,
            label = { Text("Search articles") }
        )
        if (state.loading) CircularProgressIndicator()
        state.error?.let { Text(it) }
        LazyColumn {
            items(state.articles, key = { it.id }) { article ->
                Text(article.title)
            }
        }
    }
}
// The host passes mvvmPort(vm) OR mviPort(vm) to this same screen.
// Both clear old rows while loading and reject canceled query results.`,
      pitfall: "Avoid comparing messy MVVM with carefully implemented MVI. Either can expose one immutable state stream, support deterministic tests, and mishandle concurrency. MVI's typed changes add useful transition structure when complexity warrants it, but also add types and routing. Neither label mandates a library or two-way binding, guarantees exactly-once delivery, or replaces explicit threading, cancellation, and persistence policies.",
      question: 'How would you choose between MVVM and MVI in an interview?',
      answer: "Start with the screen's behavior and the team's conventions. For a small search screen, observable state and focused ViewModel methods may communicate the design clearly. When many actions and asynchronous results interact, a typed intent vocabulary and pure reducer may make transitions easier to inspect and test. These are compatible choices: you can add reducer-based processing inside an MVVM-style ViewModel. Compare both against the same rapid-query, loading, failure, and restoration scenarios. Explain the cost of added routing and types alongside any clarity gained. Do not claim that MVI alone provides unidirectional flow or that either acronym determines event reliability and thread safety.",
      quiz: {
        question: 'Which comparison is accurate?',
        options: ['MVVM cannot use unidirectional data flow', 'MVI cannot use a Jetpack ViewModel', 'Both can render the same state; MVI often makes intents and transitions more explicit'],
        correct: 2,
        explanation: 'The patterns overlap. Compare concrete ownership, transition, and effect policies rather than treating ViewModel or UDF as exclusive to one label.'
      }
    }
  ];
  const additions=lessons.filter(lesson=>!android.lessons.some(existing=>existing.id===lesson.id));
  const afterCompose=android.lessons.findIndex(lesson=>lesson.id==='compose')+1;
  android.lessons.splice(afterCompose,0,...additions);
})();
