/* Independent, browser-readable lessons. No runtime dependencies. */
window.PRIMERS = [...(window.PRIMERS || []),
  {
    id: 'kotlin', title: 'Kotlin Primer', subtitle: 'Write clear Kotlin under interview pressure.', icon: 'K',
    sources: [
      { title: 'Kotlin: null safety', url: 'https://kotlinlang.org/docs/null-safety.html' },
      { title: 'Kotlin: collections', url: 'https://kotlinlang.org/docs/collections-overview.html' },
      { title: 'Kotlin: data classes', url: 'https://kotlinlang.org/docs/data-classes.html' },
      { title: 'Kotlin: sealed types', url: 'https://kotlinlang.org/docs/sealed-classes.html' },
      { title: 'Kotlin: sequences', url: 'https://kotlinlang.org/docs/sequences.html' },
      { title: 'Kotlin: coroutines', url: 'https://kotlinlang.org/docs/coroutines-basics.html' }
    ],
    lessons: [
      {
        id: 'kotlin-null', title: 'Null safety & early returns',
        summary: 'Use nullable types to make absence explicit. A safe call returns null; Elvis supplies a default or exits.',
        useCase: 'Parse optional input without exceptions or deeply nested conditions.', language: 'kotlin',
        code: `fun positiveCount(raw: String?): Int {
    val count = raw?.trim()?.toIntOrNull() ?: return 0
    return count.coerceAtLeast(0)
}
// positiveCount(" 12 ") == 12
// positiveCount("oops") == 0`,
        pitfall: '!! asserts a value is present and can throw. Java platform types still need careful boundary validation.',
        question: 'Why use toIntOrNull() instead of toInt() for untrusted input?',
        answer: 'It models invalid input as null, so the fallback is explicit rather than exception-driven.',
        quiz: { question: 'What does positiveCount(null) return?', options: ['null', '0', 'It throws'], correct: 1, explanation: 'The safe-call chain returns null; Elvis immediately returns 0.' }
      },
      {
        id: 'kotlin-collections', title: 'Collections & mutability',
        summary: 'List is a read-only interface, not a promise of deep immutability. val prevents reassignment, not mutation.',
        useCase: 'Build results with local mutation, then expose a read-only collection.', language: 'kotlin',
        code: `fun uniqueSorted(values: List<Int>): List<Int> {
    val seen = mutableSetOf<Int>()
    for (value in values) seen.add(value)
    return seen.sorted()
}
// uniqueSorted(listOf(3, 1, 3)) == listOf(1, 3)
// O(n + k log k) expected time; O(k) space`,
        pitfall: 'toList() copies the container, but its mutable elements remain shared. IntArray avoids boxed Int elements on the JVM.',
        question: 'Can a val holding a MutableList change?',
        answer: 'Yes. Its reference cannot be reassigned, but add(), remove(), and element replacement can mutate that list.',
        quiz: { question: 'Which guarantees deep immutability?', options: ['val', 'List<T>', 'Neither by itself'], correct: 2, explanation: 'Both constrain access or reassignment; neither freezes the entire object graph.' }
      },
      {
        id: 'kotlin-models', title: 'Data classes & sealed states',
        summary: 'Data classes supply value-oriented helpers. Sealed types describe a closed set of states for exhaustive when expressions.',
        useCase: 'Represent loading, success, and failure without incompatible boolean flags.', language: 'kotlin',
        code: `data class Person(val id: Long, val name: String)
sealed interface LoadState {
    data object Loading : LoadState
    data class Ready(val people: List<Person>) : LoadState
    data class Failed(val message: String) : LoadState
}
fun label(state: LoadState): String = when (state) {
    LoadState.Loading -> "Loading"
    is LoadState.Ready -> "People: " + state.people.size
    is LoadState.Failed -> state.message
}`,
        pitfall: 'copy() is shallow. Generated equals/hashCode use primary-constructor properties; do not mutate a hash key after inserting it.',
        question: 'Why omit else in this when expression?',
        answer: 'The compiler can flag missing states when a new sealed subtype is added.',
        quiz: { question: 'Data class copy() performs which operation?', options: ['Deep copy', 'Shallow copy', 'Serialization'], correct: 1, explanation: 'Referenced nested objects are shared unless explicitly copied.' }
      },
      {
        id: 'kotlin-functions', title: 'Functions, lambdas & scope',
        summary: 'Higher-order functions accept behavior. Extensions add readable syntax without changing a class or using virtual dispatch.',
        useCase: 'Express a small reusable transformation while keeping control flow easy to explain.', language: 'kotlin',
        code: `fun String.normalized(): String = trim().lowercase()
fun transformNames(
    names: List<String>,
    transform: (String) -> String = { it.normalized() }
): List<String> = names.map(transform)

// transformNames(listOf(" ADA ")) == listOf("ada")
// let returns its lambda result; apply returns its receiver.`,
        pitfall: 'Avoid nested scope functions with ambiguous it/this. Extension resolution depends on the declared receiver type.',
        question: 'When is an ordinary loop clearer than chained lambdas?',
        answer: 'When the task needs several evolving variables, early exits, or complex branching.',
        quiz: { question: 'What does apply return?', options: ['Its receiver', 'The final lambda expression', 'Always Unit'], correct: 0, explanation: 'apply configures a receiver and returns that same receiver.' }
      },
      {
        id: 'kotlin-sequences', title: 'Sequences & practical complexity',
        summary: 'Collection transformations are eager; sequences defer work until a terminal operation and can avoid intermediate lists.',
        useCase: 'Filter a large input and stop after finding a small number of matches.', language: 'kotlin',
        code: `fun firstPositiveSquares(values: List<Int>): List<Long> =
    values.asSequence()
        .filter { it > 0 }
        .map { it.toLong() * it }
        .take(3)
        .toList()
// Stops after 3 matches; worst-case O(n) time.
// Long multiplication prevents Int square overflow.`,
        pitfall: 'Laziness has overhead and is not always faster. Sorting still needs the input; benchmark real workloads.',
        question: 'Why convert to Long before multiplying?',
        answer: 'Converting an already-overflowed Int product to Long cannot recover the correct value.',
        quiz: { question: 'Which operation triggers this sequence?', options: ['filter', 'map', 'toList'], correct: 2, explanation: 'toList is terminal and requests the elements.' }
      },
      {
        id: 'kotlin-coroutines', title: 'Structured concurrency',
        summary: 'Suspending functions may pause without blocking a thread. A coroutine scope owns child work and waits for its completion.',
        useCase: 'Run two independent suspending requests concurrently, returning only when both finish.', language: 'kotlin',
        code: `// Requires kotlinx-coroutines-core.
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope

suspend fun <A, B> loadTogether(
    first: suspend () -> A,
    second: suspend () -> B
): Pair<A, B> = coroutineScope {
    val a = async { first() }
    val b = async { second() }
    a.await() to b.await()
}`,
        pitfall: 'suspend does not move work off the main thread. Use an appropriate dispatcher for blocking/CPU work; preserve cancellation.',
        question: 'What happens if one child fails in this coroutineScope?',
        answer: 'Failure cancels the sibling and propagates from the scope. Use supervision when independent failures are part of the design.',
        quiz: { question: 'Does suspend automatically run a function on a background thread?', options: ['Yes', 'No', 'Only on Android'], correct: 1, explanation: 'Execution uses the coroutine context; suspension and thread selection are separate concerns.' }
      }
    ]
  },
  {
    id: 'structures', title: 'Data Structures Primer', subtitle: 'Choose the right shape for your data.', icon: '▦',
    sources: [
      { title: 'Kotlin: collection types', url: 'https://kotlinlang.org/docs/collections-overview.html' },
      { title: 'Princeton: data structure costs', url: 'https://algs4.cs.princeton.edu/cheatsheet/' }
    ],
    lessons: [
      {
        id: 'structures-arrays', title: 'Arrays & prefix sums',
        summary: 'Arrays offer O(1) indexed access and fixed size. Prefix sums trade O(n) preprocessing and space for O(1) range sums.',
        useCase: 'Answer many sum queries over an unchanged sequence.', language: 'kotlin',
        code: `fun prefixSums(values: IntArray): LongArray {
    val prefix = LongArray(values.size + 1)
    for (i in values.indices) {
        prefix[i + 1] = prefix[i] + values[i]
    }
    return prefix
}
// Sum of [left, right): prefix[right] - prefix[left]
// Bounds: 0 <= left <= right <= values.size`,
        pitfall: 'Define inclusive/exclusive bounds first. Updating one value invalidates later prefix sums; use a Fenwick tree for frequent updates.',
        question: 'Why allocate one extra prefix element?',
        answer: 'The initial zero makes ranges beginning at index zero work with the same subtraction formula.',
        quiz: { question: 'After preprocessing, what is a range-sum query cost?', options: ['O(n)', 'O(log n)', 'O(1)'], correct: 2, explanation: 'A query reads two stored sums and subtracts them.' }
      },
      {
        id: 'structures-hashing', title: 'Hash maps & sets',
        summary: 'A map associates keys with values; a set keeps unique values. Hash-based lookup and insertion are O(1) expected, not guaranteed.',
        useCase: 'Count frequencies, detect duplicates, or replace a repeated linear search.', language: 'kotlin',
        code: `fun frequencies(values: IntArray): Map<Int, Int> {
    val counts = HashMap<Int, Int>()
    for (value in values) {
        counts[value] = (counts[value] ?: 0) + 1
    }
    return counts
}
// O(n) expected time, O(k) space for k distinct values.`,
        pitfall: 'HashMap iteration order is unspecified. Equal keys must have equal hash codes; avoid mutable key properties.',
        question: 'When would a tree map be preferable?',
        answer: 'When ordered traversal or range queries matter enough to accept O(log n) operations.',
        quiz: { question: 'Which collection directly answers “have I seen this key?”', options: ['HashSet', 'Queue', 'Array alone'], correct: 0, explanation: 'A set represents membership without an unnecessary value.' }
      },
      {
        id: 'structures-deque', title: 'Stacks & queues',
        summary: 'Stacks are last-in, first-out; queues are first-in, first-out. ArrayDeque supports efficient operations at both ends.',
        useCase: 'Use a stack for matching delimiters and a queue for breadth-first traversal.', language: 'kotlin',
        code: `fun balancedParentheses(text: String): Boolean {
    val stack = ArrayDeque<Char>()
    for (c in text) when (c) {
        '(' -> stack.addLast(c)
        ')' -> {
            if (stack.isEmpty()) return false
            stack.removeLast()
        }
    }
    return stack.isEmpty()
}
// O(n) time, O(n) worst-case space; ignores other chars.
// Queue: addLast(value), then removeFirst().`,
        pitfall: 'Removing index 0 from an ArrayList shifts elements. Check emptiness before removing from a deque.',
        question: 'Can this parentheses-only checker use constant extra space?',
        answer: 'Yes, count unmatched opens. A stack becomes useful when matching multiple delimiter types.',
        quiz: { question: 'Which removal makes a deque behave as a queue after addLast?', options: ['removeLast', 'removeFirst', 'Either'], correct: 1, explanation: 'The oldest inserted element is at the front.' }
      },
      {
        id: 'structures-linked', title: 'Linked lists & pointer rewiring',
        summary: 'Nodes hold values and links. Indexed lookup is O(n); insertion after a known node is O(1).',
        useCase: 'Practice pointer invariants and in-place reversal; prefer arrays for ordinary indexed workloads.', language: 'kotlin',
        code: `class Node(val value: Int, var next: Node? = null)
fun reverse(head: Node?): Node? {
    var previous: Node? = null
    var current = head
    while (current != null) {
        val next = current.next
        current.next = previous
        previous = current
        current = next
    }
    return previous
}
// O(n) time, O(1) extra space; assumes no cycle.`,
        pitfall: 'Save the next node before overwriting the link. Reversal mutates the original list.',
        question: 'How would you detect a cycle with O(1) space?',
        answer: 'Use slow and fast pointers. Advance them one and two links; identity equality indicates a cycle.',
        quiz: { question: 'Why store next before assigning current.next?', options: ['To sort nodes', 'To retain the unreversed tail', 'To copy the list'], correct: 1, explanation: 'Overwriting the link otherwise loses the route to remaining nodes.' }
      },
      {
        id: 'structures-tree', title: 'Binary search trees',
        summary: 'A BST puts smaller keys on the left and larger keys on the right. Search is O(h), where h is tree height.',
        useCase: 'Maintain ordered keys and reason about range queries or in-order traversal.', language: 'kotlin',
        code: `class TreeNode(
    val key: Int,
    var left: TreeNode? = null,
    var right: TreeNode? = null
)
fun contains(root: TreeNode?, target: Int): Boolean {
    var node = root
    while (node != null) {
        node = when {
            target < node.key -> node.left
            target > node.key -> node.right
            else -> return true
        }
    }
    return false
}`,
        pitfall: 'An ordinary BST can become a chain: O(n) search. Balanced trees keep O(log n) height; define a duplicate-key policy.',
        question: 'What order does an in-order BST traversal produce?',
        answer: 'Sorted order: visit left subtree, current key, then right subtree.',
        quiz: { question: 'What is the worst-case height of an unbalanced n-node BST?', options: ['O(1)', 'O(log n)', 'O(n)'], correct: 2, explanation: 'Sorted insertions can create a single chain.' }
      },
      {
        id: 'structures-heap', title: 'Heaps & top-k',
        summary: 'A min-heap exposes its smallest value in O(1), with O(log n) insert/remove. It does not keep every element sorted.',
        useCase: 'Keep only the k largest values in a stream using a heap of size k.', language: 'kotlin',
        code: `// Kotlin/JVM (also available on Android).
import java.util.PriorityQueue

fun topK(values: IntArray, k: Int): List<Int> {
    require(k >= 0)
    if (k == 0) return emptyList()
    val heap = PriorityQueue<Int>()
    for (value in values) {
        heap.add(value)
        if (heap.size > k) heap.poll()
    }
    return heap.toList().sortedDescending()
}
// O(n log(k + 1) + k log k) time, O(k) space.`,
        pitfall: 'PriorityQueue iteration is not sorted. To build comparators, prefer compareTo/compareBy over overflow-prone subtraction.',
        question: 'Why a min-heap when finding the largest values?',
        answer: 'Its root is the smallest retained candidate, so it is the first value to discard when capacity is exceeded.',
        quiz: { question: 'What does a min-heap guarantee?', options: ['All elements are sorted', 'The root is minimal', 'Constant-time arbitrary search'], correct: 1, explanation: 'Heap order constrains parents and children, not the entire iteration order.' }
      }
    ]
  },
  {
    id: 'algorithms', title: 'Algorithms Primer', subtitle: 'Recognize the pattern. Explain the tradeoff.', icon: '⌘',
    sources: [
      { title: 'Princeton: algorithm costs', url: 'https://algs4.cs.princeton.edu/cheatsheet/' },
      { title: 'Kotlin: ordering', url: 'https://kotlinlang.org/docs/collection-ordering.html' }
    ],
    lessons: [
      {
        id: 'algorithms-binary', title: 'Binary search',
        summary: 'Halve a sorted search space using a monotonic decision. O(log n) time and O(1) space.',
        useCase: 'Find an insertion position, a value, or the first feasible answer.', language: 'kotlin',
        code: `fun lowerBound(a: IntArray, target: Int): Int {
    var left = 0
    var right = a.size // exclusive
    while (left < right) {
        val mid = left + (right - left) / 2
        if (a[mid] < target) left = mid + 1
        else right = mid
    }
    return left // first index with value >= target, or size
}
// lowerBound(intArrayOf(1, 3, 3, 8), 3) == 1`,
        pitfall: 'Input must be sorted. Keep one boundary convention throughout; insertion position can equal array size.',
        question: 'How do you verify that the target actually exists?',
        answer: 'Check that the returned index is below size and that a[index] equals target.',
        quiz: { question: 'For [1, 3, 3, 8], lowerBound(4) returns?', options: ['2', '3', '4'], correct: 1, explanation: 'Index 3 holds 8, the first value greater than or equal to 4.' }
      },
      {
        id: 'algorithms-sort', title: 'Merge sort & ordering',
        summary: 'Split, sort each half, then merge. Merge sort takes O(n log n) time and O(n) peak auxiliary space.',
        useCase: 'Explain stable sorting, or sort before applying two pointers or interval merging.', language: 'kotlin',
        code: `fun mergeSort(a: IntArray): IntArray {
    if (a.size <= 1) return a.copyOf()
    val mid = a.size / 2
    val left = mergeSort(a.copyOfRange(0, mid))
    val right = mergeSort(a.copyOfRange(mid, a.size))
    val result = IntArray(a.size)
    var i = 0
    var j = 0
    for (k in result.indices) {
        result[k] = if (j == right.size ||
            (i < left.size && left[i] <= right[j])) {
            left[i++]
        } else right[j++]
    }
    return result
}`,
        pitfall: 'This teaching version allocates subarrays. In production use standard sorting; sorted() returns a copy and sort() mutates.',
        question: 'What makes this merge stable?',
        answer: 'On equal values it selects the left element first, preserving their original relative order.',
        quiz: { question: 'What does a stable sort preserve?', options: ['All original positions', 'Relative order of equal keys', 'Constant memory usage'], correct: 1, explanation: 'Items with equal sorting keys retain their relative ordering.' }
      },
      {
        id: 'algorithms-window', title: 'Sliding window',
        summary: 'Maintain a valid contiguous window while moving each boundary forward. Avoid rechecking every substring.',
        useCase: 'Find the longest substring without repeated characters.', language: 'kotlin',
        code: `fun longestUnique(text: String): Int {
    val last = HashMap<Char, Int>()
    var left = 0
    var best = 0
    for (right in text.indices) {
        val previous = last[text[right]]
        if (previous != null) left = maxOf(left, previous + 1)
        last[text[right]] = right
        best = maxOf(best, right - left + 1)
    }
    return best
}
// O(n) expected time; O(min(n, alphabet size)) space.
// Counts UTF-16 Char units, not user-perceived characters.`,
        pitfall: 'Never move left backward. For sum-based windows, negative values can break the monotonic condition.',
        question: 'Why use maxOf when updating left?',
        answer: 'The previous occurrence might already be outside the window; moving backward would reintroduce duplicates.',
        quiz: { question: 'What is longestUnique("abba")?', options: ['2', '3', '4'], correct: 0, explanation: 'The longest valid windows are “ab” and “ba”.' }
      },
      {
        id: 'algorithms-bfs', title: 'Breadth-first search',
        summary: 'A queue explores a graph in distance layers. BFS finds shortest path lengths when every edge has equal cost.',
        useCase: 'Find minimum hops in a graph or steps through an unweighted grid.', language: 'kotlin',
        code: `fun distances(graph: List<List<Int>>, start: Int): IntArray {
    require(start in graph.indices)
    val distance = IntArray(graph.size) { -1 }
    val queue = ArrayDeque<Int>()
    distance[start] = 0
    queue.addLast(start)
    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        for (next in graph[node]) {
            if (distance[next] != -1) continue
            distance[next] = distance[node] + 1
            queue.addLast(next)
        }
    }
    return distance
}
// Valid vertex IDs required. O(V + E) time, O(V) extra space.`,
        pitfall: 'Mark visited when enqueueing. For varying nonnegative edge weights use Dijkstra, not ordinary BFS.',
        question: 'How can BFS return the path rather than only its length?',
        answer: 'Store each newly discovered vertex’s parent, then backtrack from the target and reverse the result.',
        quiz: { question: 'Which graph supports shortest paths with ordinary BFS?', options: ['Any weighted graph', 'Equal-cost edges', 'Only trees'], correct: 1, explanation: 'Every layer then represents one equal-cost step.' }
      },
      {
        id: 'algorithms-dfs', title: 'Depth-first search',
        summary: 'Explore one branch before its siblings. DFS supports reachability, connected components, and traversal-based reasoning.',
        useCase: 'Count reachable vertices without risking the call stack on a deep graph.', language: 'kotlin',
        code: `fun reachable(graph: List<List<Int>>, start: Int): Int {
    require(start in graph.indices)
    val seen = BooleanArray(graph.size)
    val stack = ArrayDeque<Int>()
    seen[start] = true
    stack.addLast(start)
    var count = 0
    while (stack.isNotEmpty()) {
        val node = stack.removeLast()
        count++
        for (next in graph[node]) if (!seen[next]) {
            seen[next] = true
            stack.addLast(next)
        }
    }
    return count
}
// Valid vertex IDs required. O(V + E) time, O(V) extra space.`,
        pitfall: 'Reachability needs visited state on cyclic graphs. Directed cycle detection additionally needs active-path state, not just seen.',
        question: 'Why choose an explicit stack over recursive DFS?',
        answer: 'An explicit stack avoids call-stack overflow and makes memory use easier to control on large inputs.',
        quiz: { question: 'What makes this traversal depth-first rather than breadth-first?', options: ['BooleanArray', 'removeLast()', 'The adjacency list'], correct: 1, explanation: 'The stack processes the most recently added pending vertex first.' }
      },
      {
        id: 'algorithms-dp', title: 'Dynamic programming',
        summary: 'Define a state, recurrence, base case, and evaluation order. Reuse solutions to overlapping subproblems.',
        useCase: 'Find the fewest positive-denomination coins needed for an amount, with unlimited copies of each coin.', language: 'kotlin',
        code: `fun minCoins(coins: IntArray, amount: Int): Int {
    require(amount in 0..100_000 && coins.all { it > 0 })
    val unreachable = amount + 1
    val dp = IntArray(amount + 1) { unreachable }
    dp[0] = 0
    for (sum in 1..amount) {
        for (coin in coins) if (coin <= sum) {
            dp[sum] = minOf(dp[sum], dp[sum - coin] + 1)
        }
    }
    return if (dp[amount] == unreachable) -1 else dp[amount]
}
// O(amount * coin count) time, O(amount) space.
// Teaching limit bounds memory; minCoins([1, 3, 4], 6) = 2.`,
        pitfall: 'Greedy selection is not always optimal: for [1, 3, 4] and 6, taking 4 first uses 3 coins instead of 2.',
        question: 'What does dp[sum] represent?',
        answer: 'The minimum number of coins to make exactly sum, or a sentinel when that amount is unreachable.',
        quiz: { question: 'What is the required base case?', options: ['dp[0] = 0', 'dp[0] = 1', 'Every dp entry = 0'], correct: 0, explanation: 'Zero coins make amount zero and seed the recurrence.' }
      }
    ]
  }
];
