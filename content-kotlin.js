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

// Additional interview essentials; retain stable lesson IDs for saved progress.
(() => {
  const section = id => window.PRIMERS.find(primer => primer.id === id);
  const lesson = (id, title, summary, useCase, code, pitfall, question, answer, quizQuestion, options, correct, explanation) => ({
    id, title, summary, useCase, code, language: 'kotlin', pitfall, question, answer,
    quiz: { question: quizQuestion, options, correct, explanation }
  });
  section('kotlin').sources.push(
    { title: 'Kotlin: equality', url: 'https://kotlinlang.org/docs/equality.html' },
    { title: 'Kotlin: delegation', url: 'https://kotlinlang.org/docs/delegation.html' },
    { title: 'Kotlin: generics', url: 'https://kotlinlang.org/docs/generics.html' },
    { title: 'Kotlin: inline functions', url: 'https://kotlinlang.org/docs/inline-functions.html' },
    { title: 'Kotlin: Java interoperability', url: 'https://kotlinlang.org/docs/java-interop.html' },
    { title: 'Kotlin: coroutine exceptions', url: 'https://kotlinlang.org/docs/exception-handling.html' },
    { title: 'Kotlin: StateFlow', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/' },
    { title: 'Kotlin: SharedFlow', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/' },
    { title: 'Kotlin: shared mutable state', url: 'https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html' },
    { title: 'Kotlin: coroutine tests', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/' }
  );
  section('kotlin').lessons.push(
    lesson('kotlin-delegation', 'Interfaces, composition & delegation',
      'Interfaces define contracts; classes are final by default. Compose behavior with collaborators, and use by to forward an interface.',
      'Decorate a repository or logger without inheriting its implementation.',
      `interface Logger { fun log(message: String) }
class ConsoleLogger : Logger {
    override fun log(message: String) = println(message)
}
class TaggedLogger(private val delegate: Logger) : Logger by delegate {
    override fun log(message: String) {
        delegate.log("[interview] " + message)
    }
}
// TaggedLogger(ConsoleLogger()).log("Ready")`,
      'Calls made inside the delegate use its own implementations; overriding a wrapper method does not intercept those internal calls.',
      'When is an abstract class useful?',
      'When related implementations share state or protected behavior; prefer an interface when only a contract is needed.',
      'What does Logger by delegate generate?', ['Forwarding implementations', 'A subclass of delegate', 'A deep copy'], 0,
      'Delegation forwards interface members to the supplied object, unless explicitly overridden.'),
    lesson('kotlin-variance', 'Generics & variance',
      'Use out for producers and in for consumers. A mutable container is usually invariant because it both reads and writes T.',
      'Design reusable APIs that accept safely related types without unchecked casts.',
      `interface Source<out T> { fun read(): T }
interface Sink<in T> { fun write(value: T) }
fun copyOne(source: Source<String>, sink: Sink<String>) {
    sink.write(source.read())
}
fun widen(source: Source<String>): Source<Any> = source
// Sink<Any> can be passed where Sink<String> is required.
// List<*> can be read as Any?; its element type is unknown.`,
      'MutableList<String> cannot be a MutableList<Any>: that would permit inserting a number into a string list.',
      'Why is Source<String> usable as Source<Any>?',
      'Every value it produces is a String, which is also an Any. It cannot consume an incompatible Any.',
      'Which modifier fits a type that only consumes T?', ['out', 'in', 'reified'], 1,
      'Contravariance uses in to allow a consumer of a broader type to satisfy a narrower consumer contract.'),
    lesson('kotlin-inline', 'Inline, reified & lambda returns',
      'Inlining can remove lambda overhead and enables reified type checks. noinline retains a lambda value; crossinline forbids non-local returns.',
      'Filter mixed values by a type known at the call site.',
      `inline fun <reified T> Iterable<*>.instances(): List<T> {
    val result = mutableListOf<T>()
    for (item in this) if (item is T) result.add(item)
    return result
}
// listOf(1, "two", 3).instances<Int>() == listOf(1, 3)
// O(n) time, O(k) result space.`,
      'Reification does not recover erased nested arguments: checking List<String> cannot validate every element as String.',
      'Why not inline every large function?',
      'Inlining can increase generated code size. Use it for a reason such as a small higher-order function or reified type parameter.',
      'Where can a reified type parameter be declared?', ['Any class', 'An inline function', 'Any interface'], 1,
      'The compiler substitutes the concrete type at inline call sites.'),
    lesson('kotlin-equality', 'Equality & Java boundaries',
      '== uses null-safe equals; === checks reference identity. Arrays need contentEquals for element comparison.',
      'Avoid surprising comparisons and normalize Java platform types at the boundary.',
      `fun sameValues(a: IntArray, b: IntArray): Boolean =
    a.contentEquals(b)

// Kotlin/JVM: Java Properties.getProperty may return null.
fun title(properties: java.util.Properties): String {
    val raw: String? = properties.getProperty("title")
    return raw?.trim()?.takeIf { it.isNotEmpty() } ?: "Untitled"
}
// intArrayOf(1) == intArrayOf(1) is false.`,
      'Do not use identity equality for boxed numbers or strings. Java nullability annotations improve safety but do not replace input validation.',
      'Why explicitly assign a Java platform value to nullable String?',
      'It establishes a nullable Kotlin contract so subsequent accesses require safe handling.',
      'Which compares two IntArray values element by element?', ['===', '==', 'contentEquals'], 2,
      'Array equality otherwise compares array objects, not their contained values.'),
    lesson('kotlin-supervision', 'Failures, cancellation & supervision',
      'Normal child failure cancels its scope. Supervision lets independent children fail separately; cancellation still propagates from the parent.',
      'Keep optional work independent while surfacing each child failure explicitly.',
      `// Requires kotlinx-coroutines-core.
import kotlinx.coroutines.*

suspend fun optionalPair(
    first: suspend () -> String,
    second: suspend () -> String
): Pair<String?, String?> = supervisorScope {
    suspend fun attempt(block: suspend () -> String): String? =
        try { block() }
        catch (cancelled: CancellationException) { throw cancelled }
        catch (failure: java.io.IOException) { null }
    val a = async { attempt(first) }
    val b = async { attempt(second) }
    a.await() to b.await()
}`,
      'Do not swallow CancellationException with broad catches or runCatching. Supervision does not automatically handle failures or make await succeed.',
      'Does CoroutineExceptionHandler recover a failed coroutine?',
      'No. It observes uncaught failures in applicable root contexts; recovery belongs around the operation or await.',
      'What should a broad catch do with cancellation?', ['Convert it to empty data', 'Rethrow it', 'Retry forever'], 1,
      'Cancellation is cooperative control flow and must remain observable by the coroutine hierarchy.'),
    lesson('kotlin-flows', 'Flow, StateFlow & SharedFlow',
      'A flow builder is cold and runs per collector. StateFlow is hot current state with an initial value; SharedFlow is hot broadcast with configurable replay.',
      'Expose read-only observable state while keeping updates inside its owner.',
      `// Requires kotlinx-coroutines-core.
import kotlinx.coroutines.flow.*

class CounterState {
    private val mutable = MutableStateFlow(0)
    val count: StateFlow<Int> = mutable.asStateFlow()
    fun increment() { mutable.update { it + 1 } }
}
fun numbers(): Flow<Int> = flow {
    emit(1)
    emit(2)
}
// SharedFlow with replay = 0 does not retain events
// for subscribers that are absent.`,
      'StateFlow conflates equal values and slow collectors can skip intermediate states. Neither hot flow is a durable exactly-once event queue.',
      'When would you choose StateFlow over SharedFlow?',
      'When a new observer should immediately receive the current value; SharedFlow is useful for broadcasts with deliberate replay/buffering semantics.',
      'What does a new StateFlow collector receive?', ['Only future changes', 'The current value', 'Every historical value'], 1,
      'StateFlow always has a value and replays the latest one.'),
    lesson('kotlin-concurrency', 'Dispatchers & shared state',
      'Use Default for CPU work and IO for blocking I/O. A dispatcher does not make shared read-modify-write operations atomic.',
      'Protect a multi-step update with a suspending mutex.',
      `// Requires kotlinx-coroutines-core.
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

class SafeCounter {
    private val mutex = Mutex()
    private var value = 0
    suspend fun increment(): Int = mutex.withLock {
        value += 1
        value
    }
    suspend fun snapshot(): Int = mutex.withLock { value }
}
// For a simple JVM counter, AtomicInteger is another option.`,
      'Volatile visibility does not make value++ atomic. Keep critical sections short; Mutex is not reentrant.',
      'How do you make blocking repository work testable?',
      'Inject its dispatcher and move blocking calls with withContext. A suspending non-blocking client may already manage its own execution.',
      'What does a mutex protect here?', ['Every process on the device', 'The critical section for this instance', 'Only reads'], 1,
      'All accesses use the same mutex, preventing concurrent interleaving of the protected state.'),
    lesson('kotlin-coroutine-tests', 'Deterministic coroutine tests',
      'runTest provides a test scope and virtual time for delays on its test scheduler. Test behavior without waiting for wall-clock time.',
      'Verify delayed work and cancellation with predictable scheduling.',
      `// Test source: requires kotlinx-coroutines-test and kotlin-test.
import kotlinx.coroutines.*
import kotlinx.coroutines.test.*
import kotlin.test.*

@OptIn(ExperimentalCoroutinesApi::class)
class DelayTest {
    @Test fun delayedValue() = runTest {
        val result = async { delay(1_000); 42 }
        assertFalse(result.isCompleted)
        advanceUntilIdle()
        assertEquals(42, result.await())
    }
}`,
      'Virtual time does not skip delays on hardcoded Default/IO dispatchers. Inject test dispatchers sharing one scheduler; cancel long-lived collectors.',
      'Does runTest prove thread safety?',
      'No. Its typical single-threaded scheduling makes timing deterministic, but real parallel races need separate stress or concurrency tests.',
      'Why can this test complete without a real one-second wait?', ['delay is ignored everywhere', 'The test scheduler advances virtual time', 'async blocks the thread'], 1,
      'The async child inherits the test scheduler, whose pending delay is advanced by advanceUntilIdle.')
  );
  section('structures').sources.push(
    { title: 'Java: access-ordered LinkedHashMap', url: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/LinkedHashMap.html' },
    { title: 'Princeton: union-find', url: 'https://algs4.cs.princeton.edu/15uf/' },
    { title: 'Princeton: tries', url: 'https://algs4.cs.princeton.edu/52trie/' }
  );
  section('structures').lessons.push(
    lesson('structures-graphs', 'Graph representations',
      'An adjacency list uses O(V + E) space; a matrix uses O(V²) but answers edge existence in O(1). Model direction and weights explicitly.',
      'Represent sparse relationships for BFS, DFS, and dependency analysis.',
      `fun undirectedGraph(n: Int, edges: List<Pair<Int, Int>>): List<List<Int>> {
    require(n >= 0)
    val graph = List(n) { mutableListOf<Int>() }
    for ((a, b) in edges) {
        require(a in 0 until n && b in 0 until n)
        graph[a].add(b)
        graph[b].add(a)
    }
    return graph
}
// O(V + E) construction. Parallel edges are retained.
// For a directed graph, add only a -> b.`,
      'An undirected edge appears twice. With adjacency lists, checking a particular edge takes O(degree) unless neighbors use a set.',
      'When would a matrix be reasonable?',
      'For small dense graphs or workloads dominated by edge-existence queries where quadratic space is acceptable.',
      'Which usually uses less space for a sparse graph?', ['Adjacency list', 'Adjacency matrix', 'They always tie'], 0,
      'An adjacency list stores actual edges rather than a cell for every possible pair.'),
    lesson('structures-trie', 'Tries & prefix lookup',
      'A trie shares character prefixes. Insert and lookup take O(L) expected time with hash-map children, for a word of L UTF-16 units.',
      'Support dictionary membership and autocomplete prefix checks.',
      `class Trie {
    private class Node {
        val children = HashMap<Char, Node>()
        var terminal = false
    }
    private val root = Node()
    fun insert(word: String) {
        var node = root
        for (c in word) node = node.children.getOrPut(c) { Node() }
        node.terminal = true
    }
    private fun find(text: String): Node? {
        var node = root
        for (c in text) node = node.children[c] ?: return null
        return node
    }
    fun contains(word: String): Boolean = find(word)?.terminal == true
    fun startsWith(prefix: String): Boolean = find(prefix) != null
}
// Space O(total inserted character count), before prefix sharing.`,
      'A present path is not necessarily a complete word. Normalize case deliberately; this implementation treats UTF-16 units as edges.',
      'Why keep a terminal flag?',
      'It distinguishes a stored word from a prefix created only as part of a longer word.',
      'After inserting “android”, is contains("and") true?', ['Yes', 'No', 'Only for a hash trie'], 1,
      'The path exists, but its final node was not marked as a complete word.'),
    lesson('structures-union-find', 'Union-find & connectivity',
      'Track disjoint components with parent links. Path compression and union by size give near-constant amortized operations, O(α(n)).',
      'Detect connectivity as edges arrive, or support Kruskal’s minimum spanning tree.',
      `class UnionFind(n: Int) {
    init { require(n >= 0) }
    private val parent = IntArray(n) { it }
    private val size = IntArray(n) { 1 }
    fun find(value: Int): Int {
        require(value in parent.indices)
        var x = value
        while (x != parent[x]) {
            parent[x] = parent[parent[x]]
            x = parent[x]
        }
        return x
    }
    fun union(a: Int, b: Int): Boolean {
        var x = find(a)
        var y = find(b)
        if (x == y) return false
        if (size[x] < size[y]) { val temp = x; x = y; y = temp }
        parent[y] = x
        size[x] += size[y]
        return true
    }
}
// O(n) storage; union returns whether two components merged.`,
      'Basic union-find cannot efficiently undo arbitrary deletions and does not reconstruct paths between vertices.',
      'How can union detect a cycle in an undirected graph?',
      'If an edge connects two vertices already in the same component, adding that edge closes a cycle.',
      'What does path compression change?', ['Vertex values', 'Parent links toward the root', 'Edge weights'], 1,
      'It shortens future root searches without changing component membership.'),
    lesson('structures-lru', 'LRU cache',
      'Combine key lookup with recency order. A hash map plus doubly linked list gives O(1) expected get/put and O(capacity) space.',
      'Bound a memory cache and evict the least recently accessed entry.',
      `// Kotlin/JVM: access-ordered LinkedHashMap supplies both parts.
class LruCache<K, V : Any>(private val capacity: Int) {
    init { require(capacity > 0) }
    private val entries = object : java.util.LinkedHashMap<K, V>(16, 0.75f, true) {
        override fun removeEldestEntry(
            eldest: MutableMap.MutableEntry<K, V>?
        ): Boolean = size > capacity
    }
    operator fun get(key: K): V? = entries[key]
    fun put(key: K, value: V) { entries[key] = value }
}
// get updates recency. Null means a cache miss.
// Entry-count capacity; not a byte-budget cache.`,
      'This cache is not thread-safe: even get changes recency. Lock all accesses if shared; Android LruCache can support weighted sizing.',
      'Why not use a singly linked list alone?',
      'Finding a key or its predecessor would require scanning. Hash lookup and bidirectional links let you remove and move an entry directly.',
      'With capacity 2: put A, put B, get A, put C. Which is evicted?', ['A', 'B', 'C'], 1,
      'Accessing A makes it recent, leaving B as the least recently used entry.')
  );
  section('algorithms').sources.push(
    { title: 'Princeton: directed graphs', url: 'https://algs4.cs.princeton.edu/42digraph/' },
    { title: 'Princeton: shortest paths', url: 'https://algs4.cs.princeton.edu/44sp/' }
  );
  section('algorithms').lessons.push(
    lesson('algorithms-complexity', 'Complexity & invariants',
      'Count work as input grows and distinguish auxiliary space from output space. Nested loops are not automatically quadratic.',
      'Explain why each pointer moves at most n times and state the invariant before coding.',
      `fun countRuns(sorted: IntArray): Int {
    var runs = 0
    var i = 0
    while (i < sorted.size) {
        val value = sorted[i]
        while (i < sorted.size && sorted[i] == value) i++
        runs++
    }
    return runs
}
// O(n) time, O(1) extra space: i never moves backward.
// On sorted input, runs equals the number of distinct values.`,
      'Include sorting, slicing, hashing assumptions, recursion depth, and output size in the total. Amortized and worst-case costs differ.',
      'Why is the nested loop linear?',
      'Across all outer iterations, the shared index advances exactly n times; the inner loop does not restart from zero.',
      'What is the auxiliary space of countRuns?', ['O(n)', 'O(log n)', 'O(1)'], 2,
      'Only a fixed number of scalar variables is retained.'),
    lesson('algorithms-two-pointers', 'Two pointers on sorted input',
      'Use ordering to eliminate candidates by moving one boundary at a time. Two-sum search is O(n) time and O(1) extra space after sorting.',
      'Find a pair summing to a target without an additional hash map.',
      `fun pairSum(a: IntArray, target: Long): Pair<Int, Int>? {
    var left = 0
    var right = a.lastIndex
    while (left < right) {
        val sum = a[left].toLong() + a[right]
        when {
            sum < target -> left++
            sum > target -> right--
            else -> return left to right
        }
    }
    return null
}
// Precondition: a is sorted ascending.
// Returns distinct indices into that sorted array.`,
      'Sorting adds O(n log n) and changes original indices. For unsorted index results, use indexed pairs or a hash map.',
      'Why move left when the sum is too small?',
      'For that left value, every smaller right value also gives too small a sum, so only increasing left can help.',
      'Why require left < right?', ['To use distinct elements', 'To avoid sorting', 'To allow duplicates'], 0,
      'Using the same index twice would not be a valid pair of distinct positions.'),
    lesson('algorithms-intervals', 'Merge overlapping intervals',
      'Sort intervals by start, then extend the current merged interval or start a new one. O(n log n) time, O(n) output space.',
      'Combine calendar occupancy or covered ranges.',
      `data class Interval(val start: Int, val end: Int)
fun mergeIntervals(input: List<Interval>): List<Interval> {
    require(input.all { it.start <= it.end })
    val result = mutableListOf<Interval>()
    for (next in input.sortedBy { it.start }) {
        val last = result.lastOrNull()
        if (last == null || next.start > last.end) {
            result.add(next)
        } else {
            result[result.lastIndex] = Interval(last.start, maxOf(last.end, next.end))
        }
    }
    return result
}
// Closed intervals: touching endpoints are merged.`,
      'Specify whether endpoints are closed or half-open. The overlap test must match that convention.',
      'Why must intervals be sorted first?',
      'Once starts are ordered, any new overlap can only extend the last merged range rather than an earlier disjoint range.',
      'Under this policy, [1,3] and [3,5] become?', ['Two intervals', '[1,5]', '[3,3]'], 1,
      'Closed intervals share endpoint 3, so they overlap.'),
    lesson('algorithms-backtracking', 'Backtracking & subsets',
      'Build a candidate, explore its choices, then undo each choice. State the search tree size; subsets inherently have exponential output.',
      'Enumerate combinations or solve constrained search with early pruning.',
      `fun subsets(values: IntArray): List<List<Int>> {
    require(values.size <= 20) // teaching output-size limit
    val result = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>()
    fun visit(index: Int) {
        if (index == values.size) { result.add(path.toList()); return }
        visit(index + 1)
        path.add(values[index])
        visit(index + 1)
        path.removeAt(path.lastIndex)
    }
    visit(0)
    return result
}
// O(n * 2^n) time/output; O(n) auxiliary stack/path.
// Equal input values can produce equal-valued subsets.`,
      'Copy path when saving a result; otherwise answers share later mutations. Restore state on every return path.',
      'How do you avoid duplicate-valued subsets?',
      'Sort first and skip equal candidates at the same decision depth, using a loop-based choice traversal.',
      'How many subsets do n distinct positions have?', ['n²', '2n', '2^n'], 2,
      'Each position has two independent choices: include it or exclude it.'),
    lesson('algorithms-topological', 'Topological sort',
      'A DAG admits an ordering with every dependency before its dependent. Kahn’s algorithm repeatedly removes zero-indegree vertices.',
      'Schedule tasks or determine whether dependency constraints contain a cycle.',
      `fun topologicalOrder(graph: List<List<Int>>): List<Int>? {
    val indegree = IntArray(graph.size)
    for (neighbors in graph) for (v in neighbors) {
        require(v in graph.indices)
        indegree[v]++
    }
    val ready = ArrayDeque<Int>()
    for (v in graph.indices) if (indegree[v] == 0) ready.addLast(v)
    val result = mutableListOf<Int>()
    while (ready.isNotEmpty()) {
        val v = ready.removeFirst()
        result.add(v)
        for (next in graph[v]) {
            indegree[next]--
            if (indegree[next] == 0) ready.addLast(next)
        }
    }
    return result.takeIf { it.size == graph.size }
}
// Edge u -> v means u precedes v. O(V + E) time, O(V) extra space.`,
      'A graph can have many valid orders. A partial result is not success: remaining vertices indicate a directed cycle.',
      'What does indegree represent?',
      'The number of incoming dependencies that have not yet been removed.',
      'What does null mean here?', ['Empty graph', 'A directed cycle exists', 'There is more than one order'], 1,
      'If not every vertex is processed, a cycle blocks the remaining dependency chain.'),
    lesson('algorithms-dijkstra', 'Dijkstra for weighted paths',
      'Expand the smallest tentative distance using a min-heap. Nonnegative weights make finalized shortest distances safe.',
      'Find least-cost routes when edges have different nonnegative costs.',
      `// Kotlin/JVM. Edge weights are Int; distances use Long.
import java.util.PriorityQueue

data class Edge(val to: Int, val weight: Int)
data class Pending(val vertex: Int, val distance: Long)
fun dijkstra(graph: List<List<Edge>>, start: Int): LongArray {
    require(start in graph.indices)
    require(graph.all { edges -> edges.all { it.to in graph.indices && it.weight >= 0 } })
    val distance = LongArray(graph.size) { Long.MAX_VALUE }
    val heap = PriorityQueue(compareBy<Pending> { it.distance })
    distance[start] = 0
    heap.add(Pending(start, 0))
    while (heap.isNotEmpty()) {
        val current = heap.remove()
        if (current.distance != distance[current.vertex]) continue
        for (edge in graph[current.vertex]) {
            val candidate = current.distance + edge.weight
            if (candidate < distance[edge.to]) {
                distance[edge.to] = candidate
                heap.add(Pending(edge.to, candidate))
            }
        }
    }
    return distance
}
// Unreachable = Long.MAX_VALUE. O(V + E log(E + 1)) time;
// O(V + E) extra space with duplicate heap entries.`,
      'Negative edges invalidate Dijkstra’s guarantee. Ignore stale heap entries; never add weights to the unreachable sentinel.',
      'Why can the heap contain the same vertex several times?',
      'Each improvement adds a new distance entry; stale entries are discarded when removed instead of implementing decrease-key.',
      'Which input violates this algorithm’s precondition?', ['Disconnected vertices', 'Zero-weight edges', 'Negative-weight edges'], 2,
      'A later negative edge could improve a distance that the greedy ordering treated as settled.'),
    lesson('algorithms-greedy', 'Greedy choice & exchange arguments',
      'A greedy algorithm commits to a local choice only when you can justify that an optimal solution can include it.',
      'Select the maximum number of non-overlapping activities by earliest finish time.',
      `data class Activity(val start: Int, val end: Int)
fun maximumActivities(input: List<Activity>): Int {
    require(input.all { it.start < it.end })
    var finish = Int.MIN_VALUE
    var count = 0
    for (activity in input.sortedBy { it.end }) {
        if (activity.start >= finish) {
            count++
            finish = activity.end
        }
    }
    return count
}
// Half-open intervals [start, end); touching is allowed.
// O(n log n) time, O(n) space for sorted copy.`,
      'Earliest start or shortest duration is not generally optimal. Weighted interval scheduling needs dynamic programming.',
      'Why is choosing earliest finish safe?',
      'Replace the first activity in an optimal schedule with the earliest-finishing one; it leaves at least as much room for all later activities.',
      'Which variant breaks this simple greedy solution?', ['Touching endpoints', 'Different rewards per activity', 'Unsorted input'], 1,
      'Maximizing reward may favor one long valuable activity over several short ones.'),
    lesson('algorithms-bits', 'Bit operations & XOR',
      'Use and/or/xor and shifts for flags and compact sets. XOR cancels equal bit patterns and combines in any order.',
      'Find the sole unpaired integer when every other integer appears exactly twice.',
      `fun singleNumber(values: IntArray): Int {
    require(values.isNotEmpty())
    var answer = 0
    for (value in values) answer = answer xor value
    return answer
}
fun isPowerOfTwo(n: Int): Boolean =
    n > 0 && (n and (n - 1)) == 0
// singleNumber: O(n) time, O(1) space.
// Precondition: one value occurs once; all others twice.
// shl = left shift; shr = signed; ushr = zero-fill right shift.`,
      'XOR does not validate the occurrence precondition. Int shifts mask the shift distance to 5 bits; use Long for wider masks.',
      'Why does n and (n - 1) help?',
      'It clears the lowest set bit. A positive power of two has only one set bit, so the result becomes zero.',
      'What is x xor x?', ['x', '0', '1'], 1,
      'Every matching bit cancels, leaving zero, including for negative Int values.')
  );
})();
