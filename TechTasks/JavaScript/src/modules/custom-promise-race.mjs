/**
 * Write your own implementation of the promiseRace(promises) function,
 * which works the same way as the built-in `Promise.race` method.
 *
 * What `Promise.race` does:
 * - Accepts an array of promises.
 * - Returns a new Promise that:
 *   1. Resolves or rejects as soon as any one of the promises in the array resolves or rejects.
 *   2. Returns the value or reason from that first settled promise (whether fulfilled or rejected).
 *   3. Ignores all other promises after the first one settles.
 *
 * Your implementation should:
 * - Handle non-array inputs by rejecting with a TypeError.
 * - Handle empty arrays by returning a Promise that never settles.
 * - Work with both resolving and rejecting promises.
 */

function promiseRace(promises) {
  // Implement it here

  if (!Array.isArray(promises)) {
    return Promise.reject(
      new TypeError("promiseRace expects an array of promises")
    );
  }

  // For empty array, return a promise that never settles
  if (!promises.length) {
    return new Promise(() => {});
  }

  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      // Ensure input is a promise and handle its resolution or rejection
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}

function fetchDataFromServer1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Server1: Success"), 2000);
  });
}

function fetchDataFromServer2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Server2: Error"), 1000);
  });
}

function fetchDataFromServer3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Server3: Success"), 3000);
  });
}

// Test your implementation
promiseRace([
  fetchDataFromServer1(),
  fetchDataFromServer2(),
  fetchDataFromServer3(),
])
  .then((result) => console.log("First settled promise:", result))
  .catch((error) => console.log("First settled promise failed:", error));

// Additional test cases
promiseRace([]).then(
  () => console.log("Empty array resolved"),
  () => console.log("Empty array rejected")
);

promiseRace("not an array").catch((error) =>
  console.log("Invalid input:", error.message)
);
