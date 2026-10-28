# Kotlin Coroutines: PDF migration

The 42-page reviewed edition (30 September 2026) is adapted as 37 native chapters with the two resource pages distributed into chapter footers at `#coroutines`. The five-week schedule (source pages 29–31) is intentionally omitted from the web course at the owner’s request. The original PDF, including that schedule, remains available as a download. Existing primer lessons and their review IDs are unchanged.

## Content fidelity

- Source PDF SHA-256: `5879177006d2e6ba8895297ee637cf90fee21a91713dd139a9a81f1633ebf77f`.
- The authoring source was recovered and its text compared with the repository PDF, page by page. All 42 pages matched after removing whitespace and the repeated running footer.
- Outside the intentionally removed schedule pages, all paragraphs, headings, notes, 51 code blocks, 11 tables, the timeline, labs, worked solutions, glossary, verification limits, and 37 external links are retained. The reading sequence is grouped by learning prerequisites rather than physical PDF page order.
- The 20 answer cues on page 33 are native disclosure controls. Formatting is represented as text runs; Kotlin generic types are never interpreted as HTML.
- Original page references remain meaningful: each instructional chapter keeps its original source-page ID. Old resource-chapter links open a relevant chapter footer. Explicit page references link to the corresponding chapter, or to the original PDF for removed schedule pages; each chapter links back to its source PDF page.
- The setup versions and original verification record are part of the dated edition. This migration does not claim a new execution of Kotlin/Android examples or update them to arbitrary dependency versions.

## Validation

`tests/fixtures/coroutines-pdf-manifest.json` records independently extracted PDF page text hashes, exact code hashes, table counts, and link URLs. The site test compares these with the actual rendered DOM for all 37 retained instructional chapters; schedule pages 29–31 are explicitly excluded. The independently extracted `coroutines-reference-manifest.json` additionally checks the complete bodies of source pages 41–42, collected from actual chapter footers, with all annotations and 37 links intact. The original full-page manifest and source PDF are unchanged. It also checks source PDF identity, per-example copying, revealable answers, chapter navigation, saved review compatibility, build output, and offline asset inclusion. No Python/PDF package is needed to run the app or its Node tests.

Navigation order, grouping, resource placement, layout, line wrapping, and interaction controls differ from the PDF. The resource-page titles are no longer standalone chapter headings; all their reference content remains in footers. Content hashes deliberately ignore whitespace; code hashes do not. This catches lost words, missing generic types, dropped table cells, reordered material, and changed snippets. It does not establish Android device behavior or interview readiness.

## Page-to-chapter map

