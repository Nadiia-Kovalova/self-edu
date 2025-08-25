// Write a function that takes an object and builds a query string based on it.
// The number of fields is unlimited.

const input = {
  a: 1,
  b: "string",
};

// Task
// const queryStringBuilder = (parameters) => {
//   return "";
// };

// =========== Solution

const queryStringBuilder = (parameters) => {
  if (!Object.keys(parameters).length) {
    return "";
  }

  const array = Object.entries(parameters).map(
    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  );

  return `?${array.join("&")}`;

  // Advanced Solution

  // if (!parameters || Object.keys(parameters).length === 0) {
  //   return "";
  // }

  // const queryParts = [];

  // for (const [key, value] of Object.entries(parameters)) {
  //   if (value !== undefined && value !== null && value !== "") {
  //     const encodedKey = encodeURIComponent(key);
  //     const encodedValue = encodeURIComponent(value);
  //     queryParts.push(`${encodedKey}=${encodedValue}`);
  //   }
  // }

  // return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
};

// console.log("queryStringBuilder", queryStringBuilder(input)); // "?a=1&b=string"

// ============ Tests

// Test cases
const tests = [
  {
    input: { name: "John Doe", age: 30 },
    expected: "?name=John%20Doe&age=30",
    description: "Test with name and age",
  },
  {
    input: {},
    expected: "",
    description: "Test with empty object",
  },
  // {
  //   input: { city: "New York", country: "USA", zip: "" },
  //   expected: "?city=New%20York&country=USA",
  //   description: "Test with empty string value",
  // },
  {
    input: { query: "a b c", special: "#$" },
    expected: "?query=a%20b%20c&special=%23%24",
    description: "Test with special characters",
  },
  // {
  //   input: { name: "Alice", age: undefined, role: null },
  //   expected: "?name=Alice",
  //   description: "Test with undefined and null values",
  // },
];

// Run tests and display results
const resultsContainer = document.getElementById("test-results");

tests.forEach((test, index) => {
  const result = queryStringBuilder(test.input);
  const passed = result === test.expected;
  const testElement = document.createElement("div");
  testElement.className = `test-case ${passed ? "test-passed" : "test-failed"}`;
  testElement.innerHTML = `
    <strong>Test ${index + 1}: ${test.description}</strong><br>
    <pre>Input: ${JSON.stringify(test.input)}</pre>
    <pre>Expected: ${test.expected}</pre>
    <pre>Got: ${result}</pre>
    <pre>Status: ${passed ? "Passed" : "Failed"}</pre>
  `;
  resultsContainer.appendChild(testElement);
});
