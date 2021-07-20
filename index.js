// const f = debounce(console.log, 1000)
// f(1);
// f(2);
// setTimeout(() => f(3), 100)
// setTimeout(() => f(4), 500)
// setTimeout(() => f(5), 1100)

// function debounce(callback, delay) {
//     let timer;
//     return function (...args) {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             callback.apply(this, args)
//         }, delay);
//     }
// }

//! Implement this
class Debouncer {
  constructor(timeout) {
    this.timeout = timeout;
    this.functionMap = {};
  }
  // -- Tests --
  // Run this file to see if the tests pass.
  //
  run(callback) {
    const timeoutID = this.functionMap[callback.name];
    if (timeoutID) {
      clearTimeout(timeoutID);
      this.functionMap[callback.name] = setTimeout(() => {
        delete this.functionMap[callback.name];
        callback();
      }, this.timeout);
    } else {
      this.functionMap[callback.name] = setTimeout(callback, this.timeout);
    }
  }

  cancel(callback) {
    const timeoutID = this.functionMap[callback.name];
    if (timeoutID) {
      clearInterval(timeoutID);
      delete this.functionMap[callback.name];
    }
  }
}

const assert = require("assert").strict;

runTestCases();

async function runTestCases() {
  const debouncer = new Debouncer();

  const tests = [
    async () => {
      // Calling bumpCounter1 4 times in a row, in less than a second.
      // Only the last one should actually run.
      debouncer.run(bumpCounter1);
      debouncer.run(bumpCounter1);
      debouncer.run(bumpCounter1);
      debouncer.run(bumpCounter1);
      await sleep(1500);
      assert.equal(counter1, 1, "bumpCounter1 should have ran 1 time.");
    },
    async () => {
      debouncer.run(bumpCounter2);
      await sleep(1500);
      // We've waited more than 1 second before calling bumpCounter2 again,
      // so it should run again.
      debouncer.run(bumpCounter2);
      await sleep(1500);
      assert.equal(counter2, 2, "bumpCounter2 should have ran 2 times.");
    },
    async () => {
      // Calling bumpCounter3 twice without waiting. should run once.
      debouncer.run(bumpCounter3);
      debouncer.run(bumpCounter3);
      // Calling bumpCounter4 twice without waiting. should run once.
      debouncer.run(bumpCounter4);
      debouncer.run(bumpCounter4);
      await sleep(1500);
      assert.equal(counter3, 1, "bumpCounter3 should have ran 1 time.");
      assert.equal(counter4, 1, "bumpCounter4 should have ran 1 time.");
    },
  ];

  for (let [i, testCase] of tests.entries()) {
    try {
      await testCase();
      console.log(`Test case ${i + 1} passed: `);
    } catch (e) {
      console.error(`Test case ${i + 1} failed: `, e.message);
    }
  }
  console.log("Tests finished.");
}

let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let counter4 = 0;
function bumpCounter1() {
  counter1 += 1;
}
function bumpCounter2() {
  counter2 += 1;
}
function bumpCounter3() {
  counter3 += 1;
}
function bumpCounter4() {
  counter4 += 1;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
