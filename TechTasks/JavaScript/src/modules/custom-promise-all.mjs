/**
 * Write your own implementation of the promiseAll(promises) function,
 * which works the same way as the built-in `Promise.all` method.
 *
 * What `Promise.all` does:
 * - Accepts an array of promises.
 * - Returns a new Promise that:
 *   1. Resolves when all promises in the array have resolved, returning an array of their resolved values in the same order.
 *   2. Rejects as soon as any promise in the array rejects, with the reason of the first rejected promise.
 *   3. Ignores remaining promises after a rejection.
 *
 * Your implementation should:
 * - Handle non-array inputs by rejecting with a TypeError.
 * - Handle empty arrays by resolving with an empty array.
 * - Preserve the order of resolved values corresponding to the input promises.
 * - Work with both resolving and rejecting promises.
 */

function promiseAll(promises) {
  // Implement it here

  if (!Array.isArray(promises)) {
    return Promise.reject(
      new TypeError("promiseAll expects an array of promises")
    );
  }

  if (!promises.length) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let resolvedCount = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          resolvedCount++;

          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        });
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
    setTimeout(() => resolve("Service2: Success"), 1000);
  });
}

function fetchDataFromService3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Service3: Error"), 3000);
  });
}

// Test your implementation
promiseAll([fetchDataFromService1(), fetchDataFromService2()])
  .then((results) => console.log("All resolved promises:", results))
  .catch((error) => console.log("Error:", error));

promiseAll([
  fetchDataFromService1(),
  fetchDataFromService2(),
  fetchDataFromService3(),
])
  .then((results) => console.log("All resolved promises:", results))
  .catch((error) => console.log("Error:", error));

// Additional test cases
promiseAll([]).then((results) => console.log("Empty array results:", results));

promiseAll("not an array").catch((error) =>
  console.log("Invalid input:", error.message)
);
