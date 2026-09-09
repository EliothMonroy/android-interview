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
