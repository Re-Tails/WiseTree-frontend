module.exports = {
  transform: {
    "^.+\\.svg$": "jest-svg-transformer",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.svg.js",
    "!src/*.js"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(s?css)$": "<rootDir>/__mocks__/styleMock.js",
  },
  setupFiles: [
    "./src/setupTests.js"
  ],
  watchPathIgnorePatterns: [
    "node_modules"
  ],
};
