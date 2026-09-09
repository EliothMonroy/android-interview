/* Practical Android interview follow-ups. Load after content-android.js. */
(() => {
  const android = window.PRIMERS.find(section => section.id === 'android');
  android.sources.push(
    {title: 'Room entities and indexes', url: 'https://developer.android.com/training/data-storage/room/defining-data'},
    {title: 'Room DAO queries', url: 'https://developer.android.com/training/data-storage/room/accessing-data'},
    {title: 'Compose in Views and disposal', url: 'https://developer.android.com/develop/ui/compose/migrate/interoperability-apis/compose-in-views'},
    {title: 'UI events and state', url: 'https://developer.android.com/topic/architecture/ui-layer/events'}
  );
  android.lessons.push(
    {
      id: 'room-query-model', title: 'Room entities, queries & indexes',
      summary: 'An entity defines stored rows; a DAO defines access. Bind query parameters instead of concatenating SQL. Choose indexes for actual filters and ordering, then inspect the query plan.',
      useCase: 'Observe the newest notes for one account without loading every account into memory.',
      language: 'kotlin',
      code: `// Room 2 example; requires compiler setup and a RoomDatabase.
@Entity(tableName = "notes", indices = [Index(value = ["ownerId", "updatedAt"])])
data class NoteRow(
    @PrimaryKey val id: String,
    val ownerId: String,
    val title: String,
    val updatedAt: Long
)
@Dao
interface NotesDao {
    @Query("SELECT * FROM notes WHERE ownerId = :owner " +
           "ORDER BY updatedAt DESC, id DESC LIMIT 50")
    fun observeRecent(owner: String): Flow<List<NoteRow>>

    @Upsert suspend fun save(note: NoteRow)
}
// IDs are globally unique here. Equal timestamps use id as a tie-breaker.`,
      pitfall: 'Indexes cost disk space and write work. This index helps the owner/time lookup but does not fully cover the ID tie-break ordering. Use Paging for a browsable large result set.',
      question: 'Why put ownerId first in this composite index?',
      answer: 'The query first restricts to one owner, then reads that owner’s timestamps. Index column order should follow the workload; an index is not equally useful for every predicate.',
      quiz: {question: 'Which parameter usage avoids SQL string injection here?', options: ['Concatenate owner into the SQL', 'Use the :owner bind parameter', 'Escape only spaces'], correct: 1, explanation: 'Room binds the argument as a value rather than interpreting it as SQL syntax.'}
    },
    {
      id: 'fragment-compose-disposal', title: 'Fragment view cleanup & Compose disposal',
      summary: 'A Fragment can remain alive after its view is destroyed. Release binding references at onDestroyView and tie embedded Compose disposal to the view lifecycle.',
      useCase: 'Add Compose to a Fragment while keeping navigation back-stack behavior leak-free.',
      language: 'kotlin',
      code: `// fragment_hybrid.xml contains a ComposeView with id composePanel.
class HybridFragment : Fragment(R.layout.fragment_hybrid) {
    private var binding: FragmentHybridBinding? = null
    override fun onViewCreated(view: View, state: Bundle?) {
        super.onViewCreated(view, state)
        binding = FragmentHybridBinding.bind(view)
        binding?.composePanel?.apply {
            setViewCompositionStrategy(
                ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
            )
            setContent { Text("Hybrid screen") }
        }
    }
    override fun onDestroyView() {
        binding = null
        super.onDestroyView()
    }
}
// Collect view state with viewLifecycleOwner, not Fragment lifecycle.`,
      pitfall: 'Nulling the binding does not remove other references. Unregister custom listeners and detach adapters when a longer-lived owner would otherwise retain the destroyed view.',
      question: 'Why not dispose the composition only when the Fragment is destroyed?',
      answer: 'The Fragment may stay on the back stack while its old view is gone. Its composition should end with that view rather than retaining UI work until the Fragment itself dies.',
      quiz: {question: 'Which lifetime should an embedded Fragment ComposeView follow?', options: ['The entire process', 'The Fragment’s view lifecycle', 'A global singleton'], correct: 1, explanation: 'The composition belongs to this view instance; a recreated view gets a new composition.'}
    },
    {
      id: 'compose-scroll-state', title: 'Scroll state, derived values & identity',
      summary: 'Use derivedStateOf when rapidly changing state produces a less frequently changing UI decision. snapshotFlow exposes snapshot reads as a Flow. Stable list keys preserve item identity across reordering.',
      useCase: 'Show a scroll affordance only after leaving the first item, while retaining each row’s expanded state.',
      language: 'kotlin',
      code: `@Composable
fun ExpandableFeed(rows: List<Article>) {
    val listState = rememberLazyListState()
    val pastFirst by remember {
        derivedStateOf { listState.firstVisibleItemIndex > 0 }
    }
    Column {
        if (pastFirst) Text("More above")
        LazyColumn(state = listState) {
            items(rows, key = { it.id }) { row ->
                var expanded by rememberSaveable { mutableStateOf(false) }
                TextButton(onClick = { expanded = !expanded }) {
                    Text(if (expanded) row.body else row.title)
                }
            }
        }
    }
}
// Article has unique String id, body, title; imports omitted.
// In an effect: snapshotFlow { listState.firstVisibleItemIndex }
// emits changed index values for a collector.`,
      pitfall: 'derivedStateOf adds overhead; it is not needed for every computed property. Save only small supported state and use Bundle-compatible keys when item state must be restored.',
      question: 'Why does using the list index as the key cause trouble after insertion?',
      answer: 'An index describes a position, not the item. Inserting at the front shifts positions, so remembered row state can become associated with a different item.',
      quiz: {question: 'Which key best preserves expansion when rows reorder?', options: ['The current index', 'A new random value every recomposition', 'A unique stable article ID'], correct: 2, explanation: 'The ID follows the same logical item when its position changes.'}
    },
    {
      id: 'ui-outcomes-navigation', title: 'UI outcomes & navigation events',
      summary: 'Represent important outcomes as state that a returning UI can read. Let the UI perform navigation. A one-shot broadcast can be missed while stopped; a channel does not make delivery durably exactly once.',
      useCase: 'Keep a saved-note confirmation available through recreation and navigate when the user chooses to continue.',
      language: 'kotlin',
      code: `class EditorViewModel(private val saved: SavedStateHandle) : ViewModel() {
    val savedId = saved.getStateFlow<String?>("savedId", null)
    // Call after the repository has durably saved the note:
    fun recordSaved(id: String) { saved["savedId"] = id }
    fun startAnother() { saved["savedId"] = null }
}
@Composable
fun SaveConfirmation(vm: EditorViewModel, openNote: (String) -> Unit) {
    val savedId by vm.savedId.collectAsStateWithLifecycle()
    val id = savedId
    if (id != null) {
        Button(onClick = { openNote(id) }) { Text("Open saved note") }
    }
}
// SavedStateHandle restores small UI state, not durable business data.
// Reconcile with persisted notes after a fresh launch.`,
      pitfall: 'Never perform navigation directly in the composable body. If auto-navigation is required, define its restoration and consumption policy; clearing state before navigation can lose the transition.',
      question: 'Does StateFlow guarantee every intermediate outcome is observed?',
      answer: 'No. It conflates state. Model the current truth or persist a queue when every operation matters. For critical results, restore from the repository rather than trusting an in-memory event stream.',
      quiz: {question: 'A save completes while the UI is stopped. What preserves the outcome?', options: ['Only emit into SharedFlow with replay 0', 'Persist the note and expose recoverable result state', 'Assume the UI callback always runs'], correct: 1, explanation: 'Durable data survives process loss, while result state gives a returning UI something explicit to render.'}
    }
  );
})();
