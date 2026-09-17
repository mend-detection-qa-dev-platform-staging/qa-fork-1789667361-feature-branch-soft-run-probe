// Present only on `feature-branch`.
//
// Mend's scan runner selects base branches and feature branches with an open PR to a
// base branch, and `ensure_open_pr_for_feature_branch` cannot open a PR for a branch
// with zero diff. This file IS that diff -- it deliberately changes application code
// only, never the dependency set, so the feature-branch scan resolves exactly the same
// tree as the base-branch scan and any project-data drift is attributable to scan
// CLASSIFICATION rather than to different findings.
const { merge } = require("./index");

module.exports = function applyDefaults(options) {
  return merge({ retries: 1, verbose: false }, options || {});
};
