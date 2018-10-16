const { Suite } = require("benchmark");
const fs = require("fs");
const path = require("path");
// @ts-ignore
const source = require("./source.json");
// Implementations -------------------------------------------------------------
const { levenshtein: ptLev } = require("../lib");
const { get: fastLevenshtein } = require("fast-levenshtein");
const levenshtein = require("levenshtein");
const levenshteinEditDistance = require("levenshtein-edit-distance");
const levenshteinComponent = require("levenshtein-component");
const { diff: levenshteinDeltas } = require("levenshtein-deltas");
const { LevenshteinDistance: natural } = require("natural");
// -----------------------------------------------------------------------------

/**
 * @type {{hz:number,result:string,name:string}[]}
 */
const results = [];
const factory = name =>
  new Suite(name, {
    onCycle(e) {
      results.push({
        hz: e.target.hz,
        result: e.target.toString(),
        name,
      });
    },
  });

const fastLevOpts = { useCollator: true };

const tests = [
  {
    fn: ptLev.compare,
    test: factory("@pictalk/levenshtein.js"),
  },
  {
    fn: ptLev.compare_collated,
    test: factory("@pictalk/levenshtein.js (collated)"),
  },
  {
    fn: levenshteinEditDistance,
    test: factory("levenshtein-edit-distance"),
  },
  {
    fn: fastLevenshtein,
    test: factory("fast-levenshtein"),
  },
  {
    fn: (a, b) => fastLevenshtein(a, b, fastLevOpts),
    test: factory("fast-levenshtein (collated)"),
  },
  {
    fn: levenshtein,
    test: factory("levenshtein"),
  },
  {
    fn: levenshteinComponent,
    test: factory("levenshtein-component"),
  },
  {
    fn: levenshteinDeltas,
    test: factory("levenshtein-deltas"),
  },
  {
    fn: natural,
    test: factory("natural"),
  },
];

tests.forEach(({ fn, test }) => {
  test.add(() => {
    let prev = "";
    for (let i = 0, l = source.length; i < l; prev = source[i], i += 1) {
      fn(prev, source[i]);
    }
  });
});

for (let { test } of tests) {
  test.run();
}

// Swap a,b for descending order
results.sort((b, a) => a.hz - b.hz);
console.log(results.map(r => `[${r.name}]: ${r.result}`).join("\n"));

fs.writeFileSync(
  path.join(__dirname, "results.json"),
  JSON.stringify(results, null, 2),
);
