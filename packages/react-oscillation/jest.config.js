export default {
  resetMocks: true,
  collectCoverage: true,
  transform: {
    "\\.js$": "./jest.transform.js",
  },
  moduleNameMapper: {
    // expects build artifacts
    oscillation$: "<rootDir>/../oscillation/build",
  },
};
