/* Reorganized web edition. Stable IDs and sourcePage values retain PDF provenance. */
window.PRIMERS.push({
  "id": "coroutines",
  "title": "Kotlin Coroutines",
  "subtitle": "The complete five-week study guide: foundations, ownership, cancellation, streams, Android, and tests.",
  "type": "course",
  "icon": "Co",
  "sources": [
    {
      "title": "Kotlin coroutines guide",
      "url": "https://kotlinlang.org/docs/coroutines-guide.html"
    },
    {
      "title": "Android coroutine best practices",
      "url": "https://developer.android.com/kotlin/coroutines/coroutines-best-practices"
    }
  ],
  "lessons": [
    {
      "id": "coroutines-01",
      "title": "Kotlin coroutines",
      "summary": "A complete study guide, from syntax to resilient Android code",
      "stage": "START HERE",
      "sourcePage": 1,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Build a precise mental model of suspension, task ownership, cancellation, and failure. Then apply it to streams, Android lifecycles, and deterministic tests."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Your anchor problem"
        },
        {
          "type": "code",
          "code": "suspend fun fetchProfile(): String {\n    delay(100)\n    return \"profile\"\n}\nsuspend fun fetchOrders(): String {\n    delay(50)\n    throw IllegalStateException(\"Wrong orders\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Why can orders cancel profile before orders.await() is reached? How can profile finish anyway? Every chapter adds a piece of the answer, then asks you to predict and test the behavior."
            }
          ]
        },
        {
          "type": "note",
          "title": "35 study sessions / 5 weeks",
          "runs": [
            {
              "text": "Plan for 45-60 minutes per study day. Read, predict, run, change one variable, and explain the result. The schedule includes implementation days, review days, and a capstone."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Prepared for the continuation of “Analyze Kotlin Syntax.” Examples and exercises use the original profile/orders scenario. Reviewed edition / 30 September 2026."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Code convention: JVM snippets use kotlinx.coroutines.*; Flow snippets also use kotlinx.coroutines.flow.*. Android and test listings identify their extra imports. Keep functions/types at file scope; put loose statements inside main or a test. Page 35 explains placement and test setup."
            }
          ]
        },
        {
          "type": "timeline"
        }
      ],
      "group": "START HERE",
      "referenceNumbers": [
        1,
        4
      ]
    },
    {
      "id": "coroutines-02",
      "title": "How to use this guide",
      "summary": "Learn the rules, then prove them with small experiments",
      "stage": "START HERE",
      "sourcePage": 2,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Read",
            "Topics",
            "Pages"
          ],
          "rows": [
            [
              "Foundations",
              "Setup, Kotlin syntax, threads, suspension",
              "3-7"
            ],
            [
              "Task ownership",
              "Builders, original program, Job tree, scopes",
              "8-11"
            ],
            [
              "Failure and cancellation",
              "Cancellation, cleanup, exceptions, supervision",
              "12-16"
            ],
            [
              "Choosing the tool",
              "Dispatchers, async vs withContext, error models",
              "17-20"
            ],
            [
              "Streams",
              "Flow operators, StateFlow, SharedFlow",
              "21-24"
            ],
            [
              "Android and tests",
              "ViewModel, lifecycle collection, virtual time",
              "25-28"
            ],
            [
              "Practice",
              "5-week schedule, labs, answers, quick reference",
              "29-34"
            ],
            [
              "Worked practice",
              "Test setup, solutions, races, Android tests",
              "35-40"
            ],
            [
              "Official resources",
              "Annotated, clickable reading list",
              "41-42"
            ]
          ]
        },
        {
          "type": "heading",
          "text": "A session that builds understanding"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Spend 10 minutes reading, 10 minutes predicting the next output and drawing the Job tree, 20-30 minutes running and modifying the example, and 5-10 minutes writing a short explanation from memory. Record expected output before pressing Run."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use approximate timelines only for reasoning. The 50 ms and 100 ms delays are teaching fixtures, not promises about wall-clock scheduling. Tests later replace those delays with virtual time."
            }
          ]
        },
        {
          "type": "note",
          "title": "Definition of progress",
          "runs": [
            {
              "text": "You can name the owner of each coroutine, explain how cancellation travels, distinguish failure from cancellation, and choose a scope based on the desired product behavior."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "If a checkpoint fails, repeat the related experiment with fewer moving parts. You can accelerate the syntax chapters if they are familiar, but keep the exception and supervision exercises."
            }
          ]
        }
      ],
      "group": "START HERE",
      "referenceNumbers": [
        1,
        22
      ]
    },
    {
      "id": "coroutines-29",
      "title": "Five-week schedule / weeks 1-2",
      "summary": "45-60 minutes each day; finish with a runnable experiment",
      "stage": "SCHEDULE",
      "sourcePage": 29,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Day",
            "Learn and do",
            "Proof of understanding"
          ],
          "rows": [
            [
              "1",
              "Setup and functions (3-4). Run the first main.",
              "Explain unresolved delay and dependency/import roles."
            ],
            [
              "2",
              "Types, nullability, exceptions (4). Exercise 1.",
              "Predict try/catch/finally output without running."
            ],
            [
              "3",
              "Lambdas and receivers (5). Exercise 2; snippet placement (35).",
              "Explain why launch resolves in a scope."
            ],
            [
              "4",
              "Threads and blocking (6). Exercise 3.",
              "Draw blocking vs suspending lanes."
            ],
            [
              "5",
              "Suspend functions (7). Sequential fixture.",
              "Explain why suspend does not start a task."
            ],
            [
              "6",
              "Review checkpoint A; repeat weakest example.",
              "Give a 3-minute explanation with no notes."
            ],
            [
              "7",
              "Rest or light review; annotate your lab notebook.",
              "List three predictions you initially got wrong."
            ],
            [
              "8",
              "Builders (8). Compare Job and Deferred.",
              "Explain join vs await and their cancellation."
            ],
            [
              "9",
              "Original program (9). Reproduce the failure.",
              "Explain done, missing profile, and escaped error."
            ],
            [
              "10",
              "Scope/context/Job (10). Exercise 4.",
              "Draw and label the complete ownership tree."
            ],
            [
              "11",
              "coroutineScope (11). Exercise 5.",
              "Catch the grouped failure at its call boundary."
            ],
            [
              "12",
              "Make orders succeed; compare sequential/concurrent.",
              "Start both async calls before either await."
            ],
            [
              "13",
              "Complete lab A on page 32.",
              "Predict outcomes after moving/removing launch."
            ],
            [
              "14",
              "Review checkpoint B on page 33.",
              "Explain scope ownership without thread jargon."
            ]
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Keep a notebook entry for each session: prediction, observed output, Job tree, explanation, and one changed variable. Timing experiments should use successful fixtures first; adding exceptions before understanding overlap obscures the concurrency lesson."
            }
          ]
        },
        {
          "type": "note",
          "title": "Adapt the pace",
          "runs": [
            {
              "text": "If syntax is already familiar, spend the saved sessions on exception experiments. Do not compress the supervision or cancellation sections just because their APIs are short."
            }
          ]
        }
      ],
      "group": "FIVE-WEEK STUDY PLAN",
      "referenceNumbers": [
        1,
        22
      ]
    },
    {
      "id": "coroutines-30",
      "title": "Five-week schedule / weeks 3-4",
      "summary": "Turn the execution model into deliberate application behavior",
      "stage": "SCHEDULE",
      "sourcePage": 30,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Day",
            "Learn and do",
            "Proof of understanding"
          ],
          "rows": [
            [
              "15",
              "Cancellation and CPU loops (12). Exercise 6.",
              "Cancel a child without failing its parent."
            ],
            [
              "16",
              "Cleanup and deadlines (13). Exercise 7.",
              "Distinguish timeout from outer cancellation."
            ],
            [
              "17",
              "Exception propagation (14). Exercise 8.",
              "Predict normal vs supervised async failure."
            ],
            [
              "18",
              "Supervision and owned Jobs (15-16). Exercise 9.",
              "Explain the direct-child supervision limit."
            ],
            [
              "19",
              "Dispatchers (17-18), shared-state lab (38).",
              "Place blocking work and choose async only for overlap."
            ],
            [
              "20",
              "Result and partial loader (19-20, 36). Exercises 12-13.",
              "Preserve partial success and rethrow cancellation."
            ],
            [
              "21",
              "Lab B (32) and checkpoint C (33).",
              "Run every failure combination and cancellation."
            ],
            [
              "22",
              "Cold Flow (21). Exercise 14; worked stream test (37).",
              "Predict work performed by two collectors."
            ],
            [
              "23",
              "Operators and error boundaries (22). Exercise 15.",
              "Explain catch placement and collectLatest cancellation."
            ],
            [
              "24",
              "StateFlow (23). Exercise 16.",
              "Model loading, success, and errors explicitly."
            ],
            [
              "25",
              "SharedFlow (24). Exercise 17.",
              "Demonstrate no-subscriber loss with replay = 0."
            ],
            [
              "26",
              "Android ViewModel (25). Exercise 18.",
              "Implement latest-refresh-wins with main-safe data calls."
            ],
            [
              "27",
              "Lifecycle collection (26). Exercise 19.",
              "Trace collection and loading lifetimes separately."
            ],
            [
              "28",
              "Review checkpoint D; practice on device/emulator.",
              "Observe stop/restart and rotation behavior."
            ]
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "When translating console examples to Android, replace the demo runBlocking entry point with viewModelScope.launch. Keep the suspend loader reusable. Avoid rewriting the failure policy separately in every screen."
            }
          ]
        },
        {
          "type": "note",
          "title": "Decision checkpoint",
          "runs": [
            {
              "text": "Before adding a stream or event channel, state what must survive: a sibling failure, a collector pause, view recreation, or process death. These are four different lifetime requirements."
            }
          ]
        }
      ],
      "group": "FIVE-WEEK STUDY PLAN",
      "referenceNumbers": [
        4,
        8,
        21,
        22
      ]
    },
    {
      "id": "coroutines-31",
      "title": "Five-week schedule / week 5",
      "summary": "Test, consolidate, and build a small dashboard capstone",
      "stage": "SCHEDULE",
      "sourcePage": 31,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Day",
            "Learn and do",
            "Deliverable"
          ],
          "rows": [
            [
              "29",
              "Test setup (35), virtual time (27). Exercise 20.",
              "A passing fixture test without real sleeps."
            ],
            [
              "30",
              "Failure policy tests (28). Exercise 21.",
              "Partial success, grouped failure, cancellation tests."
            ],
            [
              "31",
              "Lab C streams (32). Add lifecycle verification.",
              "Flow, StateFlow, and SharedFlow observations."
            ],
            [
              "32",
              "Capstone: repository and immutable UI state.",
              "Both requests run concurrently; errors modeled."
            ],
            [
              "33",
              "Capstone: ViewModel, refresh, lifecycle collector.",
              "Latest refresh wins; rendering is lifecycle-aware."
            ],
            [
              "34",
              "Capstone: Android tests (39), review rubric (40).",
              "A compact evidence log for behavior and lifetime."
            ],
            [
              "35",
              "Final checkpoint (33), teach-back, clean up.",
              "Explain the original program and your final solution."
            ]
          ]
        },
        {
          "type": "heading",
          "text": "Capstone acceptance criteria"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Build a profile/orders dashboard backed by fake repositories first. Start both requests concurrently. Show a successful profile when orders fails. Represent empty orders separately from unavailable orders. Cancel stale refreshes, keep repository work main-safe, and expose immutable StateFlow to the UI."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Add tests for both success, either failure, both failures, and caller cancellation. Verify that essential state remains available after lifecycle collection restarts. If you add snackbar events, demonstrate your chosen replay/drop behavior rather than claiming guaranteed delivery."
            }
          ]
        },
        {
          "type": "heading",
          "text": "What a good final explanation includes"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "“The caller owns the loading operation. Its supervisor controls direct-child failure isolation. Each request maps expected errors to a Result and preserves CancellationException. The ViewModel owns refresh lifetime; the view lifecycle owns rendering. Dispatchers describe execution resources. Tests replace those resources and advance virtual time.”"
            }
          ]
        },
        {
          "type": "note",
          "title": "Graduation criterion",
          "runs": [
            {
              "text": "Without looking at the guide, draw the original Job tree, predict its output, fix all-or-nothing handling, fix partial-success handling, and explain why changing only await order or only the dispatcher cannot accomplish those policies."
            }
          ]
        }
      ],
      "group": "FIVE-WEEK STUDY PLAN",
      "referenceNumbers": [
        21,
        25,
        26
      ]
    },
    {
      "id": "coroutines-03",
      "title": "Set up a small Kotlin lab",
      "summary": "A runnable JVM starting point before Android integration",
      "stage": "WEEK 1",
      "sourcePage": 3,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Create a Kotlin/JVM Gradle project in IntelliJ IDEA. Keep its generated Kotlin plugin and JDK configuration. Add the following repositories and dependencies to build.gradle.kts, then sync Gradle. The official coroutine documentation currently shows 1.11.0; keep core and test on the same version. [1, 22]"
            }
          ]
        },
        {
          "type": "code",
          "code": "repositories { mavenCentral() }\ndependencies {\n    implementation(\n        \"org.jetbrains.kotlinx:kotlinx-coroutines-core:1.11.0\"\n    )\n    testImplementation(kotlin(\"test-junit5\"))\n    testImplementation(\n        \"org.jetbrains.kotlinx:kotlinx-coroutines-test:1.11.0\"\n    )\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Put this in src/main/kotlin/Main.kt. It is a complete, successful first run. Keep fetchOrders failing; create a separate successful fixture when an exercise asks for one."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.*\n\nsuspend fun fetchProfile(): String {\n    delay(100)\n    return \"profile\"\n}\nsuspend fun fetchOrders(): String {\n    delay(50)\n    throw IllegalStateException(\"Wrong orders\")\n}\nfun main() = runBlocking {\n    println(fetchProfile())\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Expected output: profile. If delay is unresolved, first check the coroutine dependency, Gradle sync, and the import. A Kotlin file alone does not supply kotlinx.coroutines. If the chosen coroutine version requires a newer Kotlin compiler, update the project using the official compatibility information rather than mixing arbitrary versions."
            }
          ]
        },
        {
          "type": "note",
          "title": "Keep examples separate",
          "runs": [
            {
              "text": "Replace main for each experiment. Do not paste several main functions with identical signatures into one source set. Android dependencies appear in its chapters. Before running tests, add the test engine configuration on page 35."
            }
          ]
        }
      ],
      "group": "FOUNDATIONS AND LAB SETUP",
      "referenceNumbers": [
        1,
        22,
        31
      ]
    },
    {
      "id": "coroutines-35",
      "title": "Run snippets and discover tests",
      "summary": "Remove setup friction before studying behavior",
      "stage": "WORKED PRACTICE",
      "sourcePage": 35,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A .kt file accepts declarations such as functions and classes at file scope, but not loose statements such as println or attempts += 1. Place those inside a function. The syntax listings on pages 4-5 mix declarations and usage to explain them; this is how to run that usage:"
            }
          ]
        },
        {
          "type": "code",
          "code": "fun label(id: Int): String = \"user-$id\"\nfun main() {\n    val profile = label(7)\n    var attempts = 0\n    attempts += 1\n    println(\"profile: $profile, attempts: $attempts\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use src/main/kotlin/Main.kt for the demo, and src/test/kotlin/ProfileTest.kt for the class on page 27. Keep your generated Kotlin/JVM plugin and compatible JDK configuration. The setup below uses Jupiter via the Kotlin JUnit integration; JUnit 6 requires Java 17 or later. [31]"
            }
          ]
        },
        {
          "type": "code",
          "code": "// Add to build.gradle.kts alongside the core/test dependencies.\ndependencies {\n    testImplementation(kotlin(\"test-junit5\"))\n    testImplementation(platform(\"org.junit:junit-bom:6.0.3\"))\n    testRuntimeOnly(\"org.junit.jupiter:junit-jupiter-engine\")\n    testRuntimeOnly(\"org.junit.platform:junit-platform-launcher\")\n}\ntasks.test { useJUnitPlatform() }"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Sync Gradle, then run the test using its IDE gutter icon or ./gradlew test from the project folder. A passing test run must report tests executed, not “no tests found.” Temporarily change the expected profile value and verify a failure; restore the correct assertion afterward."
            }
          ]
        },
        {
          "type": "note",
          "title": "Keep the configurations distinct",
          "runs": [
            {
              "text": "The Android host project can use its existing JUnit configuration. Do not copy this standalone JVM setup into an Android module without adapting it. kotlin.test assertions work with the selected Kotlin/JUnit integration."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use one main per experiment. Keep fixtures and reusable helpers in the same package as tests, or import them. The two-argument loader on page 36 is an overload of the zero-argument loader on page 20, so both can coexist."
            }
          ]
        }
      ],
      "group": "FOUNDATIONS AND LAB SETUP",
      "referenceNumbers": [
        22,
        31
      ]
    },
    {
      "id": "coroutines-04",
      "title": "Read Kotlin syntax confidently",
      "summary": "Functions, values, types, nullability, and exceptions",
      "stage": "WEEK 1",
      "sourcePage": 4,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A function declares a name, inputs, and an output type. A block body uses return to produce its result; an expression body uses the expression after =. val prevents reassignment of the reference, while var allows it. Neither makes a referenced mutable object thread-safe."
            }
          ]
        },
        {
          "type": "code",
          "code": "fun label(id: Int): String { return \"user-$id\" }\nfun labelShort(id: Int): String = \"user-$id\"\nval profile: String = label(7)\nvar attempts = 0\nattempts += 1\nprintln(\"profile: $profile, attempts: $attempts\")"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "String interpolation evaluates $name or the expression inside ${...}. In your original println, the profile await expression is evaluated before the orders await expression. That expression order does not control when the two async computations start or fail."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Failure as control flow"
        },
        {
          "type": "code",
          "code": "fun ordersLabel(ok: Boolean): String {\n    if (!ok) throw IllegalStateException(\"Wrong orders\")\n    return \"orders\"\n}\nval message = try {\n    ordersLabel(false)\n} catch (e: IllegalStateException) {\n    \"unavailable: ${e.message}\"\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "try can be an expression. A catch handles a matching exception thrown while that call stack executes. A finally block runs when leaving the try, including during exception propagation. Throwing interrupts the current path; code after the throw is unreachable. [3]"
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "String? allows null; String does not. A nullable result can mean “absent,” but cannot by itself distinguish missing data from a network failure. Result<String> later represents success or failure explicitly. Generic types such as List<String> and Deferred<String> say what kind of value a container holds."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 1",
          "runs": [
            {
              "text": "Write a function that returns a label, then one that throws. Predict which lines execute inside try/catch/finally. Explain why catch does not undo work already completed."
            }
          ]
        }
      ],
      "group": "FOUNDATIONS AND LAB SETUP",
      "referenceNumbers": [
        3
      ]
    },
    {
      "id": "coroutines-05",
      "title": "Lambdas, receivers, and generics",
      "summary": "Why launch { ... } is valid Kotlin syntax",
      "stage": "WEEK 1",
      "sourcePage": 5,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A lambda is a function value. () -> String describes a function taking no arguments and returning String. A function accepting another function is a higher-order function. Kotlin allows a final lambda argument to appear outside parentheses. [2]"
            }
          ]
        },
        {
          "type": "code",
          "code": "fun describe(load: () -> String): String = load()\nval answer = describe { \"profile\" }\n\nclass Notebook { fun line(s: String) = println(s) }\nfun write(block: Notebook.() -> Unit) {\n    Notebook().block()\n}\nwrite {\n    line(\"Implicit receiver\")\n    this.line(\"Explicit receiver\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Notebook.() -> Unit is a lambda with a receiver. Inside it, this is a Notebook, so line resolves without an explicit object. Coroutine builders similarly provide a CoroutineScope receiver. launch and async are extension functions on that receiver."
            }
          ]
        },
        {
          "type": "code",
          "code": "fun CoroutineScope.startProfile(): Job = launch {\n    println(fetchProfile())\n}\n// Approximate block type accepted by async:\n// suspend CoroutineScope.() -> T\n// async { fetchProfile() } produces Deferred<String>."
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The extension receiver gives a function access to a scope; it does not inherit from that class or create a new scope. suspend in a lambda type permits suspension inside the lambda. T is a generic type parameter, and the compiler infers String from fetchProfile. Deferred<T> combines a lifecycle handle with a future result."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 2",
          "runs": [
            {
              "text": "Rewrite launch as this.launch inside runBlocking. Then move launch into an ordinary function with no scope receiver: observe the unresolved reference. Fix it by accepting a CoroutineScope or declaring an extension receiver. Decide who owns the passed scope."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [2] Lambdas; [1] Coroutines basics. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "FOUNDATIONS AND LAB SETUP",
      "referenceNumbers": [
        1,
        2
      ]
    },
    {
      "id": "coroutines-06",
      "title": "Threads, blocking, and concurrency",
      "summary": "Separate execution resources from the work scheduled on them",
      "stage": "WEEK 1",
      "sourcePage": 6,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A JVM thread executes instructions. Blocking occupies that thread while waiting: Thread.sleep and a synchronous file read are examples. A coroutine can suspend its work so the thread runs other work, provided the operation actually supports suspension. A coroutine still needs a thread when executing code."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Idea",
            "Meaning in the profile/orders lab"
          ],
          "rows": [
            [
              "Sequential",
              "Start and finish profile, then start orders."
            ],
            [
              "Concurrent",
              "Both tasks are in progress over overlapping intervals."
            ],
            [
              "Parallel",
              "Instructions execute simultaneously on different CPU cores."
            ],
            [
              "Blocking",
              "A waiting operation holds a thread."
            ],
            [
              "Suspending",
              "A waiting coroutine yields its thread for other work."
            ]
          ]
        },
        {
          "type": "code",
          "code": "fun main() = runBlocking {\n    launch { delay(100); println(\"A\") }\n    launch { delay(50); println(\"B\") }\n    println(\"started\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "With this inherited runBlocking event loop, the delayed work overlaps on one thread: started, B, A. Parallel CPU execution is unnecessary. Change the first delay to Thread.sleep(100): once that child runs, it prevents the same thread from running the second child until sleep returns. This alters responsiveness and timing, not just spelling."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Concurrency introduces shared-state problems"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Two coroutines on a multithreaded dispatcher can race on counter++. Suspension can also interleave read-then-write logic on a single thread. Prefer immutable results, confined ownership, atomic operations, or Mutex for coordinated mutation. Keeping a variable as val does not protect the contents of a mutable list."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 3",
          "runs": [
            {
              "text": "Draw one thread as a lane and mark when each coroutine runs or waits. Explain why two delay calls can overlap, while a single thread cannot execute two CPU instructions at the same instant."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [1] Basics; [16] Context and dispatchers. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "FOUNDATIONS AND LAB SETUP",
      "referenceNumbers": [
        1,
        16,
        30,
        32
      ]
    },
    {
      "id": "coroutines-07",
      "title": "What suspend does",
      "summary": "A function may pause; it does not automatically run elsewhere",
      "stage": "WEEK 1",
      "sourcePage": 7,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "suspend changes where a function can be called and permits suspension. It does not start a coroutine, pick a dispatcher, make the body concurrent, or convert blocking calls to nonblocking calls. A suspend function can finish without ever suspending."
            }
          ]
        },
        {
          "type": "code",
          "code": "suspend fun fetchBothSequential(): Pair<String, String> {\n    val profile = fetchProfile()\n    val orders = fetchOrders()\n    return profile to orders\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This calls profile first. About 100 ms later it starts orders, which fails after another 50 ms. No independent task was started. Sequential syntax remains sequential until a builder explicitly introduces concurrent work. [17]"
            }
          ]
        },
        {
          "type": "heading",
          "text": "A useful implementation model"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The compiler transforms suspension into resumable state: local values and the next execution position can be retained across pauses. A continuation represents what happens next. You do not need to implement this machinery to use it, but it explains why a function can resume without keeping a thread blocked throughout its delay."
            }
          ]
        },
        {
          "type": "code",
          "code": "suspend fun misleading() {\n    Thread.sleep(100)  // Still blocks the executing thread.\n}\nsuspend fun cooperative() {\n    delay(100)         // Cancellable suspending wait.\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Call suspend functions from a suspend function or a coroutine builder body. In console exercises, runBlocking bridges main to suspend code. In Android, start work in a lifecycle-owned scope. Later, withContext moves blocking work to an appropriate dispatcher."
            }
          ]
        },
        {
          "type": "note",
          "title": "Checkpoint A",
          "runs": [
            {
              "text": "Can you explain why fetchProfile() is sequential when called directly, why delay is a library function, and why suspend alone does not mean “background thread”? If not, repeat pages 3-7 before adding failure policies."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [1] Basics; [17] Composing suspending functions. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "FOUNDATIONS AND LAB SETUP",
      "referenceNumbers": [
        1,
        17
      ]
    },
    {
      "id": "coroutines-08",
      "title": "Four essential entry points",
      "summary": "Understand the result, waiting behavior, and intended use",
      "stage": "WEEK 2",
      "sourcePage": 8,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "API",
            "Returns",
            "How the caller continues"
          ],
          "rows": [
            [
              "launch",
              "Job",
              "Starts a task; caller can continue. join waits."
            ],
            [
              "async",
              "Deferred<T>",
              "Starts a computation; await waits for its value."
            ],
            [
              "runBlocking",
              "T",
              "Blocks its calling thread until its block and children finish."
            ],
            [
              "withContext",
              "T",
              "Suspends until its block and children finish; uses the supplied context."
            ]
          ]
        },
        {
          "type": "code",
          "code": "fun main() = runBlocking {\n    val job: Job = launch { println(fetchProfile()) }\n    val deferred: Deferred<String> = async { fetchProfile() }\n    println(\"children started\")\n    job.join()\n    println(deferred.await())\n    val value = withContext(Dispatchers.Default) { 2 + 3 }\n    println(value)\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "join observes completion without retrieving a result or rethrowing that Job’s failure. It can still throw cancellation if the waiting coroutine is cancelled. await retrieves the result or throws; it also respects cancellation of the waiting coroutine. A normal child failure may already cancel the waiter’s parent before either operation."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "launch is useful for UI-triggered operations when the value is delivered through state. async is useful when several concurrent values must be combined. withContext is useful for a single result computed in a different context. Use runBlocking at a blocking boundary such as these console demos; never to make Android UI code wait for a request."
            }
          ]
        },
        {
          "type": "note",
          "title": "Start behavior",
          "runs": [
            {
              "text": "The default start schedules the coroutine according to its dispatcher; it does not guarantee its first line runs before the builder returns. LAZY defers starting until start, await, or join. UNDISPATCHED and other modes are advanced tools, not fixes for exception handling."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [1] Basics; [11] async; [12] withContext; [10] Job. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "OWNERSHIP AND STRUCTURED CONCURRENCY",
      "referenceNumbers": [
        1,
        10,
        11,
        12,
        29
      ]
    },
    {
      "id": "coroutines-09",
      "title": "Decode your original program",
      "summary": "The catch surrounds starting a task, not its later execution",
      "stage": "WEEK 2",
      "sourcePage": 9,
      "blocks": [
        {
          "type": "code",
          "code": "fun main() = runBlocking {\n    try {\n        launch {\n            val profile = async { fetchProfile() }\n            val orders = async { fetchOrders() }\n            println(\"profile: ${profile.await()} \" +\n                    \"orders: ${orders.await()}\")\n        }\n    } catch (e: Exception) {\n        println(e)\n    }\n    println(\"done\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "On the default runBlocking event loop, launch schedules its child and returns a Job. The surrounding try finishes, then done prints. The runBlocking body reaches its end, but runBlocking itself cannot return while its child is still running."
            }
          ]
        },
        {
          "type": "code",
          "code": "runBlocking\n  +-- launch\n        +-- async profile: waiting for 100 ms\n        +-- async orders: throws after 50 ms\n\norders failure -> launch fails -> profile cancelled\n               -> runBlocking fails -> main throws"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Both async calls create children of launch. Orders fails with IllegalStateException, so the ordinary parent is cancelled and cancels profile. The failure propagates even though orders.await() has not run. profile.await() is interrupted by cancellation; the combined println never completes. The original cause eventually escapes runBlocking. [4, 11]"
            }
          ]
        },
        {
          "type": "note",
          "title": "What “done” actually means here",
          "runs": [
            {
              "text": "It marks the end of the runBlocking block’s immediate statements, not successful completion of the whole coroutine tree. Move a final message after runBlocking only if you want it to indicate successful completion of that call."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A catch inside launch around await alone is also not a reliable recovery boundary for normal async child failure: the parent Job may already be cancelled. Use a scoped function boundary for a failing group, or supervision plus explicit error handling for independent results."
            }
          ]
        }
      ],
      "group": "OWNERSHIP AND STRUCTURED CONCURRENCY",
      "referenceNumbers": [
        4,
        11,
        29
      ]
    },
    {
      "id": "coroutines-10",
      "title": "Scope, context, and the Job tree",
      "summary": "Three concepts that answer different questions",
      "stage": "WEEK 2",
      "sourcePage": 10,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Concept",
            "Question it answers"
          ],
          "rows": [
            [
              "CoroutineScope",
              "Where are new tasks launched, and who owns them?"
            ],
            [
              "CoroutineContext",
              "Which keyed elements govern execution?"
            ],
            [
              "Job",
              "What is this task’s lifecycle and parent relationship?"
            ],
            [
              "Dispatcher",
              "On which execution resource is work scheduled?"
            ],
            [
              "CoroutineName",
              "How can this coroutine be identified in diagnostics?"
            ]
          ]
        },
        {
          "type": "code",
          "code": "fun main() = runBlocking(CoroutineName(\"lab\")) {\n    val parent = coroutineContext[Job]\n    val child = launch(CoroutineName(\"profile\")) {\n        println(coroutineContext[Job])\n        println(coroutineContext[CoroutineName])\n    }\n    println(parent)\n    child.join()\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Context is a set of elements indexed by keys. Combining contexts with + replaces an earlier element with the same key; it does not build a Job tree by adding several Job elements. A builder creates a new child Job whose parent comes from the launching scope. Other context elements, such as the dispatcher, are normally inherited or overridden. [16]"
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Jobs move from active toward completing/completed or cancelling/cancelled. Completion includes waiting for children; cancellation includes allowing cooperative cleanup. isCompleted includes both success and failure. isCancelled does not explain the failure policy by itself. [10]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 4",
          "runs": [
            {
              "text": "Draw the tree for runBlocking -> launch -> two async children. Then remove launch and draw it again. The async children now belong directly to runBlocking. Explain why changing a dispatcher does not change the ownership relationship."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Avoid passing a fresh Job to launch or withContext to “fix” failures. It can replace the inherited parent link and break ownership. Decide the lifecycle boundary explicitly before creating a long-lived scope."
            }
          ]
        }
      ],
      "group": "OWNERSHIP AND STRUCTURED CONCURRENCY",
      "referenceNumbers": [
        10,
        16
      ]
    },
    {
      "id": "coroutines-11",
      "title": "Structured concurrency",
      "summary": "A function should finish the work it promises to own",
      "stage": "WEEK 2",
      "sourcePage": 11,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use coroutineScope for a group that should succeed or fail as one operation. It inherits execution context, adds a scoped Job, waits for all children, and rethrows failure at its call boundary. That makes ordinary try/catch useful around the whole operation. [9]"
            }
          ]
        },
        {
          "type": "code",
          "code": "suspend fun fetchAll(): Pair<String, String> = coroutineScope {\n    val profile = async { fetchProfile() }\n    val orders = async { fetchOrders() }\n    profile.await() to orders.await()\n}\nfun main() = runBlocking {\n    try {\n        println(fetchAll())\n    } catch (e: CancellationException) {\n        throw e\n    } catch (e: IllegalStateException) {\n        println(\"Loading failed: ${e.message}\")\n    }\n    println(\"done\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Orders failure cancels profile inside fetchAll. The group finishes its cleanup, then fetchAll throws to its caller. The caller handles the scoped operation’s failure and remains usable: done prints. This is different from allowing a direct async child to fail the caller’s own Job."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Ownership is a contract"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A repository suspend function should normally return only when its requested work is complete, cancelled, or failed. Launching into a newly created unrelated scope and returning early changes that contract: the caller can no longer cancel or await the work through the function call."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 5",
          "runs": [
            {
              "text": "Add finally logging to both fetch functions. Run the failing group, then catch its exception. Verify that cleanup happens before the caller’s final message. Next make orders succeed and compare sequential and concurrent timelines."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Some work intentionally outlives a screen, such as a durable background upload. Give it a named application owner or an appropriate Android background-work mechanism. Detaching a coroutine is not a durability guarantee; process death can still end it."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [9] coroutineScope; [21] Android best practices. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "OWNERSHIP AND STRUCTURED CONCURRENCY",
      "referenceNumbers": [
        9,
        21
      ]
    },
    {
      "id": "coroutines-12",
      "title": "Cancellation is cooperative",
      "summary": "A cancellation request must be observed by the running work",
      "stage": "WEEK 3",
      "sourcePage": 12,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Cancellation asks a Job to stop. Cancellable suspending operations such as delay and await observe it and throw CancellationException. A child cancelled this way does not normally fail its parent. Cancellation of a parent still travels down to children, including supervised children."
            }
          ]
        },
        {
          "type": "code",
          "code": "fun main() = runBlocking {\n    val profile = launch {\n        try {\n            println(fetchProfile())\n        } finally {\n            println(\"profile cleanup\")\n        }\n    }\n    delay(20)\n    profile.cancelAndJoin()\n    println(\"parent continues\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "cancel() requests cancellation; join() waits for termination; cancelAndJoin() combines them. After it returns, this child’s finally block has completed. Cancelling a task does not roll back database writes or other side effects that already happened."
            }
          ]
        },
        {
          "type": "heading",
          "text": "CPU loops need cancellation checks"
        },
        {
          "type": "code",
          "code": "suspend fun checksum(bytes: ByteArray): Long =\n    withContext(Dispatchers.Default) {\n        var total = 0L\n        for (i in bytes.indices) {\n            if (i % 4096 == 0) ensureActive()\n            total += bytes[i].toLong()\n        }\n        total\n    }"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "ensureActive throws when the current Job is cancelled. yield also gives other work a scheduling opportunity. A busy loop with neither checks nor suspension can delay cancellation indefinitely. Blocking code may need API-specific cancellation or runInterruptible when interruption is supported. [5, 6]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 6",
          "runs": [
            {
              "text": "Cancel profile after 20 ms and confirm that “profile” is absent but cleanup runs. For a CPU loop, compare cancellation with and without periodic ensureActive. Explain why putting a loop on Default does not itself make it cooperative."
            }
          ]
        }
      ],
      "group": "CANCELLATION AND FAILURE",
      "referenceNumbers": [
        5,
        6
      ]
    },
    {
      "id": "coroutines-13",
      "title": "Cleanup and deadlines",
      "summary": "Make stopping safe without turning cancellation into a failure",
      "stage": "WEEK 3",
      "sourcePage": 13,
      "blocks": [
        {
          "type": "code",
          "code": "suspend fun profileBeforeDeadline(): String? =\n    withTimeoutOrNull(80) {\n        fetchProfile()\n    }"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The deadline is shorter than the fixture’s 100 ms delay, so this returns null. withTimeout instead throws TimeoutCancellationException. withTimeoutOrNull converts its own timeout into null; an outer cancellation still propagates. A timeout is cooperative, not a forced termination of arbitrary blocking code. [7]"
            }
          ]
        },
        {
          "type": "heading",
          "text": "Release resources in finally"
        },
        {
          "type": "code",
          "code": "suspend fun workWithCleanup() {\n    try {\n        delay(1_000)\n    } finally {\n        // Most cleanup should be immediate and non-suspending.\n        withContext(NonCancellable) {\n            delay(10) // Simulated bounded suspending cleanup.\n            println(\"released\")\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "finally executes during cancellation. Its normal suspending calls may immediately throw because the Job is cancelled. A small NonCancellable block allows necessary suspending cleanup to finish. Keep it bounded: a never-ending cleanup prevents the owning scope from finishing. Do not wrap normal fetching or long retries in NonCancellable."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "When handling ordinary failures, catch CancellationException first and rethrow it. Broad catch(Exception) also matches cancellation; swallowing it can let cancelled work continue through non-suspending code and publish misleading results."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 7",
          "runs": [
            {
              "text": "Change the deadline to 150 ms and predict the value. Then cancel the outer caller while the deadline block runs. Confirm that outer cancellation is not reported as an orders error. Add a cleanup delay and explain when NonCancellable is necessary."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Close resources within the operation that owns them, using use or try/finally. Cancellation can race with returning a resource across a dispatcher or timeout boundary. Avoid assuming a closeable resource assigned outside a timed block will always be available for cleanup."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [7] withTimeout; [12] withContext; [21] Best practices. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "CANCELLATION AND FAILURE",
      "referenceNumbers": [
        7,
        12,
        21
      ]
    },
    {
      "id": "coroutines-14",
      "title": "Exception propagation",
      "summary": "Failure policy and error observation are separate mechanisms",
      "stage": "WEEK 3",
      "sourcePage": 14,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Case",
            "What to expect"
          ],
          "rows": [
            [
              "Normal child launch fails",
              "Parent fails and cancels siblings; error travels upward."
            ],
            [
              "Normal child async fails",
              "Deferred stores the error AND parent fails; await is not required for parent cancellation."
            ],
            [
              "Supervised async fails",
              "Siblings survive; await exposes the stored error."
            ],
            [
              "Supervised launch fails",
              "Siblings survive; unhandled exception still needs reporting or local handling."
            ],
            [
              "Child cancelled",
              "CancellationException normally does not fail its parent."
            ]
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "CoroutineExceptionHandler reports an uncaught exception after the coroutine has failed. It cannot restart that coroutine or return a fallback value. Normal children delegate failure to their parent; putting a handler on each child does not change the parent’s failure policy. async exposes errors through Deferred instead of invoking its own handler. [4]"
            }
          ]
        },
        {
          "type": "code",
          "code": "val handler = CoroutineExceptionHandler { _, error ->\n    println(\"Uncaught: ${error.message}\")\n}\n// Inside a runBlocking body:\nsupervisorScope {\n    val child = launch(handler) {\n        throw IllegalStateException(\"Wrong orders\")\n    }\n    child.join() // Waits; does not retrieve/rethrow child failure.\n    println(\"supervisor continues\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use try/catch inside an operation when it can recover. Use a handler as last-resort reporting for suitable launch roots or supervised launch children. Use await and explicit handling for supervised async results. Supervision and exception reporting solve different problems."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 8",
          "runs": [
            {
              "text": "Predict whether a handler runs for supervised launch and supervised async. For async, add a caught await. For normal async, draw the upward cancellation path even if await is never called. Avoid using GlobalScope to hide the hierarchy."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [4] Exceptions; [8] supervisorScope; [11] async. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "CANCELLATION AND FAILURE",
      "referenceNumbers": [
        4,
        8,
        11
      ]
    },
    {
      "id": "coroutines-15",
      "title": "coroutineScope vs supervisorScope",
      "summary": "Choose whether a sibling’s success remains useful after a failure",
      "stage": "WEEK 3",
      "sourcePage": 15,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use coroutineScope when all results are required. Use supervisorScope when independent child failures should not cancel siblings. Both functions wait for children, both remain attached to the caller, and caller cancellation cancels the whole group. [8, 9]"
            }
          ]
        },
        {
          "type": "code",
          "code": "fun main() = runBlocking {\n    supervisorScope {\n        val profile = async { fetchProfile() }\n        val orders = async { fetchOrders() }\n        println(\"profile: ${profile.await()}\")\n        try {\n            println(\"orders: ${orders.await()}\")\n        } catch (e: CancellationException) {\n            throw e\n        } catch (e: IllegalStateException) {\n            println(\"orders unavailable: ${e.message}\")\n        }\n    }\n    println(\"done\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Expected output: profile: profile; orders unavailable: Wrong orders; done. Orders fails earlier, but its Deferred does not fail the supervisor. Profile finishes, then the stored orders failure is handled at await."
            }
          ]
        },
        {
          "type": "code",
          "code": "caller\n  +-- supervisorScope\n        +-- profile async  -> completes\n        +-- orders async   -> fails (observed at await)\n\ncaller cancellation -> supervisor -> both children stop"
        },
        {
          "type": "note",
          "title": "The escaping-await trap",
          "runs": [
            {
              "text": "If orders.await() runs first and its error is not caught inside the supervisor block, the block itself throws. That fails the supervisor block and cancels its remaining children, including profile. Catching outside supervisorScope happens after that cancellation; it cannot preserve the unfinished child."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "If profile can fail too, handle it independently. On page 20, both children produce explicit Result values. The requirement is a successful partial result, not merely “no crash.”"
            }
          ]
        }
      ],
      "group": "CANCELLATION AND FAILURE",
      "referenceNumbers": [
        4,
        8,
        9
      ]
    },
    {
      "id": "coroutines-16",
      "title": "Job vs SupervisorJob",
      "summary": "Scope functions are lexical; job objects need an owner",
      "stage": "WEEK 3",
      "sourcePage": 16,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Job() creates an ordinary lifecycle parent. A non-cancellation child failure fails it and cancels siblings. SupervisorJob() keeps direct children independent. Neither object supplies a dispatcher nor executes a block by itself. Build an owned CoroutineScope around it when a component needs a longer lifetime. [10, 13]"
            }
          ]
        },
        {
          "type": "code",
          "code": "class ProfileWorker : AutoCloseable {\n    private val owner = SupervisorJob()\n    private val scope = CoroutineScope(\n        owner + Dispatchers.Default + CoroutineName(\"worker\")\n    )\n    fun refresh(): Job = scope.launch {\n        try {\n            println(fetchProfile())\n        } catch (e: CancellationException) {\n            throw e\n        } catch (e: Exception) {\n            println(\"Refresh failed: ${e.message}\")\n        }\n    }\n    override fun close() { owner.cancel() }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This illustrative component cancels its owned tasks when closed. close requests cancellation; it does not wait for cleanup. An owner requiring completed shutdown should expose a suspend stop method that cancels and joins. Android components usually use provided scopes instead of building another one."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Supervision applies at one parent-child edge"
        },
        {
          "type": "code",
          "code": "SupervisorJob\n  +-- launch A (ordinary coroutine Job)\n  |     +-- async profile\n  |     +-- async orders\n  +-- launch B"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Orders failure still cancels profile because both are children of ordinary launch A. The supervisor protects B from A’s failure; it does not automatically supervise grandchildren. Put supervisorScope inside A to make profile and orders independent there."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 9",
          "runs": [
            {
              "text": "Compare the tree above with two async calls launched directly in the supervisor scope. Explain why launch(SupervisorJob()) is a poor shortcut: it replaces ownership and the launch still has ordinary child-failure behavior."
            }
          ]
        }
      ],
      "group": "CANCELLATION AND FAILURE",
      "referenceNumbers": [
        10,
        13,
        29
      ]
    },
    {
      "id": "coroutines-17",
      "title": "Dispatchers and main safety",
      "summary": "Move work according to what it does",
      "stage": "WEEK 3",
      "sourcePage": 17,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Dispatcher",
            "Use"
          ],
          "rows": [
            [
              "Main",
              "Android UI interaction and lightweight coordination."
            ],
            [
              "Default",
              "CPU-heavy parsing, sorting, image or data processing."
            ],
            [
              "IO",
              "Blocking file, socket, database, or other I/O calls."
            ],
            [
              "Unconfined",
              "Advanced execution behavior; not a default UI/background strategy."
            ]
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A dispatcher controls scheduling, not success policy. Suspend APIs that already avoid blocking may not need an IO wrapper. Synchronous calls still block even inside a suspend function. Put dispatcher decisions in the class performing the blocking or CPU work so callers can safely invoke it from Main. Inject dispatchers for tests. [16, 21]"
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.File\n\nclass TextRepository(\n    private val io: CoroutineDispatcher = Dispatchers.IO\n) {\n    suspend fun read(file: File): String = withContext(io) {\n        file.readText() // Synchronous blocking I/O.\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The caller suspends while read executes on IO, then resumes in its original context. withContext does not guarantee a thread switch when the requested dispatcher is already the current one. It also does not make File.readText instantly cancellable midway through the call."
            }
          ]
        },
        {
          "type": "code",
          "code": "suspend fun pauseBlockingLibrary(): Unit =\n    runInterruptible(Dispatchers.IO) {\n        Thread.sleep(100) // This API supports interruption.\n    }"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use runInterruptible for blocking JVM APIs that honor thread interruption. For APIs that do not, use their cancellation mechanisms or accept the bounded blocking behavior. Do not infer interruptibility merely from withContext(IO). [6]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 10",
          "runs": [
            {
              "text": "Log thread names before, inside, and after withContext. Treat names as diagnostics rather than fixed assertions. Identify which operations in your real repository are blocking, CPU-heavy, or already suspending."
            }
          ]
        }
      ],
      "group": "DISPATCHERS AND RESULT POLICIES",
      "referenceNumbers": [
        6,
        12,
        16,
        21
      ]
    },
    {
      "id": "coroutines-18",
      "title": "async vs withContext",
      "summary": "Start concurrent values only when concurrency is useful",
      "stage": "WEEK 3",
      "sourcePage": 18,
      "blocks": [
        {
          "type": "code",
          "code": "suspend fun sequentialValues(): Pair<String, String> {\n    val p = withContext(Dispatchers.Default) { fetchProfile() }\n    val o = withContext(Dispatchers.Default) {\n        delay(50)\n        \"orders\"\n    }\n    return p to o\n}\nsuspend fun concurrentValues(): Pair<String, String> =\n    coroutineScope {\n        val p = async { fetchProfile() }\n        val o = async { delay(50); \"orders\" }\n        p.await() to o.await()\n    }"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The first function starts its orders work after profile completes: about 150 ms of simulated waiting. The second starts both before awaiting: about 100 ms. Awaiting p then o does not make those computations sequential; both were already started. [17]"
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "withContext expresses “do this work in this context and return its result.” async expresses “start this child computation and give me a handle to a future value.” async(IO) followed immediately by await is usually less direct than withContext(IO) when there is no useful overlapping work."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Need",
            "Choose"
          ],
          "rows": [
            [
              "One result, move CPU or blocking work",
              "withContext with an appropriate dispatcher"
            ],
            [
              "Two required independent computations",
              "coroutineScope + async for both, then await"
            ],
            [
              "Two useful independent partial results",
              "supervisorScope + explicit per-result error policy"
            ],
            [
              "Operation triggered by a UI action",
              "launch in the owning UI/ViewModel scope"
            ]
          ]
        },
        {
          "type": "note",
          "title": "Exercise 11",
          "runs": [
            {
              "text": "First use successful orders so timing is understandable. Then restore its failure. Explain why replacing coroutineScope with supervisorScope changes failure isolation but does not fix an exception escaping the block."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Concurrency has costs: more requests in flight, more lifecycle edges, and more complicated error handling. Use it when overlap benefits the operation, not because every suspend call needs its own async."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [11] async; [12] withContext; [17] Composition. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "DISPATCHERS AND RESULT POLICIES",
      "referenceNumbers": [
        11,
        12,
        17
      ]
    },
    {
      "id": "coroutines-19",
      "title": "Model errors intentionally",
      "summary": "Preserve successful values without erasing failure details",
      "stage": "WEEK 3",
      "sourcePage": 19,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A nullable orders value cannot tell you whether the user has no orders or the request failed. Result<T> carries a value or a Throwable. A sealed domain type can instead distinguish success, offline, unauthorized, or unavailable. Select a model that lets the UI make the required decision."
            }
          ]
        },
        {
          "type": "code",
          "code": "suspend fun <T> attempt(\n    block: suspend () -> T\n): Result<T> = try {\n    Result.success(block())\n} catch (e: CancellationException) {\n    throw e\n} catch (e: Exception) {\n    Result.failure(e)\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This helper is a teaching boundary for recoverable Exception failures. Cancellation is rethrown and serious Error subclasses are not swallowed. In production, narrow expected failures when possible; a programming defect should not automatically become an ordinary “offline” UI state. [21, 24]"
            }
          ]
        },
        {
          "type": "code",
          "code": "sealed interface OrdersOutcome {\n    data class Ready(val value: String) : OrdersOutcome\n    data object Unavailable : OrdersOutcome\n}\n// Map expected transport/service failures at the data boundary.\n// Keep diagnostic causes in Result or logging when needed."
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "runCatching catches every Throwable, including CancellationException. It is convenient for synchronous computations, but using it unmodified around suspend work can turn cancellation into a normal Result.failure. It does not create supervision or repair an already cancelled Job. [24]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 12",
          "runs": [
            {
              "text": "Represent an empty successful orders list separately from a failed request. Add a retryable flag or domain error only if the caller uses it. Cancel attempt { fetchProfile() } and verify that cancellation escapes instead of returning a failure result."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A child that catches and converts an expected failure before it escapes can finish normally, even under coroutineScope. Supervision is most useful when child failure itself is allowed. Neither policy should consume the caller’s cancellation."
            }
          ]
        }
      ],
      "group": "DISPATCHERS AND RESULT POLICIES",
      "referenceNumbers": [
        21,
        24
      ]
    },
    {
      "id": "coroutines-20",
      "title": "Complete partial-success loader",
      "summary": "The profile survives an orders failure, with both outcomes retained",
      "stage": "WEEK 3",
      "sourcePage": 20,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This complete main uses the fixtures on page 3 and attempt on page 19. Both children start before either await. Expected exceptions are modeled inside each computation, and the supervisor documents the independence of the two requests."
            }
          ]
        },
        {
          "type": "code",
          "code": "data class Dashboard(\n    val profile: Result<String>,\n    val orders: Result<String>\n)\n\nsuspend fun loadDashboard(): Dashboard = supervisorScope {\n    val profile = async { attempt { fetchProfile() } }\n    val orders = async { attempt { fetchOrders() } }\n    Dashboard(profile.await(), orders.await())\n}\n\nfun main() = runBlocking {\n    val result = loadDashboard()\n    println(\"profile: ${result.profile.getOrNull()}\")\n    result.orders.fold(\n        onSuccess = { println(\"orders: $it\") },\n        onFailure = {\n            println(\"orders unavailable: ${it.message}\")\n        }\n    )\n    println(\"done\")\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Expected output is profile: profile, orders unavailable: Wrong orders, then done. For these expected exceptions, attempt prevents failed child Jobs by turning failures into values. That means coroutineScope would also work in this particular implementation. supervisorScope additionally protects sibling work from an unmodeled child failure until that failure is observed or escapes the block."
            }
          ]
        },
        {
          "type": "note",
          "title": "Policy boundaries matter",
          "runs": [
            {
              "text": "If an unexpected exception escapes a child and later its await escapes the supervisor block, the operation fails and remaining children stop. Result modeling is not a promise to survive every possible defect. The owner can always cancel both requests."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Exercise 13: make the policy observable"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Run four cases: both succeed, only orders fails, only profile fails, both fail. For each, inspect both Results. Add a fifth case that cancels the caller at 20 ms; neither result should be rendered as ordinary success or failure. Keep the public function attached to the caller."
            }
          ]
        }
      ],
      "group": "DISPATCHERS AND RESULT POLICIES",
      "referenceNumbers": [
        8,
        21,
        24
      ]
    },
    {
      "id": "coroutines-21",
      "title": "Flow: a sequence over time",
      "summary": "Use a stream when one final return value is not enough",
      "stage": "WEEK 4",
      "sourcePage": 21,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A suspend function returns one result. Flow<T> can emit several values over time. The flow { } builder creates a cold stream: constructing it does not execute the producer; collecting it does. Each new collection runs that producer again. Some Flow implementations are hot; “Flow” alone does not imply cold. [18]"
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.flow.*\n\nfun profileUpdates(): Flow<String> = flow {\n    emit(\"loading\")\n    emit(fetchProfile())\n}\nfun main() = runBlocking {\n    val updates = profileUpdates() // No request yet.\n    updates.collect { println(\"first: $it\") }\n    updates.collect { println(\"second: $it\") }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Each collection prints loading then profile; fetchProfile runs twice. collect is a terminal suspending operation. Intermediate operators such as map build a pipeline without running it. A basic flow pipeline processes upstream and downstream sequentially in the collector’s coroutine unless an operator introduces a boundary."
            }
          ]
        },
        {
          "type": "code",
          "code": "fun normalizedProfiles(): Flow<String> =\n    profileUpdates()\n        .filter { it != \"loading\" }\n        .map { it.uppercase() }"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Cancelling the collecting coroutine stops this suspending producer. emit in flow is cancellation-aware. A CPU-heavy producer still needs cooperative work. Do not emit from a different dispatcher using withContext inside flow; use flowOn for upstream context, or a suitable builder such as channelFlow for concurrent producers."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 14",
          "runs": [
            {
              "text": "Add a “fetch started” log. Create the Flow without collecting and count logs; then collect twice. Predict the number of requests. Decide whether your UI needs a fresh request for each subscriber or a shared source."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [18] flow builder; [19] flowOn. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "STREAMS AND STATE",
      "referenceNumbers": [
        18,
        19
      ]
    },
    {
      "id": "coroutines-22",
      "title": "Flow operators and errors",
      "summary": "Place transformations and recovery at deliberate boundaries",
      "stage": "WEEK 4",
      "sourcePage": 22,
      "blocks": [
        {
          "type": "code",
          "code": "fun profileStream(): Flow<Result<String>> = flow {\n    emit(Result.success(fetchProfile()))\n}.catch { e ->\n    if (e is CancellationException) throw e\n    emit(Result.failure(e))\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "catch handles exceptions in the upstream pipeline. It does not handle exceptions thrown by the downstream collector or cancellation used to stop the stream. Moving catch changes which work it protects. Put UI rendering failures where they can be diagnosed instead of pretending they are network failures. [20]"
            }
          ]
        },
        {
          "type": "code",
          "code": "fun labels(): Flow<String> = flow {\n    emit(fetchProfile())\n}.map { it.uppercase() }\n .flowOn(Dispatchers.Default)"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "flowOn changes upstream execution context and leaves downstream collection in the caller’s context. Do not put a Job into flowOn’s context. Cross-dispatcher boundaries can buffer values; cancellation may mean an in-flight value is never delivered. [19]"
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Operator",
            "Practical meaning"
          ],
          "rows": [
            [
              "buffer",
              "Lets producer and consumer overlap with a queue."
            ],
            [
              "conflate",
              "A slow consumer can skip intermediate values and see newer ones."
            ],
            [
              "collectLatest",
              "A new value cancels the previous collector action."
            ],
            [
              "combine",
              "After all sources emit, uses their latest values on updates."
            ],
            [
              "zip",
              "Pairs corresponding emissions from two sources."
            ],
            [
              "retry / retryWhen",
              "Recollect upstream on selected failures; use bounds and backoff."
            ]
          ]
        },
        {
          "type": "note",
          "title": "Exercise 15",
          "runs": [
            {
              "text": "Emit versions every 20 ms while rendering takes 80 ms. Compare collect, conflate, and collectLatest. Do not assert every intermediate value is seen in the latter two. For combine, delay the first orders emission and predict when a combined dashboard becomes available."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Retries restart upstream and can repeat side effects. Use bounded retries for transient failures and check idempotency. Model partial errors before combining sources if one failure must not terminate the dashboard. Operator reading: [27]."
            }
          ]
        }
      ],
      "group": "STREAMS AND STATE",
      "referenceNumbers": [
        19,
        20,
        27
      ]
    },
    {
      "id": "coroutines-23",
      "title": "StateFlow: the current state",
      "summary": "A hot, observable value with an initial state",
      "stage": "WEEK 4",
      "sourcePage": 23,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "StateFlow always has a value and immediately gives a new collector its current state. It suppresses equal updates using equality and conflates changes: slow collectors may miss intermediate states. It does not complete normally or encode failure automatically. Represent loading and errors in your state type. [14]"
            }
          ]
        },
        {
          "type": "code",
          "code": "data class ScreenState(\n    val loading: Boolean = false,\n    val profile: String? = null,\n    val orders: String? = null,\n    val ordersError: String? = null,\n    val profileError: String? = null,\n    val generalError: String? = null\n)\nval mutableState = MutableStateFlow(ScreenState())\nval state: StateFlow<ScreenState> = mutableState.asStateFlow()\n\nfun showLoading() {\n    mutableState.update { it.copy(loading = true) }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Expose the read-only StateFlow and keep mutation private. update performs an atomic transformation; its lambda may be evaluated more than once under contention, so avoid side effects inside it. Use immutable copies rather than mutating a list already stored in the state, which can hide a meaningful change behind equality."
            }
          ]
        },
        {
          "type": "code",
          "code": "// Inside a lifecycle-owned component with a scope:\nval sharedProfiles: StateFlow<String> = profileUpdates().stateIn(\n    scope = scope,\n    started = SharingStarted.WhileSubscribed(5_000),\n    initialValue = \"loading\"\n)"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "stateIn shares a cold upstream as state. The scope owns that sharing coroutine. WhileSubscribed starts upstream when subscribers appear and can stop it after the timeout. The timeout is a deliberate lifecycle policy, not a universal constant. Handle upstream failures before stateIn if the UI should receive an error state. [15]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 16",
          "runs": [
            {
              "text": "Set the same state twice and observe equality suppression. Publish several states quickly and explain why a slow collector is allowed to skip some. Test the final state value when your requirement is current UI state, rather than forcing every intermediate emission."
            }
          ]
        }
      ],
      "group": "STREAMS AND STATE",
      "referenceNumbers": [
        14,
        15,
        28
      ]
    },
    {
      "id": "coroutines-24",
      "title": "SharedFlow: broadcast values",
      "summary": "Configure replay and buffering around delivery requirements",
      "stage": "WEEK 4",
      "sourcePage": 24,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "SharedFlow broadcasts to active collectors and can replay recent values to new collectors. It has no required initial value. It never completes normally, so collectors usually need cancellation or operators such as take. Replay, buffer capacity, and overflow policy determine what can be retained or dropped. [23]"
            }
          ]
        },
        {
          "type": "code",
          "code": "sealed interface UiEvent {\n    data class Message(val text: String) : UiEvent\n}\nprivate val mutableEvents = MutableSharedFlow<UiEvent>(\n    replay = 0,\n    extraBufferCapacity = 1\n)\nval events: SharedFlow<UiEvent> = mutableEvents.asSharedFlow()\n\nsuspend fun notifyOrdersUnavailable() {\n    mutableEvents.emit(UiEvent.Message(\"Orders unavailable\"))\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This is an ephemeral notification policy. With replay = 0, an event emitted when there are no subscribers is not kept for a future subscriber; extraBufferCapacity does not provide offline storage. tryEmit returning true is not proof that a UI collector received the event. With replay > 0, a recreated collector may receive an old event again."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Type",
            "Best fit",
            "Important limit"
          ],
          "rows": [
            [
              "Cold Flow",
              "A request or computation per collection",
              "Two collectors may repeat the work."
            ],
            [
              "StateFlow",
              "The latest durable-in-memory UI state",
              "Intermediate values may be skipped."
            ],
            [
              "SharedFlow",
              "Broadcast updates or ephemeral signals",
              "Delivery depends on subscribers and configuration."
            ]
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "If a payment result or essential navigation decision must survive a collector absence, store a pending state or durable record with acknowledgment rather than assuming a broadcast gives exactly-once delivery. None of these types survives process death by itself."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 17",
          "runs": [
            {
              "text": "Emit one event before subscribing and one after. Repeat with replay = 1. Explain both outcomes and choose a policy for an optional snackbar versus an essential confirmation. Cancel your collectors when the exercise ends."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": true,
          "runs": [
            {
              "text": "Official reading: [23] SharedFlow; [15] Android state and sharing. Sources are linked on pages 41-42."
            }
          ]
        }
      ],
      "group": "STREAMS AND STATE",
      "referenceNumbers": [
        15,
        23
      ]
    },
    {
      "id": "coroutines-25",
      "title": "Android: a ViewModel owns loading",
      "summary": "Expose state; keep the request attached to the screen model",
      "stage": "WEEK 4",
      "sourcePage": 25,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "viewModelScope is cancelled when its ViewModel is cleared. Its top-level children are supervised, but children inside one launch still have that launch as an ordinary parent. Our loadDashboard function supplies the independent-request policy within that launch. [25]"
            }
          ]
        },
        {
          "type": "code",
          "code": "import androidx.lifecycle.ViewModel\nimport androidx.lifecycle.viewModelScope\nimport kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\nclass DashboardViewModel : ViewModel() {\n    private val mutableState = MutableStateFlow(ScreenState())\n    val state = mutableState.asStateFlow()\n    private var refreshJob: Job? = null\n    fun refresh() { // Call from the UI/Main thread.\n        refreshJob?.cancel() // Latest refresh wins.\n        refreshJob = viewModelScope.launch {\n            mutableState.update { it.copy(loading = true) }\n            try {\n                val result = loadDashboard()\n                mutableState.value = ScreenState(\n                    profile = result.profile.getOrNull(),\n                    orders = result.orders.getOrNull(),\n                    ordersError = result.orders.exceptionOrNull()\n                        ?.message,\n                    profileError = result.profile.exceptionOrNull()\n                        ?.message\n                )\n            } catch (e: CancellationException) {\n                throw e\n            } catch (e: Exception) {\n                mutableState.update {\n                    it.copy(loading = false, generalError = e.message)\n                }\n            }\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This uses ScreenState (23) and loadDashboard (20). Cancellation prevents publishing a cancelled result. Repository calls must be main-safe; viewModelScope does not move blocking code off Main. For production, map diagnostic exception messages to stable user-facing text."
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 18",
          "runs": [
            {
              "text": "Inject a repository instead of top-level fixtures. Trigger refresh twice and verify only the newest result is published. Add a deliberate policy for retaining stale profile data during a failed refresh."
            }
          ]
        }
      ],
      "group": "ANDROID LIFETIME",
      "referenceNumbers": [
        21,
        25,
        28,
        29
      ]
    },
    {
      "id": "coroutines-26",
      "title": "Android: collect with the lifecycle",
      "summary": "Ownership of loading and ownership of rendering are different",
      "stage": "WEEK 4",
      "sourcePage": 26,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A Fragment’s view can be destroyed while the Fragment object remains. Collect using viewLifecycleOwner so rendering stops with the view. repeatOnLifecycle starts its block at STARTED, cancels it below STARTED, and restarts it on reentry. It does not automatically cancel separate ViewModel requests. [25]"
            }
          ]
        },
        {
          "type": "code",
          "code": "import androidx.lifecycle.Lifecycle\nimport androidx.lifecycle.lifecycleScope\nimport androidx.lifecycle.repeatOnLifecycle\n\n// Inside Fragment.onViewCreated; viewModel and render exist.\nviewLifecycleOwner.lifecycleScope.launch {\n    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {\n        viewModel.state.collect { state -> render(state) }\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "For two endless flows, collect each in a child launch within repeatOnLifecycle. Sequential collect calls never reach the second call while the first stream is still active. If either collector fails, the ordinary repeat block’s children fail as a group unless you intentionally add a different policy."
            }
          ]
        },
        {
          "type": "code",
          "code": "import androidx.compose.runtime.getValue\nimport androidx.lifecycle.compose.collectAsStateWithLifecycle\n\n// Inside a @Composable screen:\nval state by viewModel.state.collectAsStateWithLifecycle()\n// Render widgets from state."
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Compose collection turns StateFlow into lifecycle-aware Compose state. Keep rendering cheap and move requests to explicit ViewModel actions or properly keyed effects. Recomposition alone should not start a fresh network request."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Project dependencies"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Use matching, compatible AndroidX Lifecycle artifacts: lifecycle-viewmodel-ktx and lifecycle-runtime-ktx for the ViewModel/Fragment examples, and lifecycle-runtime-compose for Compose collection. Add kotlinx-coroutines-android matching your core version to provide Main dispatching. Use your project’s version catalog and current Android documentation for AndroidX versions. [15, 25]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 19",
          "runs": [
            {
              "text": "Navigate away and back; rotate the device; then remove the screen. Log collection starts/stops and request starts/stops separately. Explain which lifecycle owns each. For persistent work across process death, study WorkManager rather than relying on a coroutine scope."
            }
          ]
        }
      ],
      "group": "ANDROID LIFETIME",
      "referenceNumbers": [
        15,
        25
      ]
    },
    {
      "id": "coroutines-27",
      "title": "Coroutine tests: virtual time",
      "summary": "Control scheduling instead of sleeping and hoping",
      "stage": "WEEK 5",
      "sourcePage": 27,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "runTest supplies a TestScope and scheduler, skips delays on test dispatchers, and reports uncaught child failures. A StandardTestDispatcher queues work; runCurrent runs ready work, advanceTimeBy moves the virtual clock, and advanceUntilIdle drains scheduled work. Share one scheduler across test dispatchers. [22, 26]"
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.*\nimport kotlinx.coroutines.test.*\nimport kotlin.test.*\n\n@OptIn(ExperimentalCoroutinesApi::class)\nclass ProfileTest {\n    @Test fun profileUsesVirtualTime() = runTest {\n        val profile = async { fetchProfile() }\n        runCurrent() // Starts the async body at virtual t = 0.\n        assertFalse(profile.isCompleted)\n        advanceTimeBy(100)\n        runCurrent() // Executes tasks scheduled exactly at t = 100.\n        assertEquals(\"profile\", profile.await())\n        assertEquals(100L, testScheduler.currentTime)\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The test verifies the fixture’s result and timing contract without waiting 100 real milliseconds. Tasks exactly at the target time may require runCurrent after advanceTimeBy. For outcome tests, prefer advanceUntilIdle or directly awaiting when exact timing is not part of the requirement."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Make dispatchers controllable"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Inject a TestDispatcher into repositories rather than hard-coding IO or Default. Delays on real dispatchers do not use this virtual clock. For ViewModel JVM tests, replace Dispatchers.Main with a test dispatcher before creating the ViewModel, and reset Main afterward, usually with a reusable test rule. [26]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 20",
          "runs": [
            {
              "text": "Change the fixture delay to 120 ms and update only a test that deliberately checks that timing. Write another test that cares only about the returned profile. Explain why a thread name assertion is less robust than a result assertion."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "For endlessly running test collectors, launch in backgroundScope so runTest can cancel them at the end, or explicitly cancelAndJoin them. An infinite loop can prevent advanceUntilIdle from reaching idle."
            }
          ]
        }
      ],
      "group": "COROUTINE TESTING",
      "referenceNumbers": [
        22,
        26
      ]
    },
    {
      "id": "coroutines-28",
      "title": "Test the failure policy",
      "summary": "Verify partial success, grouped failure, and caller cancellation",
      "stage": "WEEK 5",
      "sourcePage": 28,
      "blocks": [
        {
          "type": "code",
          "code": "@OptIn(ExperimentalCoroutinesApi::class)\nclass DashboardTest {\n    @Test fun ordersFailureKeepsProfile() = runTest {\n        val dashboard = loadDashboard()\n        assertEquals(\"profile\", dashboard.profile.getOrThrow())\n        assertIs<IllegalStateException>(\n            dashboard.orders.exceptionOrNull()\n        )\n    }\n    @Test fun cancellationIsNotAResultFailure() = runTest {\n        var returned = false\n        var cleaned = false\n        val job = launch {\n            try {\n                loadDashboard()\n                returned = true\n            } finally {\n                cleaned = true\n            }\n        }\n        runCurrent()\n        advanceTimeBy(20)\n        job.cancelAndJoin()\n        assertFalse(returned)\n        assertTrue(cleaned)\n        assertTrue(job.isCancelled)\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "These tests use the imports on page 27. The first proves the desired partial-success behavior. The second proves cancellation escapes the loader and cleanup finishes; it does not merely assert that an Exception was recorded."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Test state and streams by their contracts"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "For a finite cold Flow, collect with toList and assert the ordered sequence. For StateFlow, assert the latest value when that is the requirement; conflation means every rapid intermediate update need not appear. When testing stateIn with WhileSubscribed, start an active collector or upstream will not run. For SharedFlow replay = 0, arrange for a collector to start before emission. [14, 15, 26]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Exercise 21",
          "runs": [
            {
              "text": "Add an all-or-nothing test for fetchAll. Track a finally flag in profile and assert cleanup after orders fails. Then make orders succeed and verify both values. Extend the cancellation test to the CPU checksum and to a lifecycle-owned refresh."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Verify policy and lifetime with controlled dispatchers. Avoid real sleeps and wall-clock assertions. Check Android navigation and configuration changes on a device or emulator too."
            }
          ]
        }
      ],
      "group": "COROUTINE TESTING",
      "referenceNumbers": [
        14,
        15,
        22,
        26
      ]
    },
    {
      "id": "coroutines-32",
      "title": "Progressive labs",
      "summary": "Use a small controlled change to expose each rule",
      "stage": "PRACTICE",
      "sourcePage": 32,
      "blocks": [
        {
          "type": "heading",
          "text": "Lab A / execution and ownership"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "1. Use successful profile (100 ms) and successful orders (50 ms). Implement sequential calls, then two async calls started before awaiting. Predict approximately 150 ms vs 100 ms. Explain overlap without assuming two threads."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "2. Restore failing orders. Run the original launch program. Predict done before the failure, no completed profile print, and IllegalStateException escaping runBlocking. Remove launch and redraw the tree. Failure still reaches the ordinary parent."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "3. Wrap the group in fetchAll using coroutineScope. Catch the call’s failure in its caller. Confirm profile cancellation and caller continuation. Add finally flags rather than relying only on console timestamps."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Lab B / independent results and cancellation"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "1. Use supervisorScope with two async calls. Await orders first without a local catch. Predict profile cancellation because the supervisor block throws. Now handle the orders exception inside that block and prove profile finishes."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "2. Use attempt and loadDashboard. Execute the four success/failure combinations. Preserve the original exception causes in the Results. Cancel the caller at 20 ms and assert that the loader does not return a Dashboard."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "3. Introduce a nested launch inside a supervisor and place both async calls inside that launch. Predict profile cancellation on an unhandled orders error. Move supervision to their direct parent and retest."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Lab C / streams and Android lifetime"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "1. Collect profileUpdates twice and count request starts. Convert a cold source to stateIn using a named owner and an explicit sharing policy. Observe whether subscriber absence stops or restarts upstream."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "2. Emit a SharedFlow event with no collector. Show the difference between replay = 0 and replay = 1. Choose which events can be lost and which must be state or durable records."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "3. Build the Android dashboard. Rotate, background/foreground, and navigate away. Log the ViewModel lifetime, request lifetime, and view collection lifetime separately. Add virtual-time tests for the loader and refresh policy."
            }
          ]
        },
        {
          "type": "note",
          "title": "Stretch experiment",
          "runs": [
            {
              "text": "Make profile take 50 ms and orders fail at 100 ms. Under ordinary structured concurrency, profile may finish before failure; the group still fails. A completed side effect is not rolled back. Explain how this differs from the original 100/50 ms fixtures."
            }
          ]
        }
      ],
      "group": "PRACTICE AND WORKED SOLUTIONS",
      "referenceNumbers": [
        4,
        8,
        9,
        22,
        25,
        27
      ]
    },
    {
      "id": "coroutines-33",
      "title": "Checkpoints with answer cues",
      "summary": "Try each question before reading its answer",
      "stage": "PRACTICE",
      "sourcePage": 33,
      "blocks": [
        {
          "type": "heading",
          "text": "A / syntax and execution"
        },
        {
          "type": "checkpoint",
          "prompt": "Does suspend mean background?",
          "runs": [
            {
              "text": "No. It permits suspension; the current context governs execution."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Is delay blocking?",
          "runs": [
            {
              "text": "It suspends the coroutine."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Why does launch resolve here?",
          "runs": [
            {
              "text": "Its CoroutineScope receiver is supplied by the enclosing builder block."
            }
          ]
        },
        {
          "type": "heading",
          "text": "B / ownership and the original failure"
        },
        {
          "type": "checkpoint",
          "prompt": "Why does done print early?",
          "runs": [
            {
              "text": "It belongs to the immediate block statements, while runBlocking still waits for children."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Must orders.await run for parent cancellation?",
          "runs": [
            {
              "text": "No. A normal async child’s failure already fails its parent."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does join retrieve a child exception?",
          "runs": [
            {
              "text": "No; it waits for completion and may itself be cancelled with its waiter."
            }
          ]
        },
        {
          "type": "heading",
          "text": "C / cancellation and supervision"
        },
        {
          "type": "checkpoint",
          "prompt": "Does catching await repair a cancelled ordinary parent?",
          "runs": [
            {
              "text": "No. A Job’s cancellation is not reversible."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does supervision prevent caller cancellation?",
          "runs": [
            {
              "text": "No; cancellation still travels down."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "What if await throws out of supervisorScope?",
          "runs": [
            {
              "text": "The block fails and cancels unfinished children."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does SupervisorJob supervise grandchildren?",
          "runs": [
            {
              "text": "Only its direct-child edges; an ordinary intervening launch still groups its children."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Should Result catch cancellation?",
          "runs": [
            {
              "text": "No; propagate CancellationException."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does withContext(IO) interrupt any blocking API?",
          "runs": [
            {
              "text": "No. Use cancellation-aware APIs or interruption where supported."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "When use coroutineScope?",
          "runs": [
            {
              "text": "When one result is useless without the other and the operation should fail as a group."
            }
          ]
        },
        {
          "type": "heading",
          "text": "D / streams and Android"
        },
        {
          "type": "checkpoint",
          "prompt": "Do two cold collectors share one request?",
          "runs": [
            {
              "text": "Normally no; each executes upstream."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does StateFlow deliver every state transition?",
          "runs": [
            {
              "text": "No; it conflates and suppresses equal updates."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does extraBufferCapacity store events with no subscriber?",
          "runs": [
            {
              "text": "With replay = 0, no."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "What survives a view collection stopping?",
          "runs": [
            {
              "text": "ViewModel-owned work can continue; rendering collection restarts according to lifecycle policy."
            }
          ]
        },
        {
          "type": "heading",
          "text": "E / testing and final teach-back"
        },
        {
          "type": "checkpoint",
          "prompt": "Why inject dispatchers?",
          "runs": [
            {
              "text": "To control scheduling and keep virtual-time tests deterministic."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Why runCurrent after advancing to 100 ms?",
          "runs": [
            {
              "text": "To execute tasks queued exactly at that boundary."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "How test caller cancellation?",
          "runs": [
            {
              "text": "Cancel and join the calling Job; assert cleanup and that no normal result was published."
            }
          ]
        },
        {
          "type": "note",
          "title": "Score your understanding",
          "runs": [
            {
              "text": "Answer the related checkpoint questions correctly and explain one modified example from scratch before moving on. API recall without a correct Job tree does not count as a completed checkpoint."
            }
          ]
        }
      ],
      "group": "PRACTICE AND WORKED SOLUTIONS",
      "referenceNumbers": [
        1,
        4,
        8,
        14,
        23,
        26
      ]
    },
    {
      "id": "coroutines-36",
      "title": "Worked solution: the failure matrix",
      "summary": "Inject behavior to test all outcomes without editing fixtures",
      "stage": "WORKED PRACTICE",
      "sourcePage": 36,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Keep Dashboard (20) and attempt (19). This overload accepts suspend function values instead of fixed network fixtures. It remains attached to its caller and preserves the same independent-result contract."
            }
          ]
        },
        {
          "type": "code",
          "code": "suspend fun loadDashboard(\n    profileRequest: suspend () -> String,\n    ordersRequest: suspend () -> String\n): Dashboard = supervisorScope {\n    val p = async { attempt { profileRequest() } }\n    val o = async { attempt { ordersRequest() } }\n    Dashboard(p.await(), o.await())\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Put this test in src/test/kotlin. Use the imports on page 27. Each case takes 100 virtual ms, demonstrating that both delayed requests start before either is awaited. Success or failure changes the result, not whether both tasks are attempted."
            }
          ]
        },
        {
          "type": "code",
          "code": "@OptIn(ExperimentalCoroutinesApi::class)\nclass FailureMatrixTest {\n    @Test fun checksEveryCombination() = runTest {\n        for (failP in listOf(false, true)) {\n            for (failO in listOf(false, true)) {\n                val started = testScheduler.currentTime\n                val result = loadDashboard(\n                    profileRequest = {\n                        delay(100)\n                        check(!failP) { \"Wrong profile\" }\n                        \"profile\"\n                    },\n                    ordersRequest = {\n                        delay(50)\n                        check(!failO) { \"Wrong orders\" }\n                        \"orders\"\n                    }\n                )\n                assertEquals(!failP, result.profile.isSuccess)\n                assertEquals(!failO, result.orders.isSuccess)\n                assertEquals(100L, testScheduler.currentTime - started)\n            }\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Expected cases: success/success, success/failure, failure/success, failure/failure. Cancellation is a separate fifth case, covered on page 28; it must abort the call rather than return two ordinary failed Results. A failure converted inside attempt does not fail its child Job."
            }
          ]
        }
      ],
      "group": "PRACTICE AND WORKED SOLUTIONS",
      "referenceNumbers": [
        8,
        22,
        26
      ]
    },
    {
      "id": "coroutines-37",
      "title": "Worked solution: streams",
      "summary": "Observe combined state and prove what broadcasts retain",
      "stage": "WORKED PRACTICE",
      "sourcePage": 37,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "combine waits for both sources to emit and then updates using their latest values. In this finite example, orders supplies loading at t = 0; profile arrives at t = 100; orders becomes ready at t = 150. The expected combined list contains two states. [27]"
            }
          ]
        },
        {
          "type": "code",
          "code": "class StreamTest {\n    @Test fun combinesLatestValues() = runTest {\n        val profile = flow { emit(fetchProfile()) }\n        val orders = flow {\n            emit(\"loading\")\n            delay(150)\n            emit(\"orders\")\n        }\n        val values = profile.combine(orders) { p, o -> p to o }\n            .toList()\n        assertEquals(listOf(\"profile\" to \"loading\",\n            \"profile\" to \"orders\"), values)\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "toList waits for completion. On endless StateFlow or SharedFlow, use take or a cancellable collector. Below, take(1) finishes after the first event. [23, 26]"
            }
          ]
        },
        {
          "type": "code",
          "code": "@OptIn(ExperimentalCoroutinesApi::class)\nclass BroadcastTest {\n    @Test fun noSubscriberMeansNoReplay() = runTest {\n        val events = MutableSharedFlow<String>(replay = 0,\n            extraBufferCapacity = 1)\n        events.emit(\"before\")\n        val received = mutableListOf<String>()\n        backgroundScope.launch {\n            events.take(1).toList(received)\n        }\n        runCurrent() // Subscribe before the next emission.\n        events.emit(\"after\")\n        runCurrent()\n        assertEquals(listOf(\"after\"), received)\n    }\n}"
        },
        {
          "type": "note",
          "title": "Try one controlled change",
          "runs": [
            {
              "text": "Set replay = 1. The first received value becomes before, because the new subscriber receives replayed history. This is a different delivery contract, not a guarantee of exactly-once handling. Use the Flow and test imports on pages 21 and 27."
            }
          ]
        }
      ],
      "group": "PRACTICE AND WORKED SOLUTIONS",
      "referenceNumbers": [
        22,
        23,
        26,
        27
      ]
    },
    {
      "id": "coroutines-38",
      "title": "Worked solution: shared state",
      "summary": "Even one thread can lose updates across suspension",
      "stage": "WORKED PRACTICE",
      "sourcePage": 38,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "“Read a value, suspend, write a changed value” is not one indivisible operation. Another coroutine can read the same old value during the suspension. Dispatchers decide execution resources; they do not make this sequence atomic. [30]"
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.sync.Mutex\nimport kotlinx.coroutines.sync.withLock\n\nsuspend fun countUpdates(protected: Boolean): Int = coroutineScope {\n    var count = 0\n    val mutex = Mutex()\n    val workers = List(100) {\n        launch {\n            suspend fun increment() {\n                val before = count\n                yield() // Deliberately exposes interleaving.\n                count = before + 1\n            }\n            if (protected) mutex.withLock { increment() }\n            else increment()\n        }\n    }\n    workers.joinAll() // Read the result only after work finishes.\n    count\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "joinAll before reading count matters: returning count and letting coroutineScope wait afterward would capture the old Int value. Waiting for children does not recompute the block’s result."
            }
          ]
        },
        {
          "type": "code",
          "code": "class CounterTest {\n    @Test fun protectsTheWholeUpdate() = runTest {\n        assertTrue(countUpdates(protected = false) < 100)\n        assertEquals(100, countUpdates(protected = true))\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The StandardTestDispatcher interleaves the unprotected reads at yield. Mutex protects the entire read/write sequence; waiting for its lock suspends rather than blocks a thread. It is non-reentrant: trying to lock the same mutex again from within its held block can deadlock. Keep real critical sections small. [32]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Choose protection by the invariant",
          "runs": [
            {
              "text": "An atomic increment suffices for a single counter. A Mutex can protect several related values as one invariant. StateFlow.update atomically transforms one state value; it does not protect a network request plus another variable. Never put side effects in an update lambda that may be retried."
            }
          ]
        }
      ],
      "group": "PRACTICE AND WORKED SOLUTIONS",
      "referenceNumbers": [
        22,
        28,
        30,
        32
      ]
    },
    {
      "id": "coroutines-39",
      "title": "Worked solution: Android unit tests",
      "summary": "Install Main before the ViewModel is constructed",
      "stage": "WORKED PRACTICE",
      "sourcePage": 39,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Local JVM tests have no Android UI thread. Replace Main with a test dispatcher before using viewModelScope; reset it in finally. This test uses the ViewModel from page 25, its fixtures and ScreenState, plus imports from pages 25 and 27. It needs the host project’s compatible AndroidX dependencies. [26]"
            }
          ]
        },
        {
          "type": "code",
          "code": "@OptIn(ExperimentalCoroutinesApi::class)\nclass DashboardViewModelTest {\n    @Test fun publishesThePartialResult() = runTest {\n        Dispatchers.setMain(StandardTestDispatcher(testScheduler))\n        var model: DashboardViewModel? = null\n        try {\n            val vm = DashboardViewModel()\n            model = vm\n            vm.refresh()\n            runCurrent()\n            assertTrue(vm.state.value.loading)\n            advanceUntilIdle()\n            assertFalse(vm.state.value.loading)\n            assertEquals(\"profile\", vm.state.value.profile)\n            assertEquals(\"Wrong orders\", vm.state.value.ordersError)\n        } finally {\n            model?.viewModelScope?.cancel()\n            Dispatchers.resetMain()\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "setMain affects process-wide dispatcher state, so do not run tests that replace it concurrently. Creating the test dispatcher from testScheduler explicitly ensures the ViewModel and runTest use the same virtual clock. Cancelling its scope prevents this test from leaving owned work running; it is not an assertion about the framework clearing the ViewModel."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Configuration change is not ViewModel clearing"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "A correctly scoped ViewModel usually survives a configuration change such as rotation. viewModelScope is cancelled when that owner actually clears it, not merely whenever a view is destroyed. Navigation behavior depends on the ViewModel’s Activity, Fragment, or navigation-entry owner. [25]"
            }
          ]
        },
        {
          "type": "note",
          "title": "Verify on a device or emulator",
          "runs": [
            {
              "text": "Start a refresh and rotate: the old view collector stops, the new collector observes retained state, and the same ViewModel need not refetch. Navigate so its owner is removed: verify clearing and cancellation. Background the app: repeatOnLifecycle stops rendering collection; ViewModel work can continue while the process lives."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Confine refresh calls to Main before accessing refreshJob. With injected repositories, test slow-old/fast-new requests: only the latest should publish completed state."
            }
          ]
        }
      ],
      "group": "PRACTICE AND WORKED SOLUTIONS",
      "referenceNumbers": [
        22,
        25,
        26
      ]
    },
    {
      "id": "coroutines-34",
      "title": "Quick reference and glossary",
      "summary": "A compact decision sheet to keep beside your editor",
      "stage": "REFERENCE",
      "sourcePage": 34,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "If you need to...",
            "Use or remember..."
          ],
          "rows": [
            [
              "Start owned work without a returned value",
              "launch; catch expected failures inside the operation."
            ],
            [
              "Compute concurrent results",
              "async in an owned scope; start both, then await."
            ],
            [
              "Move one blocking/CPU operation",
              "withContext(IO/Default); inject dispatchers."
            ],
            [
              "Fail a request group together",
              "coroutineScope; catch at its suspend call boundary."
            ],
            [
              "Keep independent sibling requests alive",
              "supervisorScope; handle failures inside its block."
            ],
            [
              "Create a component-owned scope",
              "Job or SupervisorJob plus dispatcher; define shutdown."
            ],
            [
              "Stop work and wait for cleanup",
              "cancelAndJoin; work must cooperate."
            ],
            [
              "Represent recoverable errors",
              "Result or domain types; rethrow cancellation."
            ],
            [
              "Produce multiple values",
              "Flow; check cold vs hot ownership."
            ],
            [
              "Expose current UI state",
              "Read-only StateFlow; immutable state updates."
            ],
            [
              "Broadcast ephemeral values",
              "SharedFlow with intentional replay/buffer policy."
            ],
            [
              "Render Android state safely",
              "repeatOnLifecycle / collectAsStateWithLifecycle."
            ],
            [
              "Test coroutine policy",
              "runTest; one scheduler; controlled dispatchers."
            ]
          ]
        },
        {
          "type": "heading",
          "text": "Words to know"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Continuation:",
              "strong": true
            },
            {
              "text": " saved next step for resumable computation. "
            },
            {
              "text": "Scope:",
              "strong": true
            },
            {
              "text": " launching boundary with an execution context. "
            },
            {
              "text": "Context:",
              "strong": true
            },
            {
              "text": " keyed execution and lifecycle elements. "
            },
            {
              "text": "Job:",
              "strong": true
            },
            {
              "text": " task lifecycle and ownership handle. "
            },
            {
              "text": "Deferred:",
              "strong": true
            },
            {
              "text": " Job with a result. "
            },
            {
              "text": "Structured concurrency:",
              "strong": true
            },
            {
              "text": " child work remains attached to an owner that waits for it. "
            },
            {
              "text": "Supervision:",
              "strong": true
            },
            {
              "text": " independent failure across direct children. "
            },
            {
              "text": "Conflation:",
              "strong": true
            },
            {
              "text": " skipping intermediate updates in favor of newer values. "
            },
            {
              "text": "Virtual time:",
              "strong": true
            },
            {
              "text": " a controlled test clock for scheduled work."
            }
          ]
        },
        {
          "type": "note",
          "title": "Three recurring mistakes",
          "runs": [
            {
              "text": "A catch around launch does not catch its later body failure. async does not delay normal parent failure until await. supervisorScope does not make an exception escaping its block harmless."
            }
          ]
        }
      ],
      "group": "REFERENCE AND READINESS",
      "referenceNumbers": [
        1,
        4,
        8,
        9,
        21,
        22
      ]
    },
    {
      "id": "coroutines-40",
      "title": "Readiness review and next steps",
      "summary": "What completing this guide should and should not establish",
      "stage": "REVIEW",
      "sourcePage": 40,
      "blocks": [
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "This guide is sufficient for the original goal: understanding the profile/orders program from Kotlin syntax through ownership, cancellation, exceptions, supervision, Android state, and tests. Completing the labs is part of that goal; reading the explanations alone does not demonstrate the behavior."
            }
          ]
        },
        {
          "type": "heading",
          "text": "A final assessment with concrete evidence"
        },
        {
          "type": "table",
          "headers": [
            "Skill",
            "Evidence you should produce"
          ],
          "rows": [
            [
              "Trace ownership",
              "Draw each Job edge in the original and supervised programs."
            ],
            [
              "Explain failure",
              "Predict output before running; explain why await order cannot defer normal child failure."
            ],
            [
              "Choose a result policy",
              "Implement both all-or-nothing and partial-success loaders."
            ],
            [
              "Preserve cancellation",
              "Cancel at 20 ms; assert no normal Dashboard return and completed cleanup."
            ],
            [
              "Handle state",
              "Distinguish empty data from failed data and define stale-data behavior."
            ],
            [
              "Handle stream lifetime",
              "Demonstrate cold recollection, StateFlow conflation, and no-subscriber event loss."
            ],
            [
              "Test Android integration",
              "Replace Main in a JVM test; observe view collection and ViewModel lifetime on a device."
            ]
          ]
        },
        {
          "type": "heading",
          "text": "Topics to study after this foundation"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Learn callback bridging with suspendCancellableCoroutine and callbackFlow when integrating listener APIs. Study Channels and bounded concurrency when tasks need queues or many requests. Study WorkManager and persisted state when work must survive process death. These are follow-on topics rather than prerequisites for your original two-request example."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Review record"
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "The review checked the core rules against official Kotlin and Android documentation, corrected prose formatting of generic types, clarified runnable snippet placement, added test-engine setup, and supplied worked failure, stream, synchronization, and Android test examples."
            }
          ]
        },
        {
          "type": "paragraph",
          "small": false,
          "runs": [
            {
              "text": "Verification ran the central JVM examples, failure matrix, stream and synchronization checks, and the printed ViewModel unit test. Test bodies were compiled and invoked with assertions; Gradle/JUnit discovery is a separate setup check on page 35. Device lifecycle, navigation, and process-death behavior still require your Android project."
            }
          ]
        },
        {
          "type": "note",
          "title": "When to move on",
          "runs": [
            {
              "text": "Move on when you can explain a changed example from its ownership tree and verify it with a controlled test. Repeat the lab if your explanation depends only on print order or thread names."
            }
          ]
        }
      ],
      "group": "REFERENCE AND READINESS",
      "referenceNumbers": [
        1,
        4,
        21,
        26
      ]
    }
  ],
  "references": [
    {
      "id": "reference-41-0",
      "numbers": [
        1
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[1] ",
            "strong": true
          },
          {
            "text": "Coroutines basics",
            "strong": true,
            "href": "https://kotlinlang.org/docs/coroutines-basics.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Start here for setup, builders, suspension, and structured concurrency."
          }
        ]
      }
    },
    {
      "id": "reference-41-1",
      "numbers": [
        2
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[2] ",
            "strong": true
          },
          {
            "text": "Higher-order functions and lambdas",
            "strong": true,
            "href": "https://kotlinlang.org/docs/lambdas.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Read function types and function literals with receivers to decode builder syntax."
          }
        ]
      }
    },
    {
      "id": "reference-41-2",
      "numbers": [
        3
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[3] ",
            "strong": true
          },
          {
            "text": "Exception and error handling",
            "strong": true,
            "href": "https://kotlinlang.org/docs/exceptions.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Review try as an expression, catch types, finally, and throwing."
          }
        ]
      }
    },
    {
      "id": "reference-41-3",
      "numbers": [
        4
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[4] ",
            "strong": true
          },
          {
            "text": "Coroutine exceptions handling",
            "strong": true,
            "href": "https://kotlinlang.org/docs/exception-handling.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Read exception propagation and supervision after drawing the original Job tree."
          }
        ]
      }
    },
    {
      "id": "reference-41-4",
      "numbers": [
        5
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[5] ",
            "strong": true
          },
          {
            "text": "ensureActive API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Cancellation checks for long-running nonsuspending work."
          }
        ]
      }
    },
    {
      "id": "reference-41-5",
      "numbers": [
        6
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[6] ",
            "strong": true
          },
          {
            "text": "runInterruptible API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Bridge JVM blocking APIs that support interruption."
          }
        ]
      }
    },
    {
      "id": "reference-41-6",
      "numbers": [
        7
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[7] ",
            "strong": true
          },
          {
            "text": "withTimeout API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Understand cooperative timeout and cancellation/resource races."
          }
        ]
      }
    },
    {
      "id": "reference-41-7",
      "numbers": [
        8
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[8] ",
            "strong": true
          },
          {
            "text": "supervisorScope API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Study block failure, sibling isolation, and unhandled launch exceptions."
          }
        ]
      }
    },
    {
      "id": "reference-41-8",
      "numbers": [
        9
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[9] ",
            "strong": true
          },
          {
            "text": "coroutineScope API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Review lexical ownership and the exception boundary."
          }
        ]
      }
    },
    {
      "id": "reference-41-9",
      "numbers": [
        10
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[10] ",
            "strong": true
          },
          {
            "text": "Job API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/"
          },
          {
            "text": "\n"
          },
          {
            "text": "Lifecycle states, parent-child semantics, cancellation, and join."
          }
        ]
      }
    },
    {
      "id": "reference-41-10",
      "numbers": [
        11
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[11] ",
            "strong": true
          },
          {
            "text": "async API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Result storage, default parent cancellation, and start modes."
          }
        ]
      }
    },
    {
      "id": "reference-41-11",
      "numbers": [
        12
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[12] ",
            "strong": true
          },
          {
            "text": "withContext API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Context changes and cancellation when returning to a dispatcher."
          }
        ]
      }
    },
    {
      "id": "reference-41-12",
      "numbers": [
        13
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[13] ",
            "strong": true
          },
          {
            "text": "SupervisorJob API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Direct-child independence and downward parent cancellation."
          }
        ]
      }
    },
    {
      "id": "reference-41-13",
      "numbers": [
        29,
        30,
        31,
        32
      ],
      "sourcePage": 41,
      "block": {
        "type": "paragraph",
        "small": true,
        "runs": [
          {
            "text": "[29] "
          },
          {
            "text": "launch API",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html"
          },
          {
            "text": " / [30] "
          },
          {
            "text": "Shared mutable state and concurrency",
            "href": "https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html"
          },
          {
            "text": "."
          },
          {
            "text": "\n"
          },
          {
            "text": "[31] "
          },
          {
            "text": "Kotlin/JVM JUnit setup",
            "href": "https://kotlinlang.org/docs/jvm-test-using-junit.html"
          },
          {
            "text": " / [32] "
          },
          {
            "text": "Mutex API",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/"
          },
          {
            "text": "."
          }
        ]
      }
    },
    {
      "id": "reference-42-0",
      "numbers": [
        14
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[14] ",
            "strong": true
          },
          {
            "text": "StateFlow API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/"
          },
          {
            "text": "\n"
          },
          {
            "text": "Equality, conflation, initial state, and never-completing collection."
          }
        ]
      }
    },
    {
      "id": "reference-42-1",
      "numbers": [
        15
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[15] ",
            "strong": true
          },
          {
            "text": "Android: StateFlow and SharedFlow",
            "strong": true,
            "href": "https://developer.android.com/kotlin/flow/stateflow-and-sharedflow"
          },
          {
            "text": "\n"
          },
          {
            "text": "Sharing policies and lifecycle-aware state collection."
          }
        ]
      }
    },
    {
      "id": "reference-42-2",
      "numbers": [
        16
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[16] ",
            "strong": true
          },
          {
            "text": "Coroutine context and dispatchers",
            "strong": true,
            "href": "https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Read context inheritance, dispatcher selection, and parent Jobs."
          }
        ]
      }
    },
    {
      "id": "reference-42-3",
      "numbers": [
        17
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[17] ",
            "strong": true
          },
          {
            "text": "Composing suspending functions",
            "strong": true,
            "href": "https://kotlinlang.org/docs/composing-suspending-functions.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Compare sequential composition with structured concurrent async."
          }
        ]
      }
    },
    {
      "id": "reference-42-4",
      "numbers": [
        18
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[18] ",
            "strong": true
          },
          {
            "text": "flow builder API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Cold execution, cancellable emission, and context invariants."
          }
        ]
      }
    },
    {
      "id": "reference-42-5",
      "numbers": [
        19
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[19] ",
            "strong": true
          },
          {
            "text": "flowOn API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow-on.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Upstream context changes and in-flight emissions on cancellation."
          }
        ]
      }
    },
    {
      "id": "reference-42-6",
      "numbers": [
        20
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[20] ",
            "strong": true
          },
          {
            "text": "Flow catch API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/catch.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Upstream recovery and transparent downstream/cancellation behavior."
          }
        ]
      }
    },
    {
      "id": "reference-42-7",
      "numbers": [
        21
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[21] ",
            "strong": true
          },
          {
            "text": "Android: coroutine best practices",
            "strong": true,
            "href": "https://developer.android.com/kotlin/coroutines/coroutines-best-practices"
          },
          {
            "text": "\n"
          },
          {
            "text": "Main-safe suspend functions, dispatcher injection, scopes, and cancellation."
          }
        ]
      }
    },
    {
      "id": "reference-42-8",
      "numbers": [
        22
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[22] ",
            "strong": true
          },
          {
            "text": "kotlinx-coroutines-test API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/"
          },
          {
            "text": "\n"
          },
          {
            "text": "runTest, TestScope, test schedulers, and replacing Main."
          }
        ]
      }
    },
    {
      "id": "reference-42-9",
      "numbers": [
        23
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[23] ",
            "strong": true
          },
          {
            "text": "SharedFlow API",
            "strong": true,
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/"
          },
          {
            "text": "\n"
          },
          {
            "text": "Replay, buffering, and behavior with no subscribers."
          }
        ]
      }
    },
    {
      "id": "reference-42-10",
      "numbers": [
        24
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[24] ",
            "strong": true
          },
          {
            "text": "runCatching API",
            "strong": true,
            "href": "https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/run-catching.html"
          },
          {
            "text": "\n"
          },
          {
            "text": "Observe the Throwable catch contract before applying it to suspend code."
          }
        ]
      }
    },
    {
      "id": "reference-42-11",
      "numbers": [
        25
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[25] ",
            "strong": true
          },
          {
            "text": "Android: lifecycle-aware coroutines",
            "strong": true,
            "href": "https://developer.android.com/topic/libraries/architecture/coroutines"
          },
          {
            "text": "\n"
          },
          {
            "text": "viewModelScope, lifecycleScope, and repeatOnLifecycle."
          }
        ]
      }
    },
    {
      "id": "reference-42-12",
      "numbers": [
        26
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "[26] ",
            "strong": true
          },
          {
            "text": "Android: testing Kotlin coroutines",
            "strong": true,
            "href": "https://developer.android.com/kotlin/coroutines/test"
          },
          {
            "text": "\n"
          },
          {
            "text": "Practical tests with shared schedulers, dispatcher injection, and Main replacement."
          }
        ]
      }
    },
    {
      "id": "reference-42-13",
      "numbers": [
        27
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": true,
        "runs": [
          {
            "text": "[27] Operator APIs: "
          },
          {
            "text": "buffer",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html"
          },
          {
            "text": ", "
          },
          {
            "text": "conflate",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/conflate.html"
          },
          {
            "text": ", "
          },
          {
            "text": "collectLatest",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect-latest.html"
          },
          {
            "text": ", "
          },
          {
            "text": "combine",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/combine.html"
          },
          {
            "text": ", "
          },
          {
            "text": "zip",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/zip.html"
          },
          {
            "text": ", "
          },
          {
            "text": "retryWhen",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/retry-when.html"
          },
          {
            "text": "."
          }
        ]
      }
    },
    {
      "id": "reference-42-14",
      "numbers": [
        28
      ],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": true,
        "runs": [
          {
            "text": "[28] "
          },
          {
            "text": "MutableStateFlow.update API",
            "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/update.html"
          },
          {
            "text": ": atomic updates and lambda reevaluation."
          }
        ]
      }
    },
    {
      "id": "reference-42-15",
      "numbers": [],
      "sourcePage": 42,
      "block": {
        "type": "paragraph",
        "small": false,
        "runs": [
          {
            "text": "Documentation checked on 30 September 2026. API pages inspected show kotlinx.coroutines 1.11.0. AndroidX artifact versions should follow the target project’s compatible version catalog. Code examples are teaching fixtures, not network-service implementations."
          }
        ]
      }
    }
  ],
  "aliases": {
    "coroutines-41": "coroutines-03",
    "coroutines-42": "coroutines-21"
  },
  "groups": [
    {
      "label": "START HERE",
      "ids": [
        "coroutines-01",
        "coroutines-02"
      ]
    },
    {
      "label": "FIVE-WEEK STUDY PLAN",
      "ids": [
        "coroutines-29",
        "coroutines-30",
        "coroutines-31"
      ]
    },
    {
      "label": "FOUNDATIONS AND LAB SETUP",
      "ids": [
        "coroutines-03",
        "coroutines-35",
        "coroutines-04",
        "coroutines-05",
        "coroutines-06",
        "coroutines-07"
      ]
    },
    {
      "label": "OWNERSHIP AND STRUCTURED CONCURRENCY",
      "ids": [
        "coroutines-08",
        "coroutines-09",
        "coroutines-10",
        "coroutines-11"
      ]
    },
    {
      "label": "CANCELLATION AND FAILURE",
      "ids": [
        "coroutines-12",
        "coroutines-13",
        "coroutines-14",
        "coroutines-15",
        "coroutines-16"
      ]
    },
    {
      "label": "DISPATCHERS AND RESULT POLICIES",
      "ids": [
        "coroutines-17",
        "coroutines-18",
        "coroutines-19",
        "coroutines-20"
      ]
    },
    {
      "label": "STREAMS AND STATE",
      "ids": [
        "coroutines-21",
        "coroutines-22",
        "coroutines-23",
        "coroutines-24"
      ]
    },
    {
      "label": "ANDROID LIFETIME",
      "ids": [
        "coroutines-25",
        "coroutines-26"
      ]
    },
    {
      "label": "COROUTINE TESTING",
      "ids": [
        "coroutines-27",
        "coroutines-28"
      ]
    },
    {
      "label": "PRACTICE AND WORKED SOLUTIONS",
      "ids": [
        "coroutines-32",
        "coroutines-33",
        "coroutines-36",
        "coroutines-37",
        "coroutines-38",
        "coroutines-39"
      ]
    },
    {
      "label": "REFERENCE AND READINESS",
      "ids": [
        "coroutines-34",
        "coroutines-40"
      ]
    }
  ]
});
