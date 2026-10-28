# Review and delivery

Use a `codex/<descriptive-name>` feature branch for changes. Start from the latest `origin/main`, make focused milestone commits, and push the feature branch to GitHub. Open a pull request targeting `main` with a concise description of the behavior, content scope, validation, and known limits.

The repository owner reviews and merges PRs. Do not push feature changes directly to `main`, merge a PR, or publish unmerged changes to the production Site. Local previews are appropriate for review. Production publication happens after merge when requested.

Before opening or updating a PR:

```sh
npm test
npm run build
git diff --check
```

Preserve existing lesson IDs and local review history. Include shipped assets in the build and service-worker cache, and bump the cache name and versioned URLs together when assets change. Keep the site mobile-first, dependency-free at runtime, and usable offline.

For changes to the coroutines course, treat the PDF as a reference, not a copy contract. Author independent informational chapters with accurate, concise explanations and focused examples. Avoid page-number references, lab prerequisites, exercise schedules, dependency pins, and execution claims inherited from the PDF. Define snippet dependencies locally or identify the relevant Android/API context. Verify technical guidance against primary Kotlin and Android documentation and link relevant sources in chapter footers.

Preserve conceptual lesson IDs and saved review history where possible; provide related-topic routes for removed workbook chapters. The historical PDF manifests record provenance only. Do not require rewritten prose to match PDF text hashes or update those hashes to mask changes. Keep the optional PDF's byte identity, packaging, offline behavior, and navigation tests separate from editorial validation.
