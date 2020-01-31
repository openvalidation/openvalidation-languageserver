module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/test"],
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    collectCoverage: true,
    coverageReporters: ["json-summary", "text", "lcov"],
    testPathIgnorePatterns: ["/dist/", "/types/", "/node_modules/"]
  };
  