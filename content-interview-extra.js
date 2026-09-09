/* Applied drills and remaining foundations; original IDs stay stable. */
(() => {
const additions = {
  "kotlin": [
    {
      "id": "properties-initialization",
      "title": "Properties: lazy & lateinit",
      "summary": "A property can expose a custom getter. lazy computes a val on first access; lateinit delays initialization of a non-null var. Neither substitutes for a clear ownership model.",
      "useCase": "Explain initialization, backing fields and avoiding unnecessary derived state.",
      "code": "class Report(private val numbers: List<Int>) {\n    val count: Int get() = numbers.size\n    val total: Long by lazy { numbers.sumOf { it.toLong() } }\n}\nclass ScreenDependencies {\n    lateinit var repository: Repository\n    fun isReady() = this::repository.isInitialized\n}\n// Repository is an app-defined type.\n// lazy caches its result; use immutable input if freshness matters.",
      "language": "kotlin",
      "pitfall": "Reading an uninitialized lateinit throws. lateinit cannot be used with primitive types or nullable properties. Default JVM lazy synchronizes initialization, not all access to the object it returns.",
      "question": "Which value is recomputed on every access?",
      "answer": "count runs its getter on each read. total is initialized once on first read and then cached. If the input list can mutate, count and total can disagree.",
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
      "summary": "Before coding, clarify ordering, duplicate IDs, nulls and input size. Implement a small transformation and explain allocation and complexity without leaning on autocomplete.",
      "useCase": "20-minute drill: return names grouped by department, sorted within each group, keeping duplicates.",
      "code": "data class Employee(val department: String, val name: String)\nfun directory(people: List<Employee>): Map<String, List<String>> =\n    people.groupBy { it.department }\n        .mapValues { (_, group) -> group.map { it.name }.sorted() }\n\n\nfun main() {\n    check(directory(emptyList()).isEmpty())\n    check(directory(listOf(Employee(\"A\", \"Z\"), Employee(\"A\", \"B\")))\n        == mapOf(\"A\" to listOf(\"B\", \"Z\")))\n    // O(n log n) upper-bound time; O(n) result/intermediate storage.\n}",
      "language": "kotlin",
      "pitfall": "Do not claim groupBy removes duplicates or sorts map keys. If department order matters, explicitly choose a sorted map.",
      "question": "What should you clarify before changing this to a set?",
      "answer": "Whether repeated names represent distinct records. A set changes semantics and should follow an explicit deduplication requirement.",
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
      "summary": "Combine the primitives into a small vertical slice: UI state, repository, local data, network refresh and retry. Explain rotation, process recreation and what happens offline.",
      "useCase": "45-minute exercise: build or sketch a searchable list in either XML/Fragment or Compose, then explain the other UI approach.",
      "code": "sealed interface FeedUi {\n    data object Loading : FeedUi\n    data class Content(val titles: List<String>, val stale: Boolean) : FeedUi\n    data class Failed(val message: String) : FeedUi\n}\nfun summary(state: FeedUi): String = when (state) {\n    FeedUi.Loading -> \"Loading\"\n    is FeedUi.Content -> \"Items: \" + state.titles.size\n    is FeedUi.Failed -> state.message\n}\n// Exercise: bind state, emit retry actions, preserve the query,\n// and keep cached content visible if refresh fails.",
      "language": "kotlin",
      "pitfall": "Do not mark the exercise complete because a screen renders. Verify cancellation, empty/error states, accessibility, rotation and an injected fake repository.",
      "question": "What evidence would show this slice is resilient?",
      "answer": "Tests for loading/content/error and retry; a process-restoration plan; canceled obsolete searches; usable cached data offline; and UI assertions for both empty and failure behavior.",
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
