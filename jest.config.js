module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        "<rootDir>/test"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    setupFiles: [
        "./test/globals.js"
    ],
    collectCoverage: true,
    coverageReporters: [
        "json-summary",
        "text",
        "lcov"
    ],
    testPathIgnorePatterns: ["/lib/", "/node_modules/"]
}