/* Second content review: focused gaps, appended after the core primers. */
(() => {
  const lesson = (id, title, summary, useCase, code, pitfall, question, answer, quizQuestion, options, correct, explanation) => ({
    id, title, summary, useCase, code, language: 'kotlin', pitfall, question, answer,
    quiz: { question: quizQuestion, options, correct, explanation }
  });
  const additions = {
    kotlin: [
      lesson('kotlin-flow-operators', 'Flow operators: cancel, buffer, or drop?',
        "Flow operators encode different policies for changing input and slow consumers. This search pipeline trims queries, suppresses consecutive equal text, waits for 300 milliseconds of quiet, and switches to an inner flow for the accepted query. Empty queries produce an empty list instead of a request. flatMapLatest cancels the previous inner flow when the debounced query arrives. buffer(0) removes its queued output capacity but does not undo results already consumed.",
        "Use this pipeline for search suggestions when only the latest accepted query matters. Explain both the quiet-time policy and cancellation boundary, and collect from a lifecycle-owned scope. Model recoverable request failures inside each inner flow so later queries can still be processed.",
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
        "A keystroke does not immediately cancel the current request because debounce precedes flatMapLatest. Old work can finish during the quiet window. Cancellation must be supported by search and cannot undo remote side effects. A search exception escaping the inner flow ends collection unless recovery is explicitly arranged.",
        'How do buffer, conflate, and collectLatest differ?',
        "buffer lets upstream and downstream overlap through a queue; its normal overflow policy suspends upstream when that queue fills. conflate lets a slow consumer skip pending intermediate values and keep the latest, while an already running collector action continues. collectLatest instead cancels that running action when another value arrives. These policies act at different boundaries: flatMapLatest switches inner flows, whereas collectLatest switches terminal processing. Use dropping or cancellation only when intermediate work is dispensable, and ensure cancelled actions cooperate and release resources. They are poor defaults for commands whose every effect must complete.",
        'What does flatMapLatest cancel when a new upstream value arrives?',
        ['The entire application scope', 'The previous inner flow', 'Every future request'], 1,
        'It switches inner flows while preserving collection of future upstream values.'),
      lesson('kotlin-channels', 'Channels versus broadcast flows',
        "A Channel transfers each item to one competing receiver, making it suitable for distributing work rather than broadcasting it. processJobs validates the worker count, launches one producer, and starts that many workers in a common scope. The channel buffers at most workers queued IDs; a full buffer suspends sending. Closing after production lets workers drain queued items and finish. coroutineScope waits for the producer and workers, while processing can complete out of order.",
        "Use a bounded channel for temporary independent jobs such as processing an already loaded batch with limited concurrency. Choose worker count from resource constraints and make process safe for concurrent calls. Use SharedFlow when multiple observers should receive the same broadcast instead.",
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
        "A successful receive removes an item from the channel without confirming that processing succeeded. Failure cancels this scope and can leave jobs unfinished; process death loses in-memory work. Important jobs need persistence, explicit completion tracking, and a retry/idempotency policy rather than an assumption of exactly-once execution.",
        'What if two workers receive from one channel?',
        "The two workers compete, and a particular item is delivered to one of them rather than copied to both. Assignment and completion order should not be relied on for domain ordering, because workers can take different amounts of time. With SharedFlow, active collectors can each observe the same broadcast subject to replay and buffering policy. Channel handoff also does not acknowledge successful processing: cancellation or failure can intervene before the operation completes. If the requirement is reliable completion after restart, persist the job and its status independently of this in-memory transport.",
        'Which primitive fits broadcast updates to multiple observers?',
        ['A Channel with competing receivers', 'SharedFlow', 'A plain MutableList'], 1,
        'SharedFlow models broadcast. Configure replay carefully because absent subscribers do not automatically receive past events.'),
      lesson('kotlin-unicode', 'Strings, code points & allocation',
        "On Kotlin/JVM, String.length and indices count UTF-16 code units. A supplementary code point such as the emoji in A😀 uses two units. codePointCounts reads each code point with Character.codePointAt and advances by Character.charCount, so the emoji contributes one map entry rather than two surrogate entries. The loop counts distinct code points and their frequencies; it neither groups visible graphemes nor normalizes canonically equivalent text.",
        "Clarify the unit before implementing frequency maps, cursor movement, truncation, or reversal for international text. Code points are appropriate for some symbolic tasks, while user-visible editing often needs grapheme segmentation. Agree on normalization and comparison rules before calculating results or tests.",
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
        "Combining marks and multi-code-point emoji can form one visible grapheme, so correct code-point iteration still does not count visible characters. The example assumes well-formed UTF-16 rather than validating it. Repeated immutable concatenation can repeatedly copy growing text; use buildString or StringBuilder for incremental construction.",
        'Can visually identical text have different code point counts?',
        "Yes. A precomposed é is one code point, while e followed by a combining acute accent uses two, even when both render similarly. This function therefore produces different frequency maps for those inputs. If canonical equivalence is part of the requirement, normalize consistently, for example to NFC, before counting or comparing. Normalization is distinct from case folding and does not make all visually similar characters equal. Compatibility normalization can also erase distinctions that some applications need, so choose the form from the domain rather than applying it indiscriminately.",
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
