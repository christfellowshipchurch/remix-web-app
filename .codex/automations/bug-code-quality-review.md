# Bug & Code Quality Review (Base Branch)

You are running the scheduled "Bug & Code Quality Review (Base Branch)" automation for `remix-web-app`.

## Runtime Context

- Repository: `christfellowshipchurch/remix-web-app`
- Base branch: `${BASE_BRANCH}`
- Commit range to review: `${START_SHA}...${END_SHA}`
- Scope: base/default branch only
- Review mode: recent changes since the last successful automation run

## Objective

Detect newly introduced, high-confidence bugs in the recent changes only.

Prioritize concrete behavioral defects, runtime failures, data loss, security-impacting bugs, broken user flows, invalid assumptions, missing required error handling, or test failures introduced by the reviewed range.

Do not open PRs for:

- style-only concerns
- low-confidence concerns
- pure refactor suggestions
- speculative maintainability improvements
- issues that existed before `${START_SHA}`

## Required Process

1. Inspect the diff for `${START_SHA}...${END_SHA}` against `${BASE_BRANCH}`.
2. Identify only high-confidence bugs introduced in that range.
3. If no qualifying bug exists, stop without making code changes and report that no high-confidence bug was found.
4. For each qualifying bug, create exactly one focused fix branch and one PR.
5. Keep each PR limited to the minimum code change required to fix the bug.
6. Do not bundle unrelated fixes.
7. Run all validation commands before opening a PR:
   - `pnpm check`
   - `pnpm test`
8. Only open a PR when both validation commands pass.

## PR Policy

- Strategy: one PR per issue
- Target branch: `${BASE_BRANCH}`
- Commit message: `fix: resolve high-confidence bug in recent changes`
- PR title: `fix: <short bug description>`
- PR body:

```md
## Summary
This PR fixes a high-confidence bug introduced in recent changes detected by automated review.

## Validation
- pnpm check
- pnpm test
```

## Jira Policy

If Jira/Atlassian tools are available in this cloud environment, create a Bug ticket after opening each fix PR.

Ticket fields:

- Type: `Bug`
- Summary: `[Auto Bug Review] <short bug description>`
- Labels: `automated`, `codex`, `bug-review`
- Description:

```md
Automated bug review detected a high-confidence issue and generated a fix PR.

PR: <pr_url>
Branch: ${BASE_BRANCH}
Commit range reviewed: ${START_SHA}...${END_SHA}
```

Link the PR in the ticket when supported.

If Jira tools are not available or required project metadata is missing, mention that in the run summary, but do not block the PR.

## Output

Always provide a concise run summary:

- commit range reviewed
- whether any high-confidence bugs were found
- PR URLs opened, if any
- validation command results
- Jira ticket URLs/keys, if any
