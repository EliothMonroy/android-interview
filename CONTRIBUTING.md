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

For changes to the coroutines course, preserve the complete source content or explain intentional changes in the PR. The PDF manifest test checks rendered text, code, table counts, and resource links for every source page. Updating the source PDF requires re-extracting and reviewing that manifest; do not update hashes simply to hide a content regression.
