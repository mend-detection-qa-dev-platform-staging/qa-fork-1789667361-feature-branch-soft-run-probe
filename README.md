```yaml
# probe classification — keep in sync with the automation ProbeMeta record
ecosystem: js
pm: npm
features:
  - feature-branch-scan
  - soft-run-isolation
mend_config:
  - config-mode-auto
jira: SCA-6738
```

# feature-branch-soft-run-probe

Validates that a **feature-branch ("soft run") scan stays isolated from the base
branch's Mend project** after shadow-org deprecation.

## What it tests

Feature-branch scans no longer run in a separate shadow organization. They run in the
base org and attach to the **same `GH_<repo>` project** as base-branch scans, but must
**not update project data** — statistics, KPIs, scan timestamps, the `commitId` tag.
That is the soft-run contract.

The automation scans this repo's `feature-branch`, snapshotting the Mend project
immediately before the trigger commit and again after the scan completes, then asserts:

- **same project** — same `uuid`/`name`, and no second project created for the branch;
- **project data unchanged** — every leaf field of the BFF project summary is identical
  before vs after.

The same scan is repeated under several `.whitesource` settings, because the isolation
was reported as config-dependent: with `enableReachability: true` a feature-branch scan
updated the base project exactly like a base scan. The point is not what the scan
*finds* — it is how the platform *classifies* the scan.

## Contents

- `package.json` / `package-lock.json` — one dependency, `lodash@4.17.20`, pinned at a
  version with known CVEs so the scan has vulnerabilities to report and reachability has
  something to analyse.
- `index.js` — a real call site for `lodash.merge`, so the `enableReachability` case is
  meaningful rather than vacuous.
- `feature.js` (on `feature-branch` only) — the content diff that makes the branch
  eligible: Mend only selects feature branches with an open PR to a base branch, and a
  branch with zero diff cannot have one.

## Mend config

`.whitesource` uses `configMode: AUTO` and ships **no** `whitesource.config`: this probe
needs no Unified Agent parameter, and `LOCAL` without a `whitesource.config` fails the
"Mend Configuration Change" check. The per-case settings under test
(`scanSettings.enableReachability`, `scanSettings.includeDevDependencies`,
`checkRunSettings.strictMode`) are written into the fork at scan time by the automation,
not committed here — one probe covers the whole matrix.
