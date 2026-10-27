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
      summary: "Room entities define stored tables and DAO methods define typed access, including parameter binding and observable queries. The example stores globally unique notes and observes at most 50 rows for one owner, ordered by newest timestamp and then ID. Its composite index groups rows by owner and timestamp, helping that access pattern; the extra ID ordering makes equal timestamps deterministic but is not fully supplied by the shown index.",
      useCase: "Display one account's recent notes from local storage while database updates drive the UI. Use bound parameters, a stable tie-break order, and a query-shaped index; inspect the query plan with realistic data before adding more indexes or loading larger histories.",
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
      pitfall: "The owner/time index helps filtering and timestamp order but does not fully satisfy ORDER BY updatedAt DESC, id DESC. Extra indexes consume storage and slow writes. A Flow query can rerun after table changes even when its result is unchanged; apply distinctUntilChanged if needed.",
      question: 'Why put ownerId first in this composite index?',
      answer: "The equality filter selects one owner's contiguous range in an index whose first column is ownerId. Within that range, updatedAt is ordered, so SQLite can traverse recent timestamps efficiently instead of examining every account's rows. This does not automatically provide the final id DESC tie-break ordering, and SELECT * is not covered by these two columns. Inspect EXPLAIN QUERY PLAN before extending the index. Reversing the column order changes which workloads it serves well; choose it from actual filters and sorting needs rather than assuming all composite orders are equivalent.",
      quiz: {question: 'Which parameter usage avoids SQL string injection here?', options: ['Concatenate owner into the SQL', 'Use the :owner bind parameter', 'Escape only spaces'], correct: 1, explanation: 'Room binds the argument as a value rather than interpreting it as SQL syntax.'}
    },
    {
      id: 'fragment-compose-disposal', title: 'Fragment view cleanup & Compose disposal',
      summary: "A Fragment instance and its current View hierarchy have different lifetimes: navigation can destroy the view while retaining the Fragment on the back stack. HybridFragment clears its binding in onDestroyView and configures DisposeOnViewTreeLifecycleDestroyed before setting Compose content. The embedded composition therefore ends when that View tree's LifecycleOwner is destroyed. Returning creates a fresh view and composition instead of continuing work tied to the obsolete UI.",
      useCase: "Introduce a Compose panel into an existing Fragment screen during incremental migration. Tie composition and state collection to that view instance, navigate away and back, and verify that the replacement view renders current state without retaining the previous hierarchy.",
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
      pitfall: "Clearing binding removes only that field's reference. Custom listeners, adapters, queued work, or Fragment-scoped collectors can still capture the destroyed view. Give multiple ComposeViews distinct IDs for saved-state restoration, and keep persistent screen state in an appropriate owner rather than relying on the old composition.",
      question: 'Why not dispose the composition only when the Fragment is destroyed?',
      answer: "The Fragment may survive on the back stack after onDestroyView, so waiting for the Fragment's destruction would keep the old composition alive too long. Its effects, remembered objects, and captured View references belong to the old UI instance. DisposeOnViewTreeLifecycleDestroyed aligns disposal with the lifecycle installed on that view tree, and the next view gets a new composition. Keep durable or screen-level state outside the composition as needed. Verify disposal by navigating away and back and checking that old effects stop while the replacement UI restores the intended state.",
      quiz: {question: 'Which lifetime should an embedded Fragment ComposeView follow?', options: ['The entire process', 'The Fragment’s view lifecycle', 'A global singleton'], correct: 1, explanation: 'The composition belongs to this view instance; a recreated view gets a new composition.'}
    },
    {
      id: 'compose-scroll-state', title: 'Scroll state, derived values & identity',
      summary: "Compose state should reflect both update frequency and logical identity. The example remembers a LazyListState and derives whether its first visible item index exceeds zero, so the More above decision changes less often than scrolling. Each article uses its stable String ID as a key and keeps a small saveable expansion flag. snapshotFlow can expose snapshot reads to a coroutine collector, emitting a new value when the observed result changes.",
      useCase: "Build a feed whose rows retain expansion when new articles arrive at the top. Derive a simple scroll affordance from list position, and collect scroll thresholds in an effect when analytics or another asynchronous observer needs those changes.",
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
      pitfall: "derivedStateOf has a cost and helps only when the derived result changes less often than its inputs. Random or positional keys break identity; duplicate keys are invalid. Use supported saveable values and Bundle-compatible keys, and do not assume snapshotFlow records every intermediate scroll position.",
      question: 'Why does using the list index as the key cause trouble after insertion?',
      answer: "An index identifies a position rather than an article. If article A occupies index zero and a new article is inserted before it, index zero now belongs to the new article; state associated with that key can follow the position. A stable unique article ID follows A as it moves, preserving its remembered expansion correctly. Keep the key stable across refreshes and use a saveable key type when restoring item state matters. Test insertion, deletion, and reordering with expanded rows; a list that only appends can conceal this bug.",
      quiz: {question: 'Which key best preserves expansion when rows reorder?', options: ['The current index', 'A new random value every recomposition', 'A unique stable article ID'], correct: 2, explanation: 'The ID follows the same logical item when its position changes.'}
    },
    {
      id: 'ui-outcomes-navigation', title: 'UI outcomes & navigation events',
      summary: "Important outcomes should remain discoverable as state while durable business results live in the repository. EditorViewModel exposes a saved note ID through SavedStateHandle, and SaveConfirmation renders an Open saved note button when that ID exists. Navigation happens from the user's click callback rather than during composition. A stopped or recreated UI can render the latest confirmation again, while a fresh launch must reconcile with the persisted note data.",
      useCase: "Handle a save that completes while its screen is stopped, then show a recoverable confirmation when the user returns. Persist the note first, expose the saved record ID as UI state, and let the UI decide when to navigate.",
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
      pitfall: "SavedStateHandle is saved UI state, not a durable transaction log or a guarantee after force-stop or fresh launch. Navigation and clearing outcome state are separate actions; failure between them can lose or repeat a transition. Define restoration, acknowledgement, and repeat-navigation behavior explicitly.",
      question: 'Does StateFlow guarantee every intermediate outcome is observed?',
      answer: "No. StateFlow keeps the latest state and conflates rapid updates, so a slow collector can miss intermediate values; equal values are also suppressed. That suits the current saved note ID, but it is not a log of every completed save. If every operation must be processed, persist records or a pending-operation queue and track acknowledgements with stable IDs. A Channel or replaying stream alone does not make navigation durably exactly once. Restore critical truth from the repository and define whether repeated navigation is acceptable or must be prevented.",
      quiz: {question: 'A save completes while the UI is stopped. What preserves the outcome?', options: ['Only emit into SharedFlow with replay 0', 'Persist the note and expose recoverable result state', 'Assume the UI callback always runs'], correct: 1, explanation: 'Durable data survives process loss, while result state gives a returning UI something explicit to render.'}
    }
  );
})();
