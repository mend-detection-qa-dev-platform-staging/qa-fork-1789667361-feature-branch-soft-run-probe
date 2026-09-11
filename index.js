// Minimal call site so the scan has application code to analyse (reachability).
const _ = require("lodash");

function merge(target, source) {
  // lodash.merge is the sink behind CVE-2020-8203 / CVE-2021-23337-class findings.
  return _.merge(target, source);
}

module.exports = { merge };
