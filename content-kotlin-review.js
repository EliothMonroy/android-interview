/* Second content review: focused gaps, appended after the core primers. */
(() => {
  const lesson = (id, title, summary, useCase, code, pitfall, question, answer, quizQuestion, options, correct, explanation) => ({
    id, title, summary, useCase, code, language: 'kotlin', pitfall, question, answer,
    quiz: { question: quizQuestion, options, correct, explanation }
  });
  const additions = {
    kotlin: [
      lesson('kotlin-flow-operators', 'Flow operators: cancel, buffer, or drop?',
        'Choose operators by behavior: debounce waits for quiet input; flatMapLatest cancels the previous inner flow; buffer decouples producer and consumer.',
        'Build a search pipeline and explain when obsolete requests are canceled.',
        `// Requires kotlinx-coroutines-core. search must cooperate with cancellation.
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.*

@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
fun searchResults(
    queries: Flow<String>,
    search: suspend (String) -> List<String>
): Flow<List<String>> = queries
    .map { it.trim() }
    .distinctUntilChanged()
    .debounce(300)
    .flatMapLatest { query ->
        flow {
            emit(if (query.isEmpty()) emptyList() else search(query))
        }
    }
    .buffer(0)
// Collect this flow from a lifecycle-owned coroutine.`,
        'Cancellation happens when the debounced query emits, not immediately on a keystroke, and cannot undo remote side effects. An uncaught search error ends collection; catch recoverable failures inside the inner flow to handle later queries, preserving cancellation.',
        'How do buffer, conflate, and collectLatest differ?',
        'buffer queues values and normally suspends when full; conflate skips pending intermediate values; collectLatest cancels the previous collector action. Choose dropping only when intermediate values are dispensable.',
        'What does flatMapLatest cancel when a new upstream value arrives?',
        ['The entire application scope', 'The previous inner flow', 'Every future request'], 1,
        'It switches inner flows while preserving collection of future upstream values.'),
      lesson('kotlin-channels', 'Channels versus broadcast flows',
        'Channel receivers compete for items; SharedFlow broadcasts to active collectors according to replay/buffer policy. Neither guarantees durable completion of work.',
        'Distribute independent in-memory jobs across a bounded worker pool.',
        `// Requires kotlinx-coroutines-core.
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel

suspend fun processJobs(
    ids: List<Int>, workers: Int,
    process: suspend (Int) -> Unit
) = coroutineScope {
    require(workers in 1..64)
    val jobs = Channel<Int>(capacity = workers)
    launch {
        try { for (id in ids) jobs.send(id) }
        finally { jobs.close() }
    }
    repeat(workers) {
        launch { for (id in jobs) process(id) }
    }
}
// O(job count) dispatch work; O(workers) buffered IDs/coroutines.
// process may run concurrently and must protect shared state.`,
        'Receiving an item does not acknowledge successful processing. Failure cancels this scope; crashes lose queued work. Persist important commands and track retries/idempotency separately.',
        'What if two workers receive from one channel?',
        'An item is handed to one receiver, not copied to both. With SharedFlow, multiple active collectors can observe the same emission. Cancellation can interrupt a handoff or processing.',
        'Which primitive fits broadcast updates to multiple observers?',
        ['A Channel with competing receivers', 'SharedFlow', 'A plain MutableList'], 1,
        'SharedFlow models broadcast. Configure replay carefully because absent subscribers do not automatically receive past events.'),
      lesson('kotlin-unicode', 'Strings, code points & allocation',
        'Kotlin/JVM String indices count UTF-16 code units. A code point may occupy two units, and one visible grapheme can contain multiple code points.',
        'Clarify what “character” means before implementing frequency counts, reversal, or substring logic.',
        `// Kotlin/JVM; also usable on Android. No stream API required.
fun codePointCounts(text: String): Map<Int, Int> {
    val counts = HashMap<Int, Int>()
    var index = 0
    while (index < text.length) {
        val point = Character.codePointAt(text, index)
        counts[point] = (counts[point] ?: 0) + 1
        index += Character.charCount(point)
    }
    return counts
}
// codePointCounts("A😀").size == 2; "A😀".length == 3.
// O(n) expected time, O(k) space for k distinct code points.
// Assumes well-formed UTF-16; no normalization is performed.`,
        'Code points still are not grapheme clusters: combining accents and emoji sequences need a Unicode segmentation policy. Use buildString/StringBuilder for repeated appends instead of repeated immutable concatenation.',
        'Can visually identical text have different code point counts?',
        'Yes. A precomposed accented letter and a base letter plus combining mark can look alike. Agree on normalization and case-folding requirements before comparison.',
        'On Kotlin/JVM, what does String.length count?',
        ['Visible grapheme clusters', 'UTF-16 code units', 'UTF-8 bytes'], 1,
        'Supplementary characters occupy a surrogate pair and therefore contribute two units.')
    ],
    structures: [
      lesson('structures-cycle-detection', 'Fast & slow pointers: find a cycle',
        'Floyd’s algorithm moves one pointer one link and another two links. A cycle makes them eventually meet by identity; a null link proves termination.',
        'Detect accidental linked-list cycles without allocating a visited-node set.',
        `class Link(val value: Int, var next: Link? = null)
fun hasCycle(head: Link?): Boolean {
    var slow = head
    var fast = head
    while (true) {
        val firstStep = fast?.next ?: return false
        fast = firstStep.next
        slow = slow?.next
        if (slow != null && slow === fast) return true
    }
}
// O(n) time for n distinct reachable nodes; O(1) extra space.
// Null head -> false; a self-loop -> true.
// The links must not be mutated concurrently.`,
        'Compare node identity, not stored values. Different nodes may have equal values; a data-class structural equality can recurse through links.',
        'How would you find the cycle entry after a meeting?',
        'Reset one pointer to the head, leave the other at the meeting node, and move both one link at a time. Their next meeting is the cycle entry.',
        'Two different nodes hold value 7. Does that prove a cycle?',
        ['Yes', 'No; the pointers must reach the same node', 'Only in a sorted list'], 1,
        'A cycle concerns repeated node identity along links, not repeated data values.')
    ],
    algorithms: [
      lesson('algorithms-flood-fill', 'Grid flood fill & connected regions',
        'Treat each eligible cell as a graph vertex and adjacent cells as edges. An explicit queue avoids recursive call-stack limits.',
        'Count four-directional islands in a rectangular binary grid.',
        `fun countIslands(grid: Array<CharArray>): Int {
    if (grid.isEmpty()) return 0
    val cols = grid[0].size
    require(grid.all { row -> row.size == cols && row.all { it == '0' || it == '1' } })
    val steps = arrayOf(1 to 0, -1 to 0, 0 to 1, 0 to -1)
    val queue = ArrayDeque<Pair<Int, Int>>()
    var islands = 0
    for (row in grid.indices) for (col in 0 until cols) {
        if (grid[row][col] != '1') continue
        islands++
        grid[row][col] = '0'
        queue.addLast(row to col)
        while (queue.isNotEmpty()) {
            val (r, c) = queue.removeFirst()
            for ((dr, dc) in steps) {
                val nr = r + dr
                val nc = c + dc
                if (nr !in grid.indices || nc !in 0 until cols) continue
                if (grid[nr][nc] != '1') continue
                grid[nr][nc] = '0'
                queue.addLast(nr to nc)
            }
        }
    }
    return islands
}
// Mutates land to water. O(rows * cols) time and worst-case queue space.`,
        'Mark cells when enqueued to avoid duplicate work. Diagonal cells are separate here. To preserve input, copy every row or keep a visited matrix.',
        'Why is grid.copyOf() insufficient to preserve the original?',
        'It copies only the outer array; the inner CharArray rows are still shared. Use Array(grid.size) { grid[it].copyOf() } for independent rows.',
        'Two land cells touch only at a corner. How many islands?',
        ['One', 'Two', 'Zero'], 1,
        'This definition permits only horizontal and vertical adjacency.'),
      lesson('algorithms-lcs', 'Two-dimensional DP: common subsequences',
        'Let dp[i][j] be the LCS length of the first i and j characters. Matching final characters extend a smaller solution; otherwise skip one side.',
        'Compare sequence similarity and explain DP state, transition, base cases, and reconstruction.',
        `fun lcsLength(a: String, b: String): Int {
    require(a.length <= 2_000 && b.length <= 2_000) // teaching memory limit
    val dp = Array(a.length + 1) { IntArray(b.length + 1) }
    for (i in 1..a.length) for (j in 1..b.length) {
        dp[i][j] = if (a[i - 1] == b[j - 1]) {
            dp[i - 1][j - 1] + 1
        } else {
            maxOf(dp[i - 1][j], dp[i][j - 1])
        }
    }
    return dp[a.length][b.length]
}
// lcsLength("abcde", "ace") == 3; empty string -> 0.
// O(mn) time, O(mn) space; compares UTF-16 code units.`,
        'A subsequence can skip characters; a substring must be contiguous. The zero row and column represent empty prefixes, not uncomputed failure states.',
        'How can you reduce memory when only the length is needed?',
        'Keep the previous and current DP rows, placing the shorter string on the column axis for O(min(m,n)) space. Reconstructing a sequence needs additional strategy or stored choices.',
        'If the final characters differ, which recurrence applies?',
        ['dp[i - 1][j - 1] + 1', 'max(dp[i - 1][j], dp[i][j - 1])', 'Always zero'], 1,
        'At least one unequal final character is excluded, so take the better of the two smaller-prefix solutions.')
    ]
  };
  for (const [id, lessons] of Object.entries(additions)) {
    window.PRIMERS.find(section => section.id === id).lessons.push(...lessons);
  }
  const sources = {
    kotlin: [
      { title: 'Kotlin: flatMapLatest', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-latest.html' },
      { title: 'Kotlin: debounce', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/debounce.html' },
      { title: 'Kotlin: Flow buffering', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html' },
      { title: 'Kotlin: conflate', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/conflate.html' },
      { title: 'Kotlin: collectLatest', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect-latest.html' },
      { title: 'Kotlin: channel semantics and cancellation', url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/' },
      { title: 'Kotlin: strings', url: 'https://kotlinlang.org/docs/strings.html' },
      { title: 'Java: Unicode string representation', url: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/String.html' }
    ],
    structures: [
      { title: 'Princeton: tortoise and hare cycle detection', url: 'https://www.cs.princeton.edu/courses/archive/spr18/cos226/meetings/cm07-interview-contd.pdf' }
    ],
    algorithms: [
      { title: 'Princeton: connected components', url: 'https://algs4.cs.princeton.edu/41graph/' },
      { title: 'Princeton: longest common subsequence', url: 'https://introcs.cs.princeton.edu/java/23recursion/LongestCommonSubsequence.java.html' }
    ]
  };
  for (const [id, references] of Object.entries(sources)) {
    window.PRIMERS.find(section => section.id === id).sources.push(...references);
  }
})();
