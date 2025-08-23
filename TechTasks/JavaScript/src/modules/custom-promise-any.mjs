/**
 * Write your own implementation of the promiseAny(promises) function,
 * which works the same way as the built-in `Promise.any` method.
 *
 * What `Promise.any` does:
 * - Accepts an array of `promises'.
 * - Returns a new Promise, which:
 * 1. Resolves to the value of the first successfully completed Promise in the array.
 * 2. It is rejected with a general error if all Promises in the array failed.
 */

function promiseAny(promises) {
  // Code implementation

  if (!Array.isArray(promises)) {
    throw new Error(` ${promises} is not an array`);
  }

  return new Promise((resolve, reject) => {
    let rejectionCount = 0;

    promises.forEach((promise) => {
      // Ensure input is a promise
      Promise.resolve(promise)
        .then(resolve)
        .catch(() => {
          rejectionCount++;

          if (rejectionCount === promises.length) {
            reject("All promises were rejected");
          }
        });
    });
  });
}

function fetchDataFromAPI1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("API1: Error"), 2000);
  });
}

function fetchDataFromAPI2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("API2: Success"), 1000);
  });
}

function fetchDataFromAPI3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("API3: Error"), 3000);
  });
}

promiseAny([fetchDataFromAPI1(), fetchDataFromAPI2(), fetchDataFromAPI3()])
  .then((result) => console.log("The first success promise:", result))
  .catch((error) => console.log("All results are failed:", error));
