# Android Interview Field Guide

A mobile-first, dependency-free study website with 99 concise lessons across Kotlin, data structures, algorithms, Android (Views and Compose), and mobile system design.

Each lesson has a Kotlin example, a practical use case, a pitfall, a revealable interview answer, and an immediate-feedback quiz. The algorithms section also includes a step-through binary search lab. Reviewed lessons and light/dark/system preferences stay in local browser storage.

## Study guides

- [Kotlin coroutines study guide (PDF)](docs/study-guides/kotlin-coroutines-study-guide.pdf) - A 42-page guide to suspension, structured concurrency, cancellation, Flow, Android lifecycles, and testing, with a five-week study plan and worked exercises.

## Run offline

In the web app, select **Kotlin Primer**, then **Open coroutines study guide** near the top. The PDF opens in a new tab and is available offline after “Ready for offline study.” Keep the `docs/` directory with any local copy.

Open `index.html` directly in a browser. Keep the sibling CSS and JavaScript files together. No installation, CDN, API, or network is required to study. Copying code may require manual selection when clipboard permissions are unavailable.

For service-worker caching and a local preview:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173 and wait for “Ready for offline study.” The service worker needs localhost or HTTPS and one successful load before offline visits. Reference links need internet. Browser storage eviction or clearing site data removes cached files and progress. Keep a local copy for reliable long-term offline access. Private hosted authentication may require connectivity; the local copy does not.

## Develop and validate

Node is only needed for development checks and packaging. The shipped site remains plain HTML, CSS, and JavaScript.

```sh
npm ci
npm test
npm run build
```

`dist/` contains only the fourteen public assets, including the PDF. `jsdom` is a development-only test dependency. Tests execute all 99 lessons, quiz answers, theme changes, local progress, navigation, binary-search outcomes, and service-worker cache/fallback contracts, and PDF link/packaging/offline behavior. They do not replace real-device visual or offline-browser testing. Kotlin examples are statically reviewed teaching snippets, not an executable Android project; Android examples omit imports and app-specific setup.

Content lives in `content-kotlin.js` and `content-android.js`; official references appear under each primer. Keep section/lesson IDs stable to preserve saved progress. Bump the cache name in `sw.js` and the asset URL version in both `index.html` and the worker asset list whenever shipped assets change. Versioned URLs prevent an older cache from hiding new content. Serve all assets together. No analytics or remote calls are made by the study app.

On browsers exposing `document.modelContext`, an optional `set_current_lesson_reviewed` tool mirrors the visible review button. Its contract is tested with a mock registry; registration in a live WebMCP-enabled browser has not been verified.

## Coverage review

The initial 32-lesson refresher was expanded to 99 lessons after two reviews: 19 Kotlin, 12 data structures, 19 algorithms, 28 Android, and 21 mobile system design. See [CONTENT_REVIEW.md](CONTENT_REVIEW.md) for the gap assessment, scope, sources and practice method. Reading completion is not a readiness certificate; use the applied drills and tailor specialist study to the target role.
