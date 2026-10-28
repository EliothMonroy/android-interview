/* Independent informational reference. The companion PDF is background reading. */
window.PRIMERS.push({
  "id": "coroutines",
  "title": "Kotlin Coroutines",
  "subtitle": "A practical reference for suspension, async/await, ownership, streams, and Android lifetimes.",
  "type": "course",
  "icon": "Co",
  "lessons": [
    {
      "id": "coroutines-01",
      "title": "Kotlin coroutines: the essential model",
      "summary": "Suspendable computations, explicit concurrency, and lifetimes that follow their owner.",
      "stage": "FOUNDATIONS",
      "group": "FOUNDATIONS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A coroutine represents work that can pause and later continue. It is useful when an operation spends time waiting for a response, a timer, or another computation. Kotlin lets that work read like ordinary sequential code: a function call returns a value, a later statement uses it, and exceptions follow familiar control flow. The coroutine library adds tools for starting concurrent work and managing its lifetime."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The important distinction is between the computation and the resource executing it. A coroutine is not a dedicated operating system thread. When a suspending operation releases a thread, another coroutine can use that thread. This does not make every function nonblocking: an ordinary blocking call inside a coroutine still occupies its executing thread."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Five questions that describe an operation"
        },
        {
          "type": "table",
          "headers": [
            "Question",
            "Relevant concept"
          ],
          "rows": [
            [
              "What value does it produce?",
              "A suspending return value or Deferred<T>"
            ],
            [
              "Who should stop it?",
              "The owning scope and Job hierarchy"
            ],
            [
              "Where does its active code execute?",
              "Its dispatcher and coroutine context"
            ],
            [
              "What happens when a dependency fails?",
              "A failure policy and recovery boundary"
            ],
            [
              "What if the result is no longer wanted?",
              "Cooperative cancellation and cleanup"
            ]
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "For example, a dashboard may need an account name and recent activity. If both are required for one valid result, their work can share a failure boundary. If either is independently useful, the result model can retain one success and one failure. These are product decisions expressed through coroutine structure; choosing async alone does not decide them."
            }
          ]
        },
        {
          "type": "note",
          "title": "Language and library",
          "runs": [
            {
              "text": "The suspend modifier belongs to Kotlin. Builders, scopes, dispatchers, and Flow are primarily supplied by kotlinx.coroutines. A suspending function may be sequential and need not start another coroutine."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Coroutines overview",
          "url": "https://kotlinlang.org/docs/coroutines-overview.html",
          "description": "The language and library concepts behind coroutine-based concurrency."
        }
      ]
    },
    {
      "id": "coroutines-02",
      "title": "Reading coroutine behavior",
      "summary": "Separate ordinary control flow, scheduling, ownership, and result observation.",
      "stage": "FOUNDATIONS",
      "group": "FOUNDATIONS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Coroutine code becomes easier to reason about when four different relationships are kept separate. Ordinary control flow determines which statements one coroutine reaches. Scheduling determines when its runnable code receives an execution resource. Ownership determines which operations must finish together and how cancellation travels. Observation determines where a value or exception becomes visible to a caller."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A launch call introduces a new coroutine and returns a Job. The next statement in the caller can proceed without waiting for that child to finish. A direct suspending call works differently: its caller continues after the function returns, although the thread may be free for other work while the caller is suspended. An async call adds a result-bearing child; await observes its eventual outcome."
            }
          ]
        },
        {
          "type": "heading",
          "text": "A compact reading map"
        },
        {
          "type": "table",
          "headers": [
            "Visible expression",
            "Question it answers"
          ],
          "rows": [
            [
              "suspend fun calculate(): Int",
              "What result does this operation return?"
            ],
            [
              "scope.launch { ... }",
              "Which scope receives a child operation?"
            ],
            [
              "async { ... }.await()",
              "Where is a concurrent result observed?"
            ],
            [
              "withContext(dispatcher) { ... }",
              "Which context executes this bounded operation?"
            ],
            [
              "try { coroutineScope { ... } }",
              "Where can the caller recover from group failure?"
            ]
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Timing diagrams describe possible overlap, not universal output order. A delay duration is a minimum waiting interval under normal completion, and dispatching adds scheduling effects. A textual order between independent children is rarely a contract. The reliable relationships are dependencies: a value must exist before code uses it, and a structured owner waits for its children before completing."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "This reference groups the concepts by purpose. Syntax explains the expressions; ownership explains lifetime; failure and cancellation explain stopping; dispatchers explain execution placement. Those perspectives apply together to the same function rather than defining separate programming styles."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Coroutines basics",
          "url": "https://kotlinlang.org/docs/coroutines-basics.html",
          "description": "Suspension, coroutine builders, and structured parent-child relationships."
        },
        {
          "title": "Deferred.await",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html",
          "description": "The result-observation and cancellation contract of await."
        }
      ]
    },
    {
      "id": "coroutines-04",
      "title": "Kotlin syntax for suspending APIs",
      "summary": "Return types, nullability, and exception expressions describe the result contract.",
      "stage": "FOUNDATIONS",
      "group": "FOUNDATIONS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A Kotlin function declares named parameters and may declare a return type after a colon. A block body uses return to provide a value; an expression body uses an equals sign and can infer its type. suspend changes where the function can be called and which suspending operations it can invoke. It does not replace the ordinary return type with a future or promise."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A val binding cannot be reassigned. That does not make the referenced object immutable: a val holding a mutable list can still refer to a list whose contents change. This matters when concurrent coroutines share objects. A local name is not a synchronization mechanism, and using suspend does not protect shared mutable state."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\ndata class Account(val displayName: String?)\n\nsuspend fun accountLabel(account: Account): String {\n    delay(10)\n    return account.displayName?.trim()?.takeIf { it.isNotEmpty() }\n        ?: \"Guest\"\n}\n\nfun main() = runBlocking {\n    val account = Account(displayName = null)\n    val label: String = accountLabel(account)\n    println(label)\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Here Account has a nullable property, but accountLabel returns a non-null String. The safe-call operator skips member access when its receiver is null. The Elvis operator supplies the fallback. Neither operator catches exceptions. A thrown exception means the function did not return an ordinary value; callers choose whether to recover from it."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Unit represents a function without a meaningful result value. Nothing describes an expression that cannot complete normally, such as throw or error. These types explain why a conditional branch can throw while the other branch returns a String. Nullable results and failed operations communicate different facts and should be chosen deliberately."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Functions",
          "url": "https://kotlinlang.org/docs/functions.html",
          "description": "Parameters, return types, expression bodies, and default arguments."
        },
        {
          "title": "Null safety",
          "url": "https://kotlinlang.org/docs/null-safety.html",
          "description": "Nullable types, safe calls, and the Elvis operator."
        }
      ]
    },
    {
      "id": "coroutines-05",
      "title": "Lambdas, receivers, and generic results",
      "summary": "Coroutine builders use ordinary Kotlin function types with a suspending receiver.",
      "stage": "FOUNDATIONS",
      "group": "FOUNDATIONS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The braces after launch or async are a lambda argument. Kotlin permits the final function argument to appear outside parentheses, which explains the familiar launch { ... } form. The builder is still a function call. Its lambda is the work to execute, and optional named arguments such as context or start remain inside parentheses."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Function types describe executable values. A type such as (Int) -> String takes an Int and produces a String. A suspend () -> String can invoke suspending operations and produce a String. A receiver type adds an implicit this: suspend CoroutineScope.() -> T describes a suspending lambda in which CoroutineScope members and extensions are available without repeating the receiver."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.async\nimport kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\nsuspend fun <T> paired(operation: suspend (Int) -> T): Pair<T, T> =\n    coroutineScope {\n        val first = async { operation(1) }\n        val second = async { operation(2) }\n        first.await() to second.await()\n    }\n\nfun main() = runBlocking {\n    val names: Pair<String, String> = paired { number ->\n        delay(10)\n        \"item-$number\"\n    }\n    println(names)\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The generic T preserves the relationship between the operation result and both Pair elements. In this call, Kotlin infers String from the lambda’s final expression. Similarly, async infers Deferred<String> when its block returns a String. The lambda’s last expression supplies its value; println as the last expression instead yields Unit."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The receiver explains why async is available inside coroutineScope. It does not make every nested lambda a new coroutine. map, let, and other ordinary higher-order functions remain ordinary control-flow constructs unless their implementation explicitly starts work. The builder and the selected scope establish the concurrent child."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Higher-order functions and lambdas",
          "url": "https://kotlinlang.org/docs/lambdas.html",
          "description": "Function types, trailing lambdas, receiver function types, and inferred results."
        }
      ]
    },
    {
      "id": "coroutines-06",
      "title": "Concurrency, parallelism, and blocking",
      "summary": "Overlapping lifetimes do not imply simultaneous execution or nonblocking code.",
      "stage": "FOUNDATIONS",
      "group": "FOUNDATIONS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Concurrency means that multiple operations can be in progress during overlapping periods. Parallelism means that active instructions execute simultaneously on different execution resources. Two coroutines can be concurrent on one thread when one suspends and the other runs. Conversely, two CPU-heavy coroutines cannot execute in parallel on a dispatcher confined to a single thread."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Blocking occupies the current thread until an operation returns. Thread.sleep is a JVM example: its caller cannot use that thread for other coroutine work during the sleep. delay suspends its coroutine instead, leaving the thread available. A coroutine containing Thread.sleep is still a coroutine, but its sleep remains blocking."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.runBlocking\n\nfun main() = runBlocking<Unit> {\n    coroutineScope {\n        launch {\n            delay(20)\n            println(\"first timer completed\")\n        }\n        launch {\n            delay(10)\n            println(\"second timer completed\")\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The timers can overlap even though the default runBlocking event loop uses its calling thread. The durations illustrate suspension, not a performance guarantee or a universal ordering rule. The enclosing scope waits for both children. No extra dispatcher is needed merely to make these delays concurrent."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Moving a blocking operation to an I/O dispatcher protects the calling thread, but still consumes a worker thread while blocked. Moving CPU work to a computation dispatcher enables suitable scheduling; it does not automatically divide one algorithm into parallel pieces. Parallel decomposition requires independent work, enough resources, and a safe way to combine results. Greater concurrency can also increase memory, connection use, and contention, so starting more coroutines is not by itself an optimization."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Coroutines basics",
          "url": "https://kotlinlang.org/docs/coroutines-basics.html",
          "description": "Concurrency and suspension on operating system threads."
        },
        {
          "title": "delay",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html",
          "description": "A cancellable delay that does not block its executing thread."
        },
        {
          "title": "Coroutine context and dispatchers",
          "url": "https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html",
          "description": "Dispatcher choices and their relationship to execution threads."
        }
      ]
    },
    {
      "id": "coroutines-07",
      "title": "What suspend guarantees",
      "summary": "A suspending signature permits suspension; its implementation determines blocking and context.",
      "stage": "FOUNDATIONS",
      "group": "FOUNDATIONS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The suspend modifier makes a function callable from suspending code and allows it to call other suspending functions. A call still has an ordinary return type. If the function suspends, the caller pauses at that point and resumes when the operation can continue. If the implementation has no reason to suspend, it may return immediately."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A suspending signature does not imply background execution. It also does not imply a new coroutine, concurrent work, a dispatcher switch, or cancellation checks at every statement. The implementation and called APIs determine those behaviors. A long loop in a suspending function can occupy the main thread just like a long loop in an ordinary function."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\nsuspend fun greeting(name: String): String {\n    delay(10)\n    return \"Hello, $name\"\n}\n\nfun main() = runBlocking {\n    val first = greeting(\"Ada\")\n    val second = greeting(\"Lin\")\n    println(\"$first; $second\")\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The two greeting calls are sequential: the second begins after the first returns. delay allows the coroutine to wait without occupying the thread. It does not transform the following greeting into a concurrent invocation. async or launch would introduce separate coroutine lifetimes where overlap is useful."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A suspending function can also be cancelled by its owner while waiting at a cancellable operation. Most standard coroutine suspension primitives cooperate with cancellation, but an arbitrary third-party suspending function needs its own documented contract. Designing a useful suspending API therefore includes its result, execution safety, ownership, and stopping behavior. The keyword communicates permission to suspend, while those broader guarantees belong to the API."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Coroutines basics",
          "url": "https://kotlinlang.org/docs/coroutines-basics.html",
          "description": "Suspending functions and sequential invocation."
        },
        {
          "title": "delay",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html",
          "description": "The suspension and cancellation behavior used in the example."
        }
      ]
    },
    {
      "id": "coroutines-08",
      "title": "Choosing a coroutine entry point",
      "summary": "launch starts an action, async starts a value, and scoped calls return bounded work.",
      "stage": "OWNERSHIP AND BUILDERS",
      "group": "OWNERSHIP AND BUILDERS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Coroutine APIs differ in what they return and whether the caller waits. launch returns a Job representing a child action. async returns Deferred<T>, which is a Job with an eventual value. Neither call joins the child. A dispatcher may begin execution inline or schedule it for later; the builder is not a completion barrier."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "API",
            "Immediate result",
            "Typical purpose"
          ],
          "rows": [
            [
              "launch",
              "Job",
              "Start a child action owned by a scope"
            ],
            [
              "async",
              "Deferred<T>",
              "Start a child whose value will be needed"
            ],
            [
              "coroutineScope",
              "The block result",
              "Own a group of related child operations"
            ],
            [
              "withContext",
              "The block result",
              "Execute bounded work with an updated context"
            ],
            [
              "runBlocking",
              "The block result",
              "Bridge a blocking entry point to suspending code"
            ]
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "join suspends until a Job finishes and does not retrieve its exception as a result. await retrieves a Deferred value or throws its failure; it is also cancellable. A child failure may already have affected an ordinary parent before either join or await is reached. Waiting and failure ownership are separate contracts."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.async\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.runBlocking\n\nfun main() = runBlocking {\n    val announcement = launch { println(\"Loading\") }\n    val value = async {\n        delay(10)\n        42\n    }\n    announcement.join()\n    println(value.await())\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "runBlocking holds the calling thread until its structured work completes. It is useful at a console boundary, but a UI event handler or an already suspending function generally needs a nonblocking scoped API instead. withContext is appropriate for one result in a different dispatcher. async is appropriate when an independently started result can overlap useful work; immediately awaiting a single async often adds unnecessary structure."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "How do async and await differ from launch and join?",
          "runs": [
            {
              "text": "async returns Deferred<T>, which represents a result. await suspends the caller until that result is available, or throws on failure or cancellation. launch returns Job; join waits for completion without retrieving a value or rethrowing that job’s failure. An ordinary child failure can still cancel the parent before either waiting operation."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "launch",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html",
          "description": "A scope-owned child action with a Job handle."
        },
        {
          "title": "async",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html",
          "description": "A scope-owned result-bearing child."
        },
        {
          "title": "runBlocking",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html",
          "description": "The blocking bridge and its completion contract."
        },
        {
          "title": "Job.join",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html",
          "description": "Waiting for completion without retrieving a child result."
        }
      ]
    },
    {
      "id": "coroutines-09",
      "title": "Why a catch around launch misses child failure",
      "summary": "Starting work and executing that work occur across different control-flow boundaries.",
      "stage": "OWNERSHIP AND BUILDERS",
      "group": "OWNERSHIP AND BUILDERS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A try block catches an exception thrown while its own statements execute. Calling launch usually schedules work and returns a Job, so a surrounding catch does not enclose the later execution of the child body. The ownership relationship still exists: under an ordinary parent, an unhandled child failure can cancel the parent even though the original try block has already ended."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.async\nimport kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\nsuspend fun accountName(): String {\n    delay(100)\n    return \"Ada\"\n}\n\nsuspend fun activityCount(): Int {\n    delay(10)\n    throw IllegalStateException(\"Activity unavailable\")\n}\n\nsuspend fun requiredSummary(): String = coroutineScope {\n    val name = async { accountName() }\n    val count = async { activityCount() }\n    \"${name.await()}: ${count.await()}\"\n}\n\nfun main() = runBlocking {\n    try {\n        println(requiredSummary())\n    } catch (failure: IllegalStateException) {\n        println(\"Summary unavailable: ${failure.message}\")\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The async children here belong to coroutineScope. If activityCount fails, its sibling is cancelled and the scoped call throws to its caller after the group has completed its termination. This can happen before count.await is reached. The catch surrounds the complete operation, giving the caller a recovery boundary without leaving its own Job cancelled by that group failure."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Catching only a failing await inside an ordinary parent is different. The failed child may already have cancelled that parent and its siblings. Catching the observed exception does not restore a cancelled Job. Recovery requires a suitable scoped boundary or an independent-result policy that handles expected failures before they fail child Jobs."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A final log statement inside a launch-owning block proves only that execution reached that statement. Successful return from the complete structured operation is the meaningful completion boundary. The delays in this example describe competing work; exact wall-clock timing is not part of its API contract."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "launch",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html",
          "description": "Launching returns a handle while child failure follows its ownership relationship."
        },
        {
          "title": "async",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html",
          "description": "Ordinary async child failure affects its parent independently of await."
        },
        {
          "title": "coroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html",
          "description": "A group boundary that completes its children and rethrows group failure to its caller."
        }
      ]
    },
    {
      "id": "coroutines-10",
      "title": "Scope, context, and the Job tree",
      "summary": "The scope starts work, the context configures it, and the Job tracks lifetime.",
      "stage": "OWNERSHIP AND BUILDERS",
      "group": "OWNERSHIP AND BUILDERS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "CoroutineScope is the receiver used to start children with builders such as launch and async. Its coroutineContext supplies execution elements. Those elements include a Job for lifecycle, a dispatcher for execution placement, and optional values such as a coroutine name. These ideas cooperate, but answer different questions."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The Job relationship expresses ownership. Cancelling a parent requests cancellation of its descendants. An ordinary child failure other than cancellation affects its parent, which in turn stops sibling work. A dispatcher change does not remove these relationships: a background child can still belong to a main-thread owner."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.CoroutineName\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.Job\nimport kotlinx.coroutines.currentCoroutineContext\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.runBlocking\n\nfun main() = runBlocking(CoroutineName(\"request\")) {\n    val parent: Job = currentCoroutineContext()[Job]!!\n    val child = launch(Dispatchers.Default + CoroutineName(\"analysis\")) {\n        println(currentCoroutineContext()[CoroutineName]?.name)\n    }\n    println(\"Parent active: ${parent.isActive}\")\n    child.join()\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Each builder creates a new child Job while inheriting and combining the other context elements. The new name replaces the inherited name, and the supplied dispatcher changes where active code executes. The child still belongs to the runBlocking coroutine. The example’s nullable Job lookup is asserted because runBlocking provides one; arbitrary contexts need not."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Passing a fresh Job directly as a builder context replaces the inherited parent relationship and can detach work from the owner that readers expect. A manually created scope likewise requires an explicit lifecycle and shutdown policy. Framework scopes or lexical scope functions usually make the owner easier to identify. A useful review question is whether leaving the owning screen, request, or service stops every operation that should end with it."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "CoroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/",
          "description": "Scope receivers, context elements, and lifecycle conventions."
        },
        {
          "title": "Job",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/",
          "description": "Job states, parent-child ownership, and cancellation."
        },
        {
          "title": "Coroutine context and dispatchers",
          "url": "https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html",
          "description": "Context inheritance and combining dispatcher/name elements."
        }
      ]
    },
    {
      "id": "coroutines-11",
      "title": "Structured concurrency and bounded work",
      "summary": "A suspending function can own a concurrent group and return only when the group has finished.",
      "stage": "OWNERSHIP AND BUILDERS",
      "group": "OWNERSHIP AND BUILDERS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Structured concurrency connects the lifetime of child work to an operation that owns it. A function promising a combined result should not secretly leave its component operations running after it returns or fails. coroutineScope creates a lexical boundary for that promise: it returns after its body and children complete, and the caller’s cancellation reaches the group."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.async\nimport kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\ndata class Totals(val invoices: Int, val payments: Int)\n\nsuspend fun invoiceTotal(): Int {\n    delay(20)\n    return 120\n}\n\nsuspend fun paymentTotal(): Int {\n    delay(10)\n    return 90\n}\n\nsuspend fun loadTotals(): Totals = coroutineScope {\n    val invoices = async { invoiceTotal() }\n    val payments = async { paymentTotal() }\n    Totals(invoices.await(), payments.await())\n}\n\nfun main() = runBlocking {\n    println(loadTotals())\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Both values belong to the loadTotals call. Their work can overlap, but neither outlives the enclosing operation. A failure in either child invalidates this combined result and cancels the other. A caller can catch the scoped operation’s failure at the function boundary; it does not need to know how many children were used internally."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Cancellation requests do not mean that termination is already complete. A child may need to observe cancellation and release resources. The structured boundary waits for that termination, which makes ownership meaningful even during failure. A noncooperative loop or blocking operation can therefore delay the whole group’s completion."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Some work intentionally belongs to a longer-lived component, such as an application-owned synchronization service. That work needs an explicitly supplied owner with its own cancellation and error policy. Replacing the caller with GlobalScope merely to keep a task alive hides the lifetime decision. A function’s contract should make clear whether it completes work itself or deliberately schedules work for another owner."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "coroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html",
          "description": "Lexically bounded concurrent work and failure propagation."
        },
        {
          "title": "CoroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/",
          "description": "Lifecycle ownership and structured completion."
        }
      ]
    },
    {
      "id": "coroutines-12",
      "title": "Cooperative cancellation",
      "summary": "Stopping work requires cancellation-aware suspension points or explicit checks.",
      "stage": "CANCELLATION AND FAILURE",
      "group": "CANCELLATION AND FAILURE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Cancellation is a request communicated through a coroutine’s Job. It prevents unwanted work from continuing when its owner stops caring about the result. Cancellable suspending APIs such as delay and await check this state and throw CancellationException. Ordinary computation does not automatically inspect the Job at every instruction."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.currentCoroutineContext\nimport kotlinx.coroutines.ensureActive\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.withContext\n\nsuspend fun squareTotal(values: List<Int>): Long =\n    withContext(Dispatchers.Default) {\n        var total = 0L\n        for ((index, value) in values.withIndex()) {\n            if (index % 256 == 0) currentCoroutineContext().ensureActive()\n            total += value.toLong() * value\n        }\n        total\n    }\n\nfun main() = runBlocking {\n    println(squareTotal(listOf(1, 2, 3)))\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "ensureActive throws when the current coroutine is cancelled. The periodic check gives this CPU loop a stopping opportunity without introducing a suspension after every element. The interval is a workload choice: expensive individual iterations may need finer-grained checks. yield is another cooperative primitive that can also let other runnable coroutines progress."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Cancellation normally travels from an owner to its children. Cancelling one ordinary child by itself does not fail its parent in the way a non-cancellation exception does. cancel requests stopping; cancelAndJoin also waits until that child has terminated. Cleanup may still be running between those events."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Broad catch blocks can intercept CancellationException because it is an exception. Converting it into a normal failure value makes code appear to have recovered after its owner stopped it. Error-handling helpers should rethrow cancellation, and blocking libraries need appropriate cancellation support or documented limits. Merely wrapping a blocking call in a suspending function does not make that call interruptible."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "ensureActive",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html",
          "description": "Explicit cooperative checks for non-suspending computation."
        },
        {
          "title": "Job",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/",
          "description": "Cancellation requests, termination, and parent-child behavior."
        }
      ]
    },
    {
      "id": "coroutines-13",
      "title": "Cleanup and time limits",
      "summary": "Resource release belongs in finally; timeouts request cancellation rather than forcibly stopping execution.",
      "stage": "CANCELLATION AND FAILURE",
      "group": "CANCELLATION AND FAILURE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A cancelled coroutine still unwinds its stack, so finally is the normal place to release resources acquired by an operation. Closing an in-memory handle or a file can often be done synchronously there. Suspending cleanup needs special care because the Job may already be cancelled and a cancellable suspending call can immediately throw again."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.NonCancellable\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.withContext\nimport kotlinx.coroutines.withTimeoutOrNull\n\nclass Connection {\n    suspend fun read(): String {\n        delay(100)\n        return \"response\"\n    }\n    suspend fun close() {\n        delay(5)\n        println(\"Connection closed\")\n    }\n}\n\nsuspend fun readConnection(): String {\n    val connection = Connection()\n    try {\n        return connection.read()\n    } finally {\n        withContext(NonCancellable) { connection.close() }\n    }\n}\n\nfun main() = runBlocking {\n    val response = withTimeoutOrNull(20) { readConnection() }\n    println(response ?: \"Read timed out\")\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The narrow NonCancellable region allows this illustrative suspending close to finish while cancellation is being processed. It should remain bounded and focused on release. Long network retries or new business operations in that region postpone shutdown and defeat the owner’s stopping policy. NonCancellable should not be passed to launch or async to keep ordinary work alive."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "withTimeout throws TimeoutCancellationException when its own deadline expires. withTimeoutOrNull instead represents its own timeout with null; cancellation from an outer owner still propagates. A timeout does not forcibly interrupt arbitrary CPU code or a blocking library call, so observed elapsed time can exceed its duration while work and cleanup terminate."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Timeout cancellation can race with producing a value. Resource acquisition is therefore safest when acquisition and release share an enclosing ownership boundary. Returning a newly acquired closeable resource from a timed block without protecting the handoff can lose the resource if cancellation wins before the caller receives it."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "withTimeout",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html",
          "description": "Timeout cancellation and races at completion."
        },
        {
          "title": "NonCancellable",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/",
          "description": "Narrow cancellation-resistant cleanup and builder limitations."
        },
        {
          "title": "withTimeoutOrNull",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html",
          "description": "A timeout boundary with a nullable result and cooperative stopping."
        }
      ]
    },
    {
      "id": "coroutines-14",
      "title": "Failure propagation and exception observation",
      "summary": "A failed child affects ownership before a caller necessarily observes its result.",
      "stage": "CANCELLATION AND FAILURE",
      "group": "CANCELLATION AND FAILURE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "An ordinary coroutine hierarchy treats an unhandled non-cancellation exception in a child as failure of its parent. The parent requests cancellation of its other children and waits for termination. This is the failure policy behind an all-or-nothing group. CancellationException is treated as normal cancellation rather than a new error that fails the parent."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "async stores an outcome in Deferred, and await retrieves the value or throws that outcome’s exception. Storing the exception does not isolate a child from its ordinary parent. Failure can already have cancelled sibling work before await executes. By contrast, supervision changes the parent’s response to a direct child failure, allowing that failure to remain independent until application code handles it."
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.IOException\nimport kotlinx.coroutines.async\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.supervisorScope\n\nfun main() = runBlocking {\n    supervisorScope {\n        val result = async<String> { throw IOException(\"Unavailable\") }\n        try {\n            println(result.await())\n        } catch (failure: IOException) {\n            println(\"Recovered: ${failure.message}\")\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The catch is inside the supervisor block, so the observed IOException does not escape and fail that block. In an ordinary coroutineScope, catching only await inside its already-cancelled body would not undo the child’s earlier effect on the group. Catching the scoped function call outside that boundary is the corresponding recovery pattern."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "CoroutineExceptionHandler receives uncaught exceptions at eligible root or supervised launch boundaries. It is a reporting mechanism after failure, not a way to resume the failed coroutine. It does not retrieve an async outcome, and installing it on an ordinary child does not stop failure from reaching the owner. Recoverable operations need explicit try/catch or an intentional result model where recovery is still possible."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Coroutine exceptions handling",
          "url": "https://kotlinlang.org/docs/exception-handling.html",
          "description": "Propagation, cancellation exceptions, and uncaught exception handlers."
        },
        {
          "title": "Deferred.await",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html",
          "description": "Observation of stored results and exceptional completion."
        }
      ]
    },
    {
      "id": "coroutines-15",
      "title": "coroutineScope and supervisorScope",
      "summary": "Choose whether a failed child invalidates sibling work, then define how each failure is handled.",
      "stage": "CANCELLATION AND FAILURE",
      "group": "CANCELLATION AND FAILURE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "coroutineScope and supervisorScope both create bounded operations that wait for their body and children. Both inherit cancellation from their caller. Their difference is the response to a direct child’s non-cancellation failure. coroutineScope fails the group, while supervisorScope allows the other direct children to continue."
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.IOException\nimport kotlinx.coroutines.async\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.supervisorScope\n\nsuspend fun independentLabels(): Pair<String, String> = supervisorScope {\n    val title = async {\n        delay(30)\n        \"Account\"\n    }\n    val badge = async<String> {\n        delay(10)\n        throw IOException(\"Badge unavailable\")\n    }\n    val badgeText = try {\n        badge.await()\n    } catch (failure: IOException) {\n        \"No badge\"\n    }\n    title.await() to badgeText\n}\n\nfun main() = runBlocking {\n    println(independentLabels())\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The failed badge child does not cancel title. The local catch also prevents badge.await from throwing out of the supervisor block, so title can supply its result. The fallback is an explicit policy for this expected IOException. Other exceptions continue to propagate rather than silently turning into a missing badge."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Supervision does not catch exceptions thrown by the supervisor’s own body. If badge.await were allowed to throw out of the block, that block would fail and cancel any remaining children. A catch outside supervisorScope can observe the failure, but cannot retroactively preserve work cancelled during that escape. Independent result handling must happen inside the boundary when unfinished siblings should remain useful."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Supervision also applies only at the supervised parent-child relationship. An ordinary launch inside a supervisor can create its own async children; failure in that nested ordinary group can cancel its siblings there. The outer supervisor then isolates the failed launch from its other direct children. Choosing a scope therefore requires both the dependency policy and the actual Job hierarchy."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does supervisorScope make every await safe to call?",
          "runs": [
            {
              "text": "No. It isolates a child failure from its siblings, but await still exposes that failure. If the exception escapes the supervisor block, the block fails and unfinished children are cancelled. Independent results need an explicit per-result recovery policy that preserves cancellation."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "supervisorScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html",
          "description": "Child independence, caller cancellation, and failure of the supervisor block."
        },
        {
          "title": "coroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html",
          "description": "All-or-nothing grouping for required subtasks."
        }
      ]
    },
    {
      "id": "coroutines-16",
      "title": "Job and SupervisorJob ownership",
      "summary": "Long-lived scopes need explicit shutdown; supervision applies to direct children.",
      "stage": "CANCELLATION AND FAILURE",
      "group": "CANCELLATION AND FAILURE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Job and SupervisorJob are lifecycle objects that can form the root of a manually managed CoroutineScope. A regular Job reacts to an unhandled child failure by cancelling itself and its other children. A SupervisorJob allows its direct children to fail independently. Both still cancel their children when the owner cancels the parent Job."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.CoroutineScope\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.Job\nimport kotlinx.coroutines.SupervisorJob\nimport kotlinx.coroutines.cancelAndJoin\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.runBlocking\n\nclass RefreshOwner {\n    private val ownerJob = SupervisorJob()\n    private val scope = CoroutineScope(ownerJob + Dispatchers.Default)\n\n    fun refresh(): Job = scope.launch {\n        delay(10)\n        println(\"Refreshed\")\n    }\n\n    suspend fun close() {\n        ownerJob.cancelAndJoin()\n    }\n}\n\nfun main() = runBlocking {\n    val owner = RefreshOwner()\n    try {\n        owner.refresh().join()\n    } finally {\n        owner.close()\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "This example gives a component an explicit owner and a suspending shutdown method. Its lifetime is deliberately managed by the surrounding caller, because the independently created SupervisorJob has no inherited parent. In framework code an existing lifecycle scope often supplies that management. Creating a scope for every function call makes ownership harder to see and is rarely necessary."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The factory-created Job itself has no coroutine body that naturally finishes. Waiting for its children is not the same as completing that owner; it needs explicit cancellation or completion. Its handle should therefore live with the component responsible for shutdown."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "SupervisorJob does not automatically handle errors. A supervised launch still needs a local catch or an appropriate uncaught-exception reporting policy. A supervised async still needs its outcome observed. Passing SupervisorJob directly to launch also does not make that launch’s own children mutually independent: those children belong to the new ordinary launch Job. Lexical supervisorScope is usually clearer for independent work within one suspending function."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "SupervisorJob",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html",
          "description": "Direct-child independence and optional linkage to a parent Job."
        },
        {
          "title": "Job",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/",
          "description": "Lifecycle state and explicit completion of factory-created Jobs."
        }
      ]
    },
    {
      "id": "coroutines-17",
      "title": "Dispatchers and main-safe APIs",
      "summary": "The layer performing blocking or expensive work owns the decision to move it.",
      "stage": "EXECUTION AND RESULTS",
      "group": "EXECUTION AND RESULTS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A dispatcher determines where runnable coroutine code is executed. On Android, Main is for UI-confined work, Default suits substantial CPU computation, and IO suits blocking I/O. These categories describe the work performed, not the name of the function. A network library with a genuinely suspending API may already manage its own waiting and threads."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A main-safe suspending function can be called from the main thread without blocking it with long-running work. The implementation responsible for that work should move it to an appropriate dispatcher. This lets a caller compose operations without needing knowledge of file access, parsing, or transport internals."
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.File\nimport kotlinx.coroutines.CoroutineDispatcher\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.withContext\n\nclass TextStore(\n    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO\n) {\n    suspend fun read(file: File): String = withContext(ioDispatcher) {\n        file.readText()\n    }\n}\n\nfun main() = runBlocking {\n    val file = File.createTempFile(\"coroutine-reference\", \".txt\")\n    try {\n        file.writeText(\"hello\")\n        println(TextStore().read(file))\n    } finally {\n        file.delete()\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The repository-style read method owns dispatching because file.readText is blocking. The console boundary creates the fixture synchronously; it is not an example of Android UI work. Injecting the dispatcher makes the execution policy replaceable, which also helps tests coordinate scheduling. A large subsequent parse would need its own CPU-work policy rather than assuming IO is appropriate for every part of the operation."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "withContext returns to its caller’s context after its bounded work. It does not detach the operation or keep it alive after owner cancellation. Choosing IO does not make an arbitrary blocking API cooperatively cancellable, and choosing Default does not make shared mutable state thread-safe. Execution placement, cancellation, and synchronization remain separate responsibilities."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Android coroutine best practices",
          "url": "https://developer.android.com/kotlin/coroutines/coroutines-best-practices",
          "description": "Main-safe suspending functions and injected dispatchers."
        },
        {
          "title": "withContext",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html",
          "description": "Bounded execution in an updated context and return to the caller."
        }
      ]
    },
    {
      "id": "coroutines-18",
      "title": "async, await, and withContext",
      "summary": "Use explicit concurrent children when independent values can overlap useful work.",
      "stage": "EXECUTION AND RESULTS",
      "group": "EXECUTION AND RESULTS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "withContext executes a bounded block and returns its value before the caller continues. It is often used to move one blocking or CPU-heavy operation to the right dispatcher. async creates a separate child and schedules it under its default start mode, returning Deferred<T>; await later obtains that child’s value or failure."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.async\nimport kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\nsuspend fun lookup(id: Int): String {\n    delay(10)\n    return \"record-$id\"\n}\n\nsuspend fun sequentialNames(): String {\n    val first = lookup(1)\n    val second = lookup(2)\n    return \"$first, $second\"\n}\n\nsuspend fun concurrentNames(): String = coroutineScope {\n    val first = async { lookup(1) }\n    val second = async { lookup(2) }\n    \"${first.await()}, ${second.await()}\"\n}\n\nfun main() = runBlocking {\n    println(sequentialNames())\n    println(concurrentNames())\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The sequential function expresses a simple order. The concurrent function starts both independent children before waiting for either result. Awaiting first before second does not make second start later: its default async was already scheduled. However, async { lookup(1) }.await() followed by a second async-and-await would serialize these operations."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Lazy async changes this detail. A lazy child begins when explicitly started or when awaited, so awaiting the first lazy child before starting the second removes the intended overlap. Laziness is a deliberate scheduling choice, not a prerequisite for Deferred."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Concurrency can reduce waiting when operations are independent, but it consumes resources and adds failure interactions. If the second operation needs the first result, sequential calls communicate that dependency directly. If only one operation is needed in a different dispatcher, withContext usually communicates the intent more clearly than async followed immediately by await. Both remain structured when used under the caller’s ownership."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Composing suspending functions",
          "url": "https://kotlinlang.org/docs/composing-suspending-functions.html",
          "description": "Sequential calls, concurrent async values, and lazy-start behavior."
        },
        {
          "title": "withContext",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html",
          "description": "Returning one bounded result from an updated context."
        }
      ]
    },
    {
      "id": "coroutines-19",
      "title": "Errors as values without swallowing cancellation",
      "summary": "Result retains success or failure details; domain types can express expected alternatives more precisely.",
      "stage": "EXECUTION AND RESULTS",
      "group": "EXECUTION AND RESULTS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "An exception means an operation did not return a normal value. Sometimes that should fail the whole operation; sometimes the caller needs to retain the failure alongside other successful data. Result<T> can represent either a T or a Throwable. A domain-specific sealed type is another option when the application has meaningful alternatives such as NotFound, PermissionDenied, or Ready."
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.IOException\nimport kotlinx.coroutines.CancellationException\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\n\nsuspend fun <T> ioResult(block: suspend () -> T): Result<T> = try {\n    Result.success(block())\n} catch (cancelled: CancellationException) {\n    throw cancelled\n} catch (failure: IOException) {\n    Result.failure(failure)\n}\n\nsuspend fun readMessage(): String {\n    delay(10)\n    throw IOException(\"Temporary read failure\")\n}\n\nfun main() = runBlocking {\n    val message = ioResult { readMessage() }\n    println(message.fold(\n        onSuccess = { it },\n        onFailure = { \"Read unavailable: ${it.message}\" }\n    ))\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "This helper converts only its declared expected I/O failure family. It preserves cancellation as control flow and leaves programming defects or other unexpected exceptions exceptional. A broader Exception catch can be intentional at an application boundary, but should not silently classify every defect as ordinary missing data. Catching Throwable would also include errors that recovery code often cannot safely handle."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The standard runCatching catches any Throwable, including CancellationException. Used around suspending work, it therefore requires an explicit cancellation policy. A cancellation-aware helper makes that policy visible rather than depending on every consumer to detect a stored cancellation later."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "getOrNull discards the difference between failed work and a successful nullable value, so it is appropriate only when that loss is deliberate. fold or an explicit domain type preserves enough information for recovery, diagnostics, and UI choices. A Result value also does not undo cancellation already caused by a failed ordinary child: conversion is most useful inside the child before its expected exception escapes."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Result",
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-result/",
          "description": "Success and failure values and outcome inspection."
        },
        {
          "title": "runCatching",
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/run-catching.html",
          "description": "The standard helper catches any Throwable."
        }
      ]
    },
    {
      "id": "coroutines-20",
      "title": "Partial success as an operation contract",
      "summary": "Independent result fields preserve useful data while caller cancellation still stops the group.",
      "stage": "EXECUTION AND RESULTS",
      "group": "EXECUTION AND RESULTS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Partial success is a result contract, not an automatic effect of async or supervision. A dashboard that can show a profile even when activity fails needs a representation for both outcomes. Expected failures should become values at the individual operation boundary. Cancellation should still stop the complete dashboard request when its owner leaves."
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.IOException\nimport kotlinx.coroutines.CancellationException\nimport kotlinx.coroutines.async\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.supervisorScope\n\ndata class Dashboard(\n    val profile: Result<String>,\n    val activity: Result<List<String>>\n)\n\nsuspend fun profile(): String {\n    delay(30)\n    return \"Ada\"\n}\n\nsuspend fun activity(): List<String> {\n    delay(10)\n    throw IOException(\"Activity unavailable\")\n}\n\nsuspend fun <T> expectedIo(block: suspend () -> T): Result<T> = try {\n    Result.success(block())\n} catch (cancelled: CancellationException) {\n    throw cancelled\n} catch (failure: IOException) {\n    Result.failure(failure)\n}\n\nsuspend fun dashboard(): Dashboard = supervisorScope {\n    val profileResult = async { expectedIo { profile() } }\n    val activityResult = async { expectedIo { activity() } }\n    Dashboard(profileResult.await(), activityResult.await())\n}\n\nfun main() = runBlocking {\n    val result = dashboard()\n    println(result.profile.fold(\n        onSuccess = { \"Profile: $it\" },\n        onFailure = { \"Profile unavailable: ${it.message}\" }\n    ))\n    println(result.activity.fold(\n        onSuccess = { \"Activity count: ${it.size}\" },\n        onFailure = { \"Activity unavailable: ${it.message}\" }\n    ))\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Both children start before either await. The expected IOException is converted within the activity child, so that child completes normally with Result.failure. The profile can therefore complete and remain available in the returned Dashboard. Both fields are inspected rather than collapsed into one generic fallback."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "For these converted failures, coroutineScope would also preserve the profile: neither child Job fails. supervisorScope additionally expresses independence if an unexpected child exception occurs. It does not guarantee a Dashboard for every defect. An unexpected exception observed by await and allowed to escape the supervisor body still fails that operation and cancels remaining children."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The helper rethrows cancellation, so an outer cancellation is not rendered as an activity outage. The caller continues to own both requests, and the function waits for their termination before returning or failing. A production result model may replace Result with explicit domain alternatives, but the same design questions remain: which data is independently useful, which failures are expected, and where should unexpected failure terminate the operation?"
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "SupervisorJob",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html",
          "description": "Independent child failure policy without detaching from an owner."
        },
        {
          "title": "supervisorScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html",
          "description": "Bounded supervision and failure escaping the block."
        },
        {
          "title": "Result",
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-result/",
          "description": "Retaining successful values and expected failures independently."
        }
      ]
    },
    {
      "id": "coroutines-38",
      "title": "Shared mutable state and atomic updates",
      "summary": "Protect the full invariant across threads and suspension points.",
      "stage": "EXECUTION AND RESULTS",
      "group": "EXECUTION AND RESULTS",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Coroutines can interleave on one thread and execute in parallel on several threads. A read followed later by a write is not necessarily one indivisible operation. On one thread, suspension between the two steps lets another coroutine observe and replace the same value. Across threads, even a non-suspending counter increment can race. A volatile field improves visibility but does not make a compound read-modify-write atomic."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The right protection depends on the invariant. An atomic counter suits a single numeric operation. MutableStateFlow.update atomically replaces one state value, and immutable state can place related fields within that single update. Its update function may be evaluated again under contention, so sending a request or writing a log with business meaning inside that function risks repeated side effects. A Mutex can guard a larger operation or several related fields when every access follows the same locking discipline."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.sync.Mutex\nimport kotlinx.coroutines.sync.withLock\n\nclass Inventory(private var stock: Int) {\n    private val mutex = Mutex()\n\n    suspend fun reserve(): Boolean = mutex.withLock {\n        if (stock == 0) false else {\n            stock -= 1\n            true\n        }\n    }\n\n    suspend fun remaining(): Int = mutex.withLock { stock }\n}\n\nfun main() = runBlocking {\n    val inventory = Inventory(1)\n    coroutineScope {\n        repeat(2) {\n            launch { println(inventory.reserve()) }\n        }\n    }\n    println(inventory.remaining())\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Here stock inspection and decrement share one critical section; callers cannot both reserve the final item. Mutex waiting suspends rather than occupying a thread, but the lock still serializes access. Long network operations under a lock can create unnecessary contention. Mutex is non-reentrant, so calling another function that acquires the same lock from inside a locked section can suspend indefinitely. Thread confinement is another option, provided the whole invariant remains confined and suspension does not expose an unfinished transaction."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Shared mutable state and concurrency",
          "url": "https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html",
          "description": "Visibility, atomicity, confinement, and synchronization."
        },
        {
          "title": "Mutex API",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/",
          "description": "Suspending mutual exclusion and non-reentrant locking."
        },
        {
          "title": "Atomic StateFlow update",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/update.html",
          "description": "Atomic replacement with a function that may be evaluated repeatedly."
        }
      ]
    },
    {
      "id": "coroutines-21",
      "title": "Cold Flow and collection",
      "summary": "Represent values that arrive over time, with collection as the execution boundary.",
      "stage": "STREAMS AND STATE",
      "group": "STREAMS AND STATE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A suspending function returns one result; a Flow can describe a sequence of results separated by suspension. A flow built with flow { } is cold: constructing it describes work, and collecting it starts that work. Each collection invokes the builder again. Two collectors of a database observation may therefore establish two observations unless another layer shares the upstream work. The Flow interface itself does not promise cold behavior; hot implementations also implement Flow."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Without a concurrency operator, emission, transformation, and collection proceed sequentially. emit suspends when downstream needs time, so a slow collector naturally slows the producer. Suspension does not imply a dedicated thread or automatic background execution. Expensive blocking work still needs an appropriate execution context. flowOn changes the context of the operators upstream of it while preserving the collector’s context."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.flow.Flow\nimport kotlinx.coroutines.flow.collect\nimport kotlinx.coroutines.flow.flow\n\nfun countdown(): Flow<Int> = flow {\n    for (number in 3 downTo 1) {\n        delay(100)\n        emit(number)\n    }\n}\n\nfun main() = runBlocking {\n    val numbers = countdown()\n    numbers.collect { println(\"First: $it\") }\n    numbers.collect { println(\"Second: $it\") }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Here the second collection starts a new countdown after the first finishes. The builder keeps no external mutable counter, so repeated collection has a clear meaning. Terminal operators express different demands: first returns after one matching value, take bounds a stream, and toList needs completion. An unbounded stream cannot produce a final complete list. Cancellation normally travels from the collecting coroutine into cooperative upstream work; a flow is not an independent lifetime owner."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Kotlin Flow API",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/",
          "description": "Cold and hot implementations, sequential processing, and context preservation."
        },
        {
          "title": "Kotlin flows guide",
          "url": "https://kotlinlang.org/docs/coroutines-flow.html",
          "description": "Flow builders, terminal operations, cancellation, and execution contexts."
        }
      ]
    },
    {
      "id": "coroutines-22",
      "title": "Flow transformations and failure boundaries",
      "summary": "Choose operators by their ordering, cancellation, and recovery behavior.",
      "stage": "STREAMS AND STATE",
      "group": "STREAMS AND STATE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Intermediate operators describe a processing pipeline. map transforms each value, filter selects values, and onEach adds an action without replacing the value. These operators preserve sequential processing unless an operator introduces concurrency. Their order changes the contract: filtering before an expensive transformation avoids work, while filtering afterward can inspect the transformed result. A pipeline should make this ordering apparent to its readers."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "zip pairs corresponding emissions and is useful when position matters. combine waits for each source to produce a value, then computes from their latest values as sources update. It is useful for derived screen state, but it does not create an atomic transaction across independent sources. collectLatest cancels the previous collector action when a new value arrives. It suits replaceable rendering or searches; cancellation must be cooperative, and an already committed external side effect cannot be undone by cancellation."
            }
          ]
        },
        {
          "type": "code",
          "code": "import java.io.IOException\nimport kotlinx.coroutines.runBlocking\nimport kotlinx.coroutines.flow.catch\nimport kotlinx.coroutines.flow.collect\nimport kotlinx.coroutines.flow.flow\nimport kotlinx.coroutines.flow.map\n\nfun main() = runBlocking {\n    flow {\n        emit(10)\n        throw IOException(\"Sensor unavailable\")\n    }\n        .map { \"Reading: $it\" }\n        .catch { cause ->\n            if (cause !is IOException) throw cause\n            emit(\"Reading unavailable\")\n        }\n        .collect { println(it) }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "catch handles failures upstream of its position. The example can replace a producer or map failure with a fallback string, but a failure in the collector remains outside that boundary. catch is transparent to cancellation exceptions used to cancel collection. retry or retryWhen restarts upstream collection; it does not resume at the failed emit. A retry policy therefore needs bounded attempts, an appropriate delay, and awareness that earlier operations may repeat. Recovery values should describe meaningful application states rather than silently hide programming errors."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Flow catch",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/catch.html",
          "description": "Upstream exception transparency, fallback values, and cancellation."
        },
        {
          "title": "Kotlin flows guide",
          "url": "https://kotlinlang.org/docs/coroutines-flow.html",
          "description": "Transformation, combination, and latest-value operators."
        }
      ]
    },
    {
      "id": "coroutines-23",
      "title": "StateFlow: observable current state",
      "summary": "Model a current value while treating history and producer lifetime separately.",
      "stage": "STREAMS AND STATE",
      "group": "STREAMS AND STATE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "StateFlow exposes a current value and gives a new subscriber the latest available state. It always has an initial value and never completes normally. Updating MutableStateFlow does not require a collector. Its value is a snapshot, so it is useful for a current selection, loading status, or immutable screen model. A read-only StateFlow prevents callers from directly assigning through that interface; the owner retains the mutable reference."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Equality determines whether a new value is distinguishable. Assigning an equal value does not notify collectors, and a slow collector can skip intermediate changes. StateFlow therefore describes current state rather than a complete transition history. Immutable data classes and replacement values make changes visible; mutating a list inside an existing state object can defeat equality-based observation. update performs an atomic read-modify-write, but its lambda may run repeatedly under contention and should have no external side effects."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.flow.MutableStateFlow\nimport kotlinx.coroutines.flow.StateFlow\nimport kotlinx.coroutines.flow.asStateFlow\nimport kotlinx.coroutines.flow.update\n\ndata class BasketState(val itemCount: Int = 0)\n\nclass Basket {\n    private val mutable = MutableStateFlow(BasketState())\n    val state: StateFlow<BasketState> = mutable.asStateFlow()\n\n    fun addItem() {\n        mutable.update { previous ->\n            previous.copy(itemCount = previous.itemCount + 1)\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "stateIn converts an upstream flow into shared state with a single upstream collection. Its scope owns the sharing work, while its SharingStarted policy controls when that work runs. WhileSubscribed can stop upstream after subscribers disappear and later restart it. By default the cached value remains available; stopping collection is not the same as erasing state. A StateFlow object remains reachable according to ordinary reference lifetime, even after its producer scope has been cancelled."
            }
          ]
        },
        {
          "type": "checkpoint",
          "prompt": "Does StateFlow deliver every state update to each collector?",
          "runs": [
            {
              "text": "No. StateFlow represents the current state. Equality-based conflation suppresses equal values, and a slow collector can skip intermediate values. It is suitable when rendering the latest state; a requirement to process every event needs a different delivery and retention design."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "StateFlow API",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/",
          "description": "Current values, equality-based conflation, and immutable state observation."
        },
        {
          "title": "Atomic StateFlow update",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/update.html",
          "description": "Atomic updates and repeated evaluation of the update function."
        },
        {
          "title": "stateIn",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/state-in.html",
          "description": "The sharing scope and upstream collection lifecycle."
        },
        {
          "title": "WhileSubscribed",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-sharing-started/-companion/-while-subscribed.html",
          "description": "Stop timeout and replay expiration are separate policies."
        }
      ]
    },
    {
      "id": "coroutines-24",
      "title": "SharedFlow: broadcast and retention",
      "summary": "Specify replay, subscriber lag, and loss before choosing an event stream.",
      "stage": "STREAMS AND STATE",
      "group": "STREAMS AND STATE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "SharedFlow broadcasts values to active subscribers and has no required initial value. It is hot: subscribers observe a shared instance rather than each starting a producer. Its replay parameter controls how many recent values a new subscriber receives. Replay is retained history, not an acknowledgement protocol. Replaying a navigation request or payment notification can repeat an action unless the consumer’s contract explicitly handles repeated values."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "extraBufferCapacity allows existing slow subscribers to lag behind a producer. When that buffer fills, SUSPEND applies backpressure, DROP_OLDEST sacrifices older buffered values, and DROP_LATEST sacrifices the incoming value. These settings express acceptable loss under load. They do not create durable storage, and subscriber cancellation can still interrupt handling after receipt. A requirement for confirmed processing needs an explicit acknowledgement or persistent domain record."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.flow.MutableSharedFlow\nimport kotlinx.coroutines.flow.SharedFlow\nimport kotlinx.coroutines.flow.asSharedFlow\n\ndata class Telemetry(val temperature: Int)\n\nclass TelemetryBus {\n    private val mutable = MutableSharedFlow<Telemetry>(\n        replay = 1,\n        extraBufferCapacity = 2\n    )\n    val readings: SharedFlow<Telemetry> = mutable.asSharedFlow()\n\n    suspend fun publish(reading: Telemetry) {\n        mutable.emit(reading)\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "With no subscribers, only replay values are retained; extra buffer capacity is unused and emit does not wait for a future listener. A default MutableSharedFlow() has neither replay nor additional buffering, so a no-subscriber emission is lost immediately. Its tryEmit can return true in that case even though nobody received the value. Successful emission means the configured stream operation succeeded, not that application handling completed. shareIn provides a scope-owned broadcast of a cold upstream; retention and upstream start policy still need separate decisions."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "SharedFlow API",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/",
          "description": "Replay, buffering, no-subscriber behavior, and broadcast delivery."
        },
        {
          "title": "Android StateFlow and SharedFlow",
          "url": "https://developer.android.com/kotlin/flow/stateflow-and-sharedflow",
          "description": "Sharing cold producers and choosing an external sharing scope."
        }
      ]
    },
    {
      "id": "coroutines-25",
      "title": "ViewModel loading and stale results",
      "summary": "Own requests in the screen model and make replacement behavior explicit.",
      "stage": "ANDROID LIFETIME",
      "group": "ANDROID LIFETIME",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A ViewModel can own work whose result belongs to a screen model across configuration changes. The default viewModelScope uses Main.immediate and supervised children, and is cancelled when that ViewModel is cleared. A ViewModel constructed with a custom scope needs that scope’s execution and failure policy considered explicitly. The ViewModel should expose immutable UI state and accept user actions; a view subscribes and renders. A request that must survive this owner needs a different explicitly managed lifetime. Launching in a broader scope merely to avoid cancellation changes the product behavior and resource ownership."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A suspend declaration does not make blocking I/O safe on the main thread. In this Android example, CatalogRepository.load is a main-safe, cancellation-cooperative API supplied by the project. A blocking implementation moves its blocking operation to an injected dispatcher with withContext. refresh is called on Main, so request IDs, job replacement, and state publication are confined to the same thread."
            }
          ]
        },
        {
          "type": "code",
          "code": "import androidx.lifecycle.ViewModel\nimport androidx.lifecycle.viewModelScope\nimport java.io.IOException\nimport kotlinx.coroutines.CancellationException\nimport kotlinx.coroutines.Job\nimport kotlinx.coroutines.currentCoroutineContext\nimport kotlinx.coroutines.ensureActive\nimport kotlinx.coroutines.flow.MutableStateFlow\nimport kotlinx.coroutines.flow.asStateFlow\nimport kotlinx.coroutines.launch\n\ninterface CatalogRepository {\n    suspend fun load(query: String): List<String>\n}\n\nsealed interface CatalogState {\n    data object Idle : CatalogState\n    data object Loading : CatalogState\n    data class Ready(val items: List<String>) : CatalogState\n    data object Unavailable : CatalogState\n}\n\nclass CatalogViewModel(private val repository: CatalogRepository) : ViewModel() {\n    private val mutable = MutableStateFlow<CatalogState>(CatalogState.Idle)\n    val state = mutable.asStateFlow()\n    private var request: Job? = null\n    private var generation = 0L\n\n    fun refresh(query: String) {\n        val id = ++generation\n        request?.cancel()\n        request = viewModelScope.launch {\n            mutable.value = CatalogState.Loading\n            try {\n                val items = repository.load(query)\n                currentCoroutineContext().ensureActive()\n                if (id == generation) mutable.value = CatalogState.Ready(items)\n            } catch (cancelled: CancellationException) {\n                throw cancelled\n            } catch (unavailable: IOException) {\n                currentCoroutineContext().ensureActive()\n                if (id == generation) mutable.value = CatalogState.Unavailable\n            }\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Cancellation asks obsolete work to stop; it cannot undo a completed remote action. The active-job check and generation comparison guard publication, including an ordinary exception returned after an obsolete request was cancelled. Handling IOException describes an expected failure while allowing programming faults to surface. A latest-request policy also needs an error-path guard: protecting only successful results still permits an old failure to replace a newer success. This design assumes main-confined entry points; concurrent callers would require serialization or synchronization."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Android coroutine best practices",
          "url": "https://developer.android.com/kotlin/coroutines/coroutines-best-practices",
          "description": "Main-safe repository APIs, dispatcher injection, cancellation, and ViewModel ownership."
        },
        {
          "title": "withContext",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html",
          "description": "Context changes and cancellable return to the caller."
        },
        {
          "title": "ViewModel scoping APIs",
          "url": "https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-apis",
          "description": "The selected ViewModelStoreOwner determines the screen model lifetime."
        },
        {
          "title": "Lifecycle-aware coroutine scopes",
          "url": "https://developer.android.com/topic/libraries/architecture/coroutines",
          "description": "Default ViewModel ownership and the option to inject a custom scope."
        }
      ]
    },
    {
      "id": "coroutines-26",
      "title": "Lifecycle-aware collection in Views and Compose",
      "summary": "Coordinate rendering subscriptions with visibility and upstream sharing.",
      "stage": "ANDROID LIFETIME",
      "group": "ANDROID LIFETIME",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A screen model’s lifetime and a rendered view’s lifetime differ. A Fragment can retain its ViewModel while destroying and recreating its view. In a Views screen, collection that touches view bindings belongs to viewLifecycleOwner. repeatOnLifecycle starts a new child block when the owner reaches the chosen state, cancels that block below the state, and can restart it later. The outer lifecycleScope remains responsible for coordinating these transitions."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The following Android helpers assume Lifecycle runtime, Lifecycle Compose, Compose runtime, and Material 3 APIs are available in the project. bindStatus is called once for the current Fragment view, with viewLifecycleOwner and a render callback bound to that view. StatusText receives the same StateFlow in a Compose screen. The examples define their own parameter contracts and do not require a particular ViewModel class."
            }
          ]
        },
        {
          "type": "code",
          "code": "import androidx.compose.material3.Text\nimport androidx.compose.runtime.Composable\nimport androidx.compose.runtime.getValue\nimport androidx.lifecycle.Lifecycle\nimport androidx.lifecycle.LifecycleOwner\nimport androidx.lifecycle.compose.collectAsStateWithLifecycle\nimport androidx.lifecycle.lifecycleScope\nimport androidx.lifecycle.repeatOnLifecycle\nimport kotlinx.coroutines.flow.StateFlow\nimport kotlinx.coroutines.flow.collect\nimport kotlinx.coroutines.launch\n\nfun bindStatus(\n    owner: LifecycleOwner,\n    status: StateFlow<String>,\n    render: (String) -> Unit\n) {\n    owner.lifecycleScope.launch {\n        owner.repeatOnLifecycle(Lifecycle.State.STARTED) {\n            status.collect { render(it) }\n        }\n    }\n}\n\n@Composable\nfun StatusText(status: StateFlow<String>) {\n    val text by status.collectAsStateWithLifecycle()\n    Text(text)\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "For multiple independently collected streams inside repeatOnLifecycle, sibling launch blocks allow both collectors to run; consecutive collect calls would leave the second waiting behind the first. Compose’s collectAsStateWithLifecycle exposes State suitable for recomposition and normally collects at STARTED or above. Pausing a subscription does not necessarily stop the producer. A stateIn upstream using WhileSubscribed responds to subscriber counts and its stop timeout; Eagerly can continue without this screen. Re-entry may restart a cold producer, so repeated subscriptions should have deliberate resource cleanup and side-effect behavior."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Lifecycle collection with StateFlow",
          "url": "https://developer.android.com/kotlin/flow/stateflow-and-sharedflow",
          "description": "repeatOnLifecycle and separation of producer and UI collection."
        },
        {
          "title": "State and Jetpack Compose",
          "url": "https://developer.android.com/develop/ui/compose/state",
          "description": "collectAsStateWithLifecycle and lifecycle-aware conversion to Compose State."
        },
        {
          "title": "WhileSubscribed",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-sharing-started/-companion/-while-subscribed.html",
          "description": "Subscriber changes control upstream work independently of cached state."
        }
      ]
    },
    {
      "id": "coroutines-27",
      "title": "Coroutine tests and virtual time",
      "summary": "Understand scheduling control and the limits of a single test clock.",
      "stage": "TESTING",
      "group": "TESTING",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "runTest provides a test coroutine and a TestCoroutineScheduler. Delays scheduled on its test dispatchers use virtual time rather than waiting for the corresponding wall-clock duration. This supports precise assertions about a pending operation, a timeout, or a delayed transition. It does not make Thread.sleep virtual, and work on real IO or Default dispatchers can still take real time. Dispatcher injection brings the relevant scheduling decisions under test control."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "StandardTestDispatcher queues newly launched coroutines rather than immediately entering their bodies. runCurrent processes work ready at the current virtual instant. advanceTimeBy moves the clock while processing tasks before the target instant; work exactly at the target remains pending until runCurrent or another advancement executes it. advanceUntilIdle processes queued work until the relevant scheduler is idle, which is useful for final outcomes but can skip intermediate states of interest."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.ExperimentalCoroutinesApi\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.test.StandardTestDispatcher\nimport kotlinx.coroutines.test.advanceTimeBy\nimport kotlinx.coroutines.test.runCurrent\nimport kotlinx.coroutines.test.runTest\nimport kotlin.test.Test\nimport kotlin.test.assertFalse\nimport kotlin.test.assertTrue\n\n@OptIn(ExperimentalCoroutinesApi::class)\nclass VirtualTimeTest {\n    @Test\n    fun completesAtTheBoundary() = runTest {\n        val worker = StandardTestDispatcher(testScheduler)\n        var complete = false\n        launch(worker) {\n            delay(1000)\n            complete = true\n        }\n        runCurrent()\n        advanceTimeBy(1000)\n        assertFalse(complete)\n        runCurrent()\n        assertTrue(complete)\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Every test dispatcher participating in one scenario should share the same scheduler, as worker does here. Creating unrelated schedulers creates unrelated clocks and undermines assertions about relative ordering. runTest also expects owned child work to terminate. A deliberately persistent collector belongs in backgroundScope, which is cancelled when the test ends, or needs explicit cancellation and joining. Virtual-time tests explain controlled interleavings; they do not by themselves establish safety under production multithreaded contention."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "runTest",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/run-test.html",
          "description": "Virtual time, child coroutine completion, and real dispatcher limits."
        },
        {
          "title": "StandardTestDispatcher",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/-standard-test-dispatcher.html",
          "description": "Queued starts and explicit scheduler control."
        },
        {
          "title": "advanceTimeBy",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/-test-coroutine-scheduler/advance-time-by.html",
          "description": "Target-boundary scheduling semantics."
        },
        {
          "title": "TestScope backgroundScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/-test-scope/background-scope.html",
          "description": "Automatic cancellation for persistent background work."
        }
      ]
    },
    {
      "id": "coroutines-28",
      "title": "Testing failure and cancellation policies",
      "summary": "Observe ownership and outcomes at the boundary where a failure is handled.",
      "stage": "TESTING",
      "group": "TESTING",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A failure-policy test describes the relationship among child work, the combined result, and the caller. With coroutineScope, an ordinary child failure fails the group and cancels siblings. A test of that policy needs an observation that the sibling started and later cleaned up, as well as an assertion about the failure returned to the caller. A final error alone cannot distinguish correct cancellation from a child that was never started."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "supervisorScope isolates a child’s failure from sibling cancellation, but it does not automatically produce partial success. An exception thrown by await and allowed to escape the supervisor block fails that block and cancels its remaining children. An independent-results policy needs per-child handling or outcome values at the appropriate boundary. A cancellation exception should remain cancellation rather than becoming an ordinary failed outcome, so the caller retains control of the whole request."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Policy",
            "Useful observation",
            "Common false conclusion"
          ],
          "rows": [
            [
              "All results required",
              "Expected error plus sibling finally marker",
              "Catching await always prevents sibling cancellation"
            ],
            [
              "Independent results",
              "Successful sibling plus explicit failed outcome",
              "Supervision automatically handles every exception"
            ],
            [
              "Caller cancellation",
              "Cancelled parent and child cleanup completion",
              "An error value proves cancellation propagated"
            ],
            [
              "Latest request wins",
              "Old success and old ordinary failure cannot publish",
              "Testing only the newest success covers stale errors"
            ]
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "CompletableDeferred signals can mark that a fake dependency entered a particular phase. Waiting for such a signal expresses causality more clearly than guessing a delay. Cancellation tests can await entry, cancel the owner, join the job, and inspect a cleanup signal. These observations distinguish requested cancellation from completed cleanup. Test fakes should preserve the dependency contract: cooperative cancellation is the normal case, while a separate adversarial fake can illustrate a delayed ordinary failure. Unhandled child failures should remain visible to the test runner rather than be discarded by a global handler."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "coroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html",
          "description": "Grouped failure, cancellation, and completion of children."
        },
        {
          "title": "supervisorScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html",
          "description": "Child isolation and failure of the supervisor block."
        },
        {
          "title": "Testing coroutines on Android",
          "url": "https://developer.android.com/kotlin/coroutines/test",
          "description": "Controllable dispatchers and deterministic observations."
        }
      ]
    },
    {
      "id": "coroutines-37",
      "title": "Testing Flow and shared state streams",
      "summary": "Match assertions to finite sequences, current values, and subscription policies.",
      "stage": "TESTING",
      "group": "TESTING",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A flow test depends on the stream’s public promise. A finite cold flow can be collected into a list when completion is part of its contract. first can verify one value without waiting for completion, and take can bound a sequence. A stream intended to remain active should not be passed to an unbounded toList and expected to finish. Tests that consume a fixed number of values also need to ensure that the producer actually emits that many."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "For state holders, the current value is often the stable assertion. An exact list of every intermediate StateFlow assignment is usually stronger than the API promises because conflation can skip transitions. A WhileSubscribed stateIn adds another condition: merely reading value does not start its upstream. A live subscriber is necessary even when the test’s final assertion inspects only the current value."
            }
          ]
        },
        {
          "type": "code",
          "code": "import kotlinx.coroutines.ExperimentalCoroutinesApi\nimport kotlinx.coroutines.flow.MutableStateFlow\nimport kotlinx.coroutines.flow.SharingStarted\nimport kotlinx.coroutines.flow.collect\nimport kotlinx.coroutines.flow.map\nimport kotlinx.coroutines.flow.stateIn\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.test.runCurrent\nimport kotlinx.coroutines.test.runTest\nimport kotlin.test.Test\nimport kotlin.test.assertEquals\n\n@OptIn(ExperimentalCoroutinesApi::class)\nclass DerivedStateTest {\n    @Test\n    fun latestValueReflectsAnActiveUpstream() = runTest {\n        val source = MutableStateFlow(0)\n        val doubled = source.map { it * 2 }.stateIn(\n            backgroundScope,\n            SharingStarted.WhileSubscribed(),\n            0\n        )\n        backgroundScope.launch { doubled.collect {} }\n        runCurrent()\n        source.value = 7\n        runCurrent()\n        assertEquals(14, doubled.value)\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Both the sharing job and the collector above belong to backgroundScope so their intentionally persistent work is cancelled after the assertion. runCurrent establishes the subscriber before the source changes. For SharedFlow, replay tests can emit before subscription and inspect the retained values; active-delivery tests must first establish a collector. Those are different contracts. Extra buffer capacity is not evidence of offline retention, and a successful tryEmit is not evidence that a listener handled the item. A targeted stream test identifies which of these guarantees it is observing."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Testing Kotlin flows on Android",
          "url": "https://developer.android.com/kotlin/flow/test",
          "description": "Finite assertions, continuous collection, and stateIn subscribers."
        },
        {
          "title": "TestScope backgroundScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/-test-scope/background-scope.html",
          "description": "Persistent collectors and sharing jobs are cancelled at test completion."
        },
        {
          "title": "stateIn",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/state-in.html",
          "description": "Shared upstream collection and initial state."
        }
      ]
    },
    {
      "id": "coroutines-39",
      "title": "Testing ViewModel coroutine behavior",
      "summary": "Control Main and distinguish state transitions from owner lifecycle behavior.",
      "stage": "TESTING",
      "group": "TESTING",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A local ViewModel test needs control over work launched on Main. Replacing Main with a test dispatcher before constructing the ViewModel ensures that initialization and the default viewModelScope use the intended scheduler. Other injected dispatchers should share that scheduler. Restoring Main after the scenario prevents the test’s global dispatcher replacement from affecting unrelated tests. Tests that mutate Main also need isolation from other tests that mutate the same global state."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "The Android example below assumes Lifecycle ViewModel and coroutine testing APIs are present. Its model and delayed operation are defined locally, so the assertion concerns observable state rather than a hidden repository fixture. StandardTestDispatcher permits an assertion before delayed completion, while advanceUntilIdle targets the eventual state. The finally blocks cancel the instance’s work and restore Main even if an assertion fails."
            }
          ]
        },
        {
          "type": "code",
          "code": "import androidx.lifecycle.ViewModel\nimport androidx.lifecycle.viewModelScope\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.ExperimentalCoroutinesApi\nimport kotlinx.coroutines.cancel\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.flow.MutableStateFlow\nimport kotlinx.coroutines.flow.asStateFlow\nimport kotlinx.coroutines.launch\nimport kotlinx.coroutines.test.StandardTestDispatcher\nimport kotlinx.coroutines.test.advanceUntilIdle\nimport kotlinx.coroutines.test.resetMain\nimport kotlinx.coroutines.test.runCurrent\nimport kotlinx.coroutines.test.runTest\nimport kotlinx.coroutines.test.setMain\nimport kotlin.test.Test\nimport kotlin.test.assertEquals\n\nclass CountViewModel : ViewModel() {\n    private val mutable = MutableStateFlow(0)\n    val count = mutable.asStateFlow()\n    fun refresh() {\n        viewModelScope.launch {\n            delay(100)\n            mutable.value = 1\n        }\n    }\n}\n\n@OptIn(ExperimentalCoroutinesApi::class)\nclass CountViewModelTest {\n    @Test\n    fun publishesAfterLoading() {\n        val main = StandardTestDispatcher()\n        Dispatchers.setMain(main)\n        try {\n            runTest(main) {\n                val model = CountViewModel()\n                try {\n                    model.refresh()\n                    runCurrent()\n                    assertEquals(0, model.count.value)\n                    advanceUntilIdle()\n                    assertEquals(1, model.count.value)\n                } finally {\n                    model.viewModelScope.cancel()\n                }\n            }\n        } finally {\n            Dispatchers.resetMain()\n        }\n    }\n}"
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Cancelling viewModelScope explicitly is cleanup for this state test; it does not demonstrate Android clearing behavior. Clearing a ViewModelStore, destroying a Fragment view, and recreating an Activity are distinct events. A lifecycle-focused test should drive the relevant owner and observe subscription or cancellation changes at that boundary. A retained ViewModel commonly survives configuration changes, so asserting that every Activity destruction cancels its request encodes the wrong lifetime. Replacement-request tests also need an old failing request alongside the new successful one to expose stale error publication."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "Testing coroutines on Android",
          "url": "https://developer.android.com/kotlin/coroutines/test",
          "description": "Main replacement before construction, scheduler sharing, and cleanup."
        },
        {
          "title": "ViewModel scoping APIs",
          "url": "https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-apis",
          "description": "ViewModelStoreOwner scope and retained screen model lifetime."
        }
      ]
    },
    {
      "id": "coroutines-34",
      "title": "Coroutine decisions and glossary",
      "summary": "A compact reference organized around ownership, results, and stream semantics.",
      "stage": "DECISIONS AND REFERENCE",
      "group": "DECISIONS AND REFERENCE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A coroutine decision begins with the lifetime of the operation. A suspend function normally serves its caller; a launched coroutine belongs to the scope used to launch it. Scope selection therefore answers who can cancel the operation and how long its side effects remain relevant. Dispatcher selection answers where execution is scheduled. These are separate decisions: moving work to IO does not make it survive its owner."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Need",
            "Common API",
            "Contract to preserve"
          ],
          "rows": [
            [
              "One sequential result in another context",
              "withContext",
              "Caller waits; lifetime remains structured"
            ],
            [
              "Concurrent result needed later",
              "async inside an owned scope",
              "Deferred must have a result and failure policy"
            ],
            [
              "Child work as one required result",
              "coroutineScope",
              "Ordinary child failure cancels the group"
            ],
            [
              "Independently useful child results",
              "supervisorScope",
              "Each failure still needs handling"
            ],
            [
              "Fresh sequence per collection",
              "flow",
              "Collection starts the builder again"
            ],
            [
              "Observable current state",
              "StateFlow",
              "Initial value and equality-based conflation"
            ],
            [
              "Broadcast with chosen retention",
              "SharedFlow",
              "Replay and delivery loss must be acceptable"
            ]
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A Job represents lifecycle and cancellation rather than a computed value. Deferred adds a result obtained through await. A CoroutineScope supplies a context for launching children; CoroutineContext is the set of elements, such as a Job and dispatcher, that guide execution. A suspension point allows a coroutine to pause without requiring its thread to wait for the entire operation. Blocking occupies the executing thread until the call returns."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "Structured concurrency keeps child lifetimes within an explicit owner or suspending operation. Cancellation is cooperative: suspending operations and explicit checks provide opportunities to stop. Conflation retains a useful latest value while allowing intermediate values to be skipped. Backpressure slows production when consumers cannot keep up. Replay supplies retained values to a newly attached subscriber. Main-safe means an API can be called on Main without performing long blocking work there; it does not mean that all work stays on Main. These terms describe observable contracts, not performance guarantees."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "coroutineScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html",
          "description": "Lexically bounded ownership and required child work."
        },
        {
          "title": "withContext",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html",
          "description": "Sequential result and structured execution in an updated context."
        },
        {
          "title": "Kotlin Flow API",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/",
          "description": "Streams and collection contracts."
        },
        {
          "title": "Android coroutine best practices",
          "url": "https://developer.android.com/kotlin/coroutines/coroutines-best-practices",
          "description": "Main-safety and dispatcher ownership."
        }
      ]
    },
    {
      "id": "coroutines-40",
      "title": "Interview decisions and production tradeoffs",
      "summary": "Explain a coroutine design through ownership, cancellation, state, and evidence.",
      "stage": "DECISIONS AND REFERENCE",
      "group": "DECISIONS AND REFERENCE",
      "blocks": [
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A useful interview explanation connects a product requirement to an observable concurrency contract. For a search screen, “latest query wins” describes which result may render, but a complete design also identifies the screen model owner, main-safe repository calls, cancellation behavior, and handling of an obsolete request that returns late. Naming collectLatest alone leaves those questions unresolved. A design becomes easier to assess when success, ordinary failure, and caller cancellation are all described."
            }
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "For concurrent data sources, the key distinction is whether the combined result requires every source. Required siblings fit a grouped failure policy; independently useful results need explicit outcomes and failure isolation. Supervision changes propagation among children, while await can still throw into the enclosing block. A reasoned answer explains where the exception is converted, what remains cancellable, and which successful data is still meaningful after a sibling fails."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Design topic",
            "Decision to explain",
            "Evidence that fits"
          ],
          "rows": [
            [
              "Ownership",
              "Which owner cancels the work?",
              "Cancellation and cleanup observed at that boundary"
            ],
            [
              "Execution",
              "Which API makes blocking work main-safe?",
              "Injected dispatcher and thread-sensitive integration checks"
            ],
            [
              "Screen state",
              "Can intermediate values be skipped?",
              "Current-state assertions plus explicit transition requirements"
            ],
            [
              "Broadcasts",
              "What happens without subscribers?",
              "Replay and active-subscriber tests kept separate"
            ],
            [
              "Replacement",
              "Can obsolete success or failure render?",
              "Controlled completion of old and new requests"
            ],
            [
              "Concurrency",
              "Which invariant must be atomic?",
              "Synchronization reasoning and suitable contention coverage"
            ]
          ]
        },
        {
          "type": "paragraph",
          "runs": [
            {
              "text": "A virtual-time test provides evidence about controlled scheduling and state transitions. It does not establish database transactions, network cancellation support, or behavior under arbitrary real-thread contention. Those concerns call for integration checks and resource-specific reasoning. Likewise, SharedFlow buffering does not establish durable delivery, and a background dispatcher does not establish durable execution. A precise engineering explanation states the boundary of each guarantee and connects additional mechanisms, such as persistent work or acknowledged records, to requirements that cross that boundary."
            }
          ]
        }
      ],
      "sources": [
        {
          "title": "supervisorScope",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html",
          "description": "Isolation is distinct from handling awaited failures."
        },
        {
          "title": "runTest",
          "url": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/run-test.html",
          "description": "Controlled scheduling and limits when real dispatchers participate."
        },
        {
          "title": "Shared mutable state and concurrency",
          "url": "https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html",
          "description": "Atomicity and real concurrency reasoning."
        }
      ]
    }
  ],
  "groups": [
    {
      "label": "FOUNDATIONS",
      "ids": [
        "coroutines-01",
        "coroutines-02",
        "coroutines-04",
        "coroutines-05",
        "coroutines-06",
        "coroutines-07"
      ]
    },
    {
      "label": "OWNERSHIP AND BUILDERS",
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
      "label": "EXECUTION AND RESULTS",
      "ids": [
        "coroutines-17",
        "coroutines-18",
        "coroutines-19",
        "coroutines-20",
        "coroutines-38"
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
      "label": "TESTING",
      "ids": [
        "coroutines-27",
        "coroutines-28",
        "coroutines-37",
        "coroutines-39"
      ]
    },
    {
      "label": "DECISIONS AND REFERENCE",
      "ids": [
        "coroutines-34",
        "coroutines-40"
      ]
    }
  ],
  "aliases": {
    "coroutines-41": "coroutines-07",
    "coroutines-42": "coroutines-21"
  },
  "redirects": {
    "coroutines-03": "coroutines-07",
    "coroutines-29": "coroutines-01",
    "coroutines-30": "coroutines-01",
    "coroutines-31": "coroutines-01",
    "coroutines-32": "coroutines-40",
    "coroutines-33": "coroutines-40",
    "coroutines-35": "coroutines-27",
    "coroutines-36": "coroutines-28"
  }
});
