# Interview coverage review

Reviewed 2026-09-09. Target: general Android engineering interviews, from foundational coding through common senior-level design discussions. This is a practical syllabus, not a guarantee of passing a particular employer's interview.

## Assessment

The original 32 lessons were an introductory refresher. They covered basic collections and traversals, a few Kotlin idioms, Android architecture and selected data flows, but were insufficient as the sole preparation for an interview loop. Missing areas included language type-system questions, coroutine behavior, several common coding patterns, concrete persistence/testing details, platform internals and end-to-end design exercises.

## Gaps addressed

| Primer | Added coverage |
| --- | --- |
| Kotlin | OOP/delegation, generics/variance, inline/reified types, equality/interop, initialization, cancellation/supervision, Flow and state streams, dispatcher/synchronization choices, deterministic coroutine tests, applied coding |
| Data structures | Graph representations, tries, union-find, LRU caches, selecting structures from required operations |
| Algorithms | Complexity reasoning, two pointers, interval merging, backtracking, topological sorting, Dijkstra, greedy reasoning, bit operations, tree recursion, monotonic stacks, timed problem-solving |
| Android | Navigation/back stack, lifecycle details, permissions/results, Room/migrations, DataStore, DI scopes, Compose effects, View mechanics/interoperability, unit/UI tests, ANRs/memory, build/release tooling, security, push, localization/accessibility and app implementation |
| Mobile system design | Chat delivery/replay, image pipelines, map/location tradeoffs, resumable transfers, realtime transport, resource budgets, observability/rollout, module boundaries, conflict/deletion handling, capacity estimates and design/experience walkthroughs |

## How to use the guide

1. Read a lesson, then answer its interview prompt before opening the answer.
2. Write the example from scratch and test boundary cases. Explain time/space complexity for coding problems and lifecycle/cancellation ownership for Android code.
3. Complete the practice lessons without copying. The quiz is recall feedback, not a readiness score.
4. Rehearse a full design discussion: requirements, assumptions, data flow, failure recovery, security, resource budgets and tradeoffs.
5. Tailor remaining study to the role. Specialist graphics, NDK/JNI, media codecs, Bluetooth, Wear/Auto/TV and advanced competitive algorithms need role-specific preparation; concise general primers cannot exhaust those domains.

Review marks continue to mean self-reported review. There is no automatic claim that reading all lessons demonstrates interview readiness. Behavioral examples should come from the candidate's own experience.

## Evidence and limits

Current Android/Kotlin guidance was checked against official documentation, with references included in each primer. Technical recommendations are grounded in the [Android architecture recommendations](https://developer.android.com/topic/architecture/recommendations), [testing fundamentals](https://developer.android.com/training/testing/fundamentals), [Kotlin documentation](https://kotlinlang.org/docs/home.html), and the section-specific primary references. Topic prioritization and exercises are editorial judgments rather than an employer-issued syllabus.

Automated checks exercise lesson rendering, IDs, quizzes, saved progress, navigation, theme behavior and offline assets. Kotlin and Android code is instructional: contextual snippets need the stated imports, dependencies and app types. It has not been compiled into an Android application. Real-device/browser visual QA is not part of this content review.

## Second pass

The second review targeted topics previously mentioned without enough implementation detail: canceling obsolete Flow work and handling slow collectors, channels versus broadcasts, Unicode assumptions, linked-list cycle detection, grid traversal, two-dimensional DP, concrete Room queries and indices, Fragment/Compose cleanup, observable Compose state, UI-event ownership, conditional HTTP caching, GraphQL writes, API evolution and account-switch races.

These additions deepen common interview material; they do not change the scope into an exhaustive reference for every Android specialty. The same interactive lesson format, saved review IDs and offline behavior remain in place.

The second pass adds 14 lessons (99 total). It also fixes three practice snippets by placing executable checks inside `main()`, so they use ordinary Kotlin-file syntax rather than implicitly requiring a Kotlin script. Nine automated site checks pass; Kotlin compilation remains unverified.

## Third pass: correctness, not expansion

All 99 lessons were reviewed again. No additional general-interview lessons were justified. Two examples were corrected:

- `algorithms-dfs` now stores an iterator for each active vertex. The earlier eager-neighbor marking counted reachable vertices correctly, but could skip an unprocessed sibling while descending and therefore did not preserve recursive DFS order. The frame stack pauses each parent until the child finishes, following the [Princeton nonrecursive DFS reference](https://algs4.cs.princeton.edu/41graph/NonrecursiveDFS.java.html).
- `background` now demonstrates `APPEND_OR_REPLACE` for queued outbox drains and explains its backlog tradeoff. `KEEP` ignores a new trigger while work is unfinished, which can miss an edit arriving after the worker's final outbox read. The lesson also explains the database-to-scheduler crash gap and reconciliation. See [WorkManager policy semantics](https://developer.android.com/reference/androidx/work/ExistingWorkPolicy).

The count remains 99. Review completion still does not establish Kotlin compilation, actual Android scheduling behavior, or interview readiness.
