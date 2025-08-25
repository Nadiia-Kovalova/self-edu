/**
 * Write your own implementation of the promiseAllSettled(promises) function,
 * which works the same way as the built-in `Promise.allSettled` method.
 *
 * What `Promise.allSettled` does:
 * - Accepts an array of promises.
 * - Returns a new Promise that:
 *   1. Resolves when all promises in the array have settled (either fulfilled or rejected).
 *   2. The resolved value is an array of objects, each describing the outcome of the corresponding promise.
 *   3. Each object has a `status` property ('fulfilled' or 'rejected') and either a `value` (if fulfilled) or a `reason` (if rejected).
 *
 * Your implementation should:
 * - Handle non-array inputs by rejecting with a TypeError.
 * - Handle empty arrays by resolving with an empty array.
 * - Work with both resolving and rejecting promises.
 * - Preserve the order of the results corresponding to the input promises.
 */

function promiseAllSettled(promises) {
  // Implement it here
  if (!Array.isArray(promises)) {
    return Promise.reject(
      new TypeError("promiseAllSettled expects an array of promises")
    );
  }

  if (!promises.length) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let settledCount = 0;

    promises.forEach((promise, index) => {
      // Ensure input is a promise
      Promise.resolve(promise).then(
        (value) => {
          results[index] = {
            status: "fulfilled",
            value,
          };
          settledCount++;
          if (settledCount === promises.length) {
            resolve(results);
          }
        },
        (error) => {
          results[index] = {
            status: "rejected",
            reason: error,
          };
          settledCount++;
          if (settledCount === promises.length) {
            resolve(results);
          }
        }
      );
    });
  });
}

function fetchDataFromService1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Service1: Success"), 2000);
  });
}

function fetchDataFromService2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Service2: Error"), 1000);
  });
}

function fetchDataFromService3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Service3: Success"), 3000);
  });
}

// Test your implementation
promiseAllSettled([
  fetchDataFromService1(),
  fetchDataFromService2(),
  fetchDataFromService3(),
])
  .then((results) => console.log("All settled promises:", results))
  .catch((error) => console.log("Error:", error));

// Additional test cases
promiseAllSettled([]).then((results) =>
  console.log("Empty array results:", results)
);

promiseAllSettled("not an array").catch((error) =>
  console.log("Invalid input:", error.message)
);
