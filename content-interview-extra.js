/* Applied drills and remaining foundations; original IDs stay stable. */
(() => {
const additions = {
  "kotlin": [
    {
      "id": "properties-initialization",
      "title": "Properties: lazy & lateinit",
      "summary": "Property syntax can represent computation as well as stored state. Report.count invokes its custom getter on every read, while total uses a lazy delegate that computes the Long sum on first access and caches it. ScreenDependencies instead declares a non-null mutable property whose initialization happens later; isReady checks its initialization state. These mechanisms answer different ownership questions: recompute a derived value, defer a calculation, or support externally supplied setup.",
      "useCase": "Use a getter for cheap derived data that should reflect current inputs, and lazy for a deferred value whose cached lifetime is intentional. Prefer constructor injection for required dependencies when possible; lateinit is useful when a framework or test lifecycle must assign them later.",
      "code": "class Report(private val numbers: List<Int>) {\n    val count: Int get() = numbers.size\n    val total: Long by lazy { numbers.sumOf { it.toLong() } }\n}\nclass ScreenDependencies {\n    lateinit var repository: Repository\n    fun isReady() = this::repository.isInitialized\n}\n// Repository is an app-defined type.\n// lazy caches its result; use immutable input if freshness matters.",
      "language": "kotlin",
      "pitfall": "Reading lateinit before initialization throws, and it cannot represent a nullable or primitive property. Its readiness check is not a synchronization protocol. Default JVM lazy coordinates initialization, but does not make a mutable returned object safe for concurrent access or make a cached total refresh after list mutation.",
      "question": "Which value is recomputed on every access?",
      "answer": "count runs its getter on every access, so it reads the current numbers.size. total computes only on its first successful lazy initialization and returns that cached sum afterward. The constructor accepts a List reference, which does not guarantee that another owner cannot mutate the underlying list. If it changes, count can reflect the new size while total remains an earlier sum. Choose a defensive input snapshot, a recalculating getter, or explicit cache invalidation according to the required freshness contract; lazy alone does not keep derived state synchronized with changing inputs.",
      "quiz": {
        "question": "Which value is recomputed on every access?",
        "options": [
          "count",
          "total",
          "Both are always cached"
        ],
        "correct": 0,
        "explanation": "A getter computes on access; lazy retains the first initialized value."
      }
    },
    {
      "id": "coding-drill",
      "title": "Practice: group and rank records",
      "summary": "A coding drill should begin by identifying required behavior before choosing concise collection operations. directory groups every Employee by department, maps each group to names, and sorts those names while preserving duplicates. Empty input produces an empty map. For group sizes k, the sorting work sums across groups, with O(n log n) as an upper bound under the usual unit-cost comparison model and O(n) stored references across results and intermediates.",
      "useCase": "Practice explaining this transformation aloud with empty input, multiple departments, repeated names, and already sorted groups. State whether departments need alphabetical order and whether string ordering should be natural or locale-aware before choosing a map type and comparator.",
      "code": "data class Employee(val department: String, val name: String)\nfun directory(people: List<Employee>): Map<String, List<String>> =\n    people.groupBy { it.department }\n        .mapValues { (_, group) -> group.map { it.name }.sorted() }\n\n\nfun main() {\n    check(directory(emptyList()).isEmpty())\n    check(directory(listOf(Employee(\"A\", \"Z\"), Employee(\"A\", \"B\")))\n        == mapOf(\"A\" to listOf(\"B\", \"Z\")))\n    // O(n log n) upper-bound time; O(n) result/intermediate storage.\n}",
      "language": "kotlin",
      "pitfall": "groupBy preserves duplicate records and does not alphabetize department keys. Sorting names also does not resolve duplicate employee identity. Complexity estimates treating comparisons as constant should be qualified for long strings, whose comparisons can examine multiple characters. An allocation-saving rewrite should preserve the same observable ordering and duplicate policy.",
      "question": "What should you clarify before changing this to a set?",
      "answer": "Clarify whether repeated names represent distinct employees or duplicate records, and identify the actual deduplication key. Two employees can share a name, while one employee might appear with different display names. Converting each group to a set would silently discard repeated names and change the required output. If deduplication is requested, decide whether it applies before grouping, within departments, or globally, and define which record wins. Then choose the data structure and explain its equality, ordering, time, and storage behavior against that explicit contract.",
      "quiz": {
        "question": "What should you clarify before changing this to a set?",
        "options": [
          "Whether duplicate names must be preserved",
          "The editor color scheme",
          "Nothing; sets are always faster"
        ],
        "correct": 0,
        "explanation": "Choose the data model from the required behavior, then discuss time and space."
      }
    }
  ],
  "structures": [
    {
      "id": "structure-selection-drill",
      "title": "Practice: choose the data structure",
      "summary": "Map each required operation to a structure before coding. Include lookup, order, mutation frequency and memory overhead; naming a collection is not enough.",
      "useCase": "15-minute drill: design a recent-search list with uniqueness, most-recent-first order and bounded capacity.",
      "code": "fun rememberSearch(history: List<String>, term: String, limit: Int): List<String> {\n    require(limit >= 0)\n    if (limit == 0) return emptyList()\n    return (listOf(term) + history).distinct().take(limit)\n}\n\nfun main() {\n    check(rememberSearch(listOf(\"a\", \"b\"), \"b\", 2) == listOf(\"b\", \"a\"))\n    // O(n) time and O(n) temporary space: fine for a small history.\n    // At large scale, use a map plus a doubly linked list for O(1) updates.\n}",
      "language": "kotlin",
      "pitfall": "Big-O alone does not justify a custom linked structure for ten items. Clarify case folding and whether reading a search should affect recency.",
      "question": "Why might this O(n) implementation be a good choice?",
      "answer": "For a small bounded history it is readable and easy to verify. A more complex O(1) structure is appropriate only if operation volume and size justify it.",
      "quiz": {
        "question": "Why might this O(n) implementation be a good choice?",
        "options": [
          "Because n never matters",
          "Because a small fixed limit can favor simplicity",
          "Because filterNot is O(1)"
        ],
        "correct": 1,
        "explanation": "Use constraints to weigh complexity, constant factors and maintainability."
      }
    }
  ],
  "algorithms": [
    {
      "id": "tree-recursion",
      "title": "Tree recursion & postorder",
      "summary": "For a recursive tree problem, define what each call returns. Combine children at the parent and account for O(h) call-stack space.",
      "useCase": "Find a binary tree’s height; extend the same postorder pattern to balance checking or subtree aggregates.",
      "code": "class BinaryNode(val value: Int,\n    val left: BinaryNode? = null, val right: BinaryNode? = null)\nfun height(node: BinaryNode?): Int {\n    if (node == null) return 0\n    return 1 + maxOf(height(node.left), height(node.right))\n}\n// O(n) time, O(h) stack. Empty tree: 0; leaf: 1.\n// Assumes an acyclic tree with no shared child nodes.",
      "language": "kotlin",
      "pitfall": "A skewed tree has O(n) height and can overflow the call stack. Recomputing subtree height at every node makes a naive balance check O(n²).",
      "question": "How do you check balance in one traversal?",
      "answer": "Return height for a balanced subtree and a failure sentinel for an unbalanced one. Propagate failure immediately and compare child heights at each node, visiting every node once.",
      "quiz": {
        "question": "How do you check balance in one traversal?",
        "options": [
          "Sort the node values",
          "Return both balance information and height",
          "Run height again for every ancestor"
        ],
        "correct": 1,
        "explanation": "A richer recursive return value avoids repeating work."
      }
    },
    {
      "id": "monotonic-stack",
      "title": "Monotonic stack",
      "summary": "Keep a stack whose values follow an order. A new value resolves pending smaller or larger values; each index is pushed and popped at most once.",
      "useCase": "For each temperature, find the wait until a strictly warmer day.",
      "code": "fun warmerDays(t: IntArray): IntArray {\n    val answer = IntArray(t.size)\n    val stack = ArrayDeque<Int>()\n    for (i in t.indices) {\n        while (stack.isNotEmpty() && t[i] > t[stack.last()]) {\n            val previous = stack.removeLast()\n            answer[previous] = i - previous\n        }\n        stack.addLast(i)\n    }\n    return answer\n}\n// O(n) time, O(n) extra space. No warmer day => 0.",
      "language": "kotlin",
      "pitfall": "The nested while does not make this O(n²): each index is removed only once. Use > rather than >= for strictly warmer.",
      "question": "Why store indices rather than only temperatures?",
      "answer": "Indices let us compute the distance and write each answer at its original position. Values alone lose that information.",
      "quiz": {
        "question": "Why store indices rather than only temperatures?",
        "options": [
          "To retain positions and calculate distances",
          "To make sorting stable",
          "To skip equal temperatures without checking"
        ],
        "correct": 0,
        "explanation": "The stack tracks unresolved positions, while the input array provides their values."
      }
    },
    {
      "id": "coding-interview-drill",
      "title": "Practice: explain, implement, test",
      "summary": "A coding interview evaluates reasoning as well as a final function. Clarify constraints, state a brute-force baseline, choose an invariant, code, then test edge cases aloud.",
      "useCase": "30-minute drill: find indices of two distinct elements whose sum equals a target. Explain why duplicates work.",
      "code": "fun twoSum(a: IntArray, target: Long): Pair<Int, Int>? {\n    val seen = HashMap<Long, Int>()\n    for (i in a.indices) {\n        val value = a[i].toLong()\n        // Only an Int + Int sum is possible; reject other targets first.\n        if (target < 2L * Int.MIN_VALUE || target > 2L * Int.MAX_VALUE) return null\n        val previous = seen[target - value]\n        if (previous != null) return previous to i\n        seen[value] = i\n    }\n    return null\n}\n// Expected O(n) time, O(n) space. Lookup before insertion.\n\nfun main() {\n    check(twoSum(intArrayOf(3, 3), 6) == (0 to 1))\n}",
      "language": "kotlin",
      "pitfall": "An answer that passes one happy-path example is not enough. Cover empty/singleton input, no match, duplicates, negative values and numeric bounds.",
      "question": "Why look up the complement before inserting the current element?",
      "answer": "To avoid using the same element twice. The map contains only earlier indices, so any found pair has distinct positions.",
      "quiz": {
        "question": "Why look up the complement before inserting the current element?",
        "options": [
          "To prevent reusing the current index",
          "To guarantee a sorted result",
          "To remove duplicate values from the input"
        ],
        "correct": 0,
        "explanation": "The loop invariant is that seen contains previously visited positions only."
      }
    }
  ],
  "android": [
    {
      "id": "implementation-drill",
      "title": "Practice: build a resilient screen",
      "summary": "A resilient screen combines explicit UI state with repository behavior, persistence, cancellation, and lifecycle ownership. The example models loading, content with a stale flag, and failure as a sealed interface; its exhaustive summary function handles each alternative. The exercise then asks you to bind that state, preserve the search query, retry failures, and keep cached content visible during refresh problems. Rendering these states is only the beginning of the implementation.",
      "useCase": "Use a 45-minute interview exercise to build a searchable feed with a fake repository. Start with observable loading and content, introduce a failed refresh and retry, then demonstrate how the same state contract supports either Compose or a Fragment view.",
      "code": "sealed interface FeedUi {\n    data object Loading : FeedUi\n    data class Content(val titles: List<String>, val stale: Boolean) : FeedUi\n    data class Failed(val message: String) : FeedUi\n}\nfun summary(state: FeedUi): String = when (state) {\n    FeedUi.Loading -> \"Loading\"\n    is FeedUi.Content -> \"Items: \" + state.titles.size\n    is FeedUi.Failed -> state.message\n}\n// Exercise: bind state, emit retry actions, preserve the query,\n// and keep cached content visible if refresh fails.",
      "language": "kotlin",
      "pitfall": "Replacing usable content with a full-screen failure discards offline value. The shown state is a starting point: its stale flag does not separately describe an active refresh or explain a refresh error. Define those behaviors deliberately, and ensure obsolete searches cannot overwrite newer results.",
      "question": "What evidence would show this slice is resilient?",
      "answer": "Demonstrate initial loading, successful content, an empty result, failure without cache, and a failed refresh that leaves cached content usable. Show retry recovering and cancellation preventing an older search from replacing a newer one. Use a fake repository for deterministic state tests and UI assertions for visible controls and messages. Recreate the screen to verify query restoration, and explain how durable records reload after process loss. Include accessibility and offline behavior. Each claim should correspond to an observed behavior or test, not simply an architecture diagram.",
      "quiz": {
        "question": "What evidence would show this slice is resilient?",
        "options": [
          "A screenshot of the happy path",
          "Tests and explanations covering failure and lifecycle changes",
          "A large number of architecture layers"
        ],
        "correct": 1,
        "explanation": "Resilience is observable behavior under failure and lifecycle change."
      }
    }
  ],
  "design": [
    {
      "id": "experience-stories",
      "title": "Practice: technical experience & tradeoffs",
      "summary": "Prepare real project stories about a difficult bug, a design decision, collaboration and a failure. State your role, constraints, options, action and measured result. Be precise about what you did personally.",
      "useCase": "Answer “Tell me about a performance improvement” with evidence, then defend the rejected alternatives.",
      "code": "data class Measurement(val beforeMs: Long, val afterMs: Long)\nfun improvementPercent(m: Measurement): Double {\n    require(m.beforeMs > 0 && m.afterMs >= 0)\n    return 100.0 * (m.beforeMs.toDouble() - m.afterMs.toDouble()) / m.beforeMs\n}\n// Pair any percentage with workload, device, build type,\n// sample count and metric (median/p95), not only a single run.",
      "language": "kotlin",
      "pitfall": "Never invent impact numbers. A negative result can still be a good story if you explain the evidence, correction and lesson.",
      "question": "What makes a performance claim credible?",
      "answer": "A reproducible baseline, comparable measurements on representative devices, a clearly named metric, and a tradeoff discussion. Distinguish observed correlation from demonstrated cause.",
      "quiz": {
        "question": "What makes a performance claim credible?",
        "options": [
          "A percentage without context",
          "A controlled comparison and clearly defined metric",
          "The most complex implementation"
        ],
        "correct": 1,
        "explanation": "Measurement context makes the result interpretable and the engineering decision defensible."
      }
    }
  ]
};
for (const [id, lessons] of Object.entries(additions)) window.PRIMERS.find(s => s.id === id).lessons.push(...lessons);
})();
window.PRIMERS.find(s => s.id === 'kotlin').sources.push(
  {title:'Kotlin properties',url:'https://kotlinlang.org/docs/properties.html'},
  {title:'Kotlin delegated properties',url:'https://kotlinlang.org/docs/delegated-properties.html'}
);
window.PRIMERS.find(s => s.id === 'android').sources.push(
  {title:'Testing fundamentals',url:'https://developer.android.com/training/testing/fundamentals'}
);
