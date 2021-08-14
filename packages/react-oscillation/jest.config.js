export default {
  resetMocks: true,
  collectCoverage: true,
  transform: {},
  moduleNameMapper: {
    // expects build artifacts
    oscillation$: '<rootDir>/../oscillation/build',
  },
};