| PDF page | Group | Chapter |
| --- | --- | --- |
| 1 | START HERE | [Kotlin coroutines](../../index.html#coroutines/coroutines-01) |
| 2 | START HERE | [How to use this guide](../../index.html#coroutines/coroutines-02) |
| 3 | WEEK 1 | [Set up a small Kotlin lab](../../index.html#coroutines/coroutines-03) |
| 4 | WEEK 1 | [Read Kotlin syntax confidently](../../index.html#coroutines/coroutines-04) |
| 5 | WEEK 1 | [Lambdas, receivers, and generics](../../index.html#coroutines/coroutines-05) |
| 6 | WEEK 1 | [Threads, blocking, and concurrency](../../index.html#coroutines/coroutines-06) |
| 7 | WEEK 1 | [What suspend does](../../index.html#coroutines/coroutines-07) |
| 8 | WEEK 2 | [Four essential entry points](../../index.html#coroutines/coroutines-08) |
| 9 | WEEK 2 | [Decode your original program](../../index.html#coroutines/coroutines-09) |
| 10 | WEEK 2 | [Scope, context, and the Job tree](../../index.html#coroutines/coroutines-10) |
| 11 | WEEK 2 | [Structured concurrency](../../index.html#coroutines/coroutines-11) |
| 12 | WEEK 3 | [Cancellation is cooperative](../../index.html#coroutines/coroutines-12) |
| 13 | WEEK 3 | [Cleanup and deadlines](../../index.html#coroutines/coroutines-13) |
| 14 | WEEK 3 | [Exception propagation](../../index.html#coroutines/coroutines-14) |
| 15 | WEEK 3 | [coroutineScope vs supervisorScope](../../index.html#coroutines/coroutines-15) |
| 16 | WEEK 3 | [Job vs SupervisorJob](../../index.html#coroutines/coroutines-16) |
| 17 | WEEK 3 | [Dispatchers and main safety](../../index.html#coroutines/coroutines-17) |
| 18 | WEEK 3 | [async vs withContext](../../index.html#coroutines/coroutines-18) |
| 19 | WEEK 3 | [Model errors intentionally](../../index.html#coroutines/coroutines-19) |
| 20 | WEEK 3 | [Complete partial-success loader](../../index.html#coroutines/coroutines-20) |
| 21 | WEEK 4 | [Flow: a sequence over time](../../index.html#coroutines/coroutines-21) |
| 22 | WEEK 4 | [Flow operators and errors](../../index.html#coroutines/coroutines-22) |
| 23 | WEEK 4 | [StateFlow: the current state](../../index.html#coroutines/coroutines-23) |
| 24 | WEEK 4 | [SharedFlow: broadcast values](../../index.html#coroutines/coroutines-24) |
| 25 | WEEK 4 | [Android: a ViewModel owns loading](../../index.html#coroutines/coroutines-25) |
| 26 | WEEK 4 | [Android: collect with the lifecycle](../../index.html#coroutines/coroutines-26) |
| 27 | WEEK 5 | [Coroutine tests: virtual time](../../index.html#coroutines/coroutines-27) |
| 28 | WEEK 5 | [Test the failure policy](../../index.html#coroutines/coroutines-28) |
| 29 | PDF ONLY | Five-week schedule — intentionally omitted from the web course |
| 30 | PDF ONLY | Five-week schedule — intentionally omitted from the web course |
| 31 | PDF ONLY | Five-week schedule — intentionally omitted from the web course |
| 32 | PRACTICE | [Progressive labs](../../index.html#coroutines/coroutines-32) |
| 33 | PRACTICE | [Checkpoints with answer cues](../../index.html#coroutines/coroutines-33) |
| 34 | REFERENCE | [Quick reference and glossary](../../index.html#coroutines/coroutines-34) |
| 35 | WORKED PRACTICE | [Run snippets and discover tests](../../index.html#coroutines/coroutines-35) |
| 36 | WORKED PRACTICE | [Worked solution: the failure matrix](../../index.html#coroutines/coroutines-36) |
| 37 | WORKED PRACTICE | [Worked solution: streams](../../index.html#coroutines/coroutines-37) |
| 38 | WORKED PRACTICE | [Worked solution: shared state](../../index.html#coroutines/coroutines-38) |
| 39 | WORKED PRACTICE | [Worked solution: Android unit tests](../../index.html#coroutines/coroutines-39) |
| 40 | REVIEW | [Readiness review and next steps](../../index.html#coroutines/coroutines-40) |
| 41 | CHAPTER FOOTERS | [Foundations resources](../../index.html#coroutines/coroutines-03/resources) |
| 42 | CHAPTER FOOTERS | [Streams resources](../../index.html#coroutines/coroutines-21/resources) |

## Organization review

A dedicated content-review subagent found the concepts on source pages 3–28 already form a sound teaching sequence. The current course omits the five-week plan and places runnable snippet/JUnit setup (source page 35) beside the initial lab (page 3). Practice and worked solutions now remain adjacent; the quick reference follows them, then readiness review.

Group labels distinguish learning order from preserved PDF page numbers. Removed schedule routes use the existing unknown-chapter fallback to the course introduction. Saved review IDs are retained; removed chapters do not count toward current course progress.

Resources are selected from both explicit citations and the content review's topic mapping. Related links and their original annotations appear under Go deeper for the current chapter; the dated documentation note remains available there. Legacy routes 41/42 redirect the view to related chapter footers without deleting review keys or marking the destination as reviewed.
