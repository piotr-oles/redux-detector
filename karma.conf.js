var webpack = require('webpack');
var path = require('path');
var process = require('process');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: true,
    colors: true,
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [
      'src/**/*.ts',
      'test/**/*.spec.ts'
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['dots', 'karma-typescript'],
    karmaTypescriptConfig: {
      reports: {
        'lcovonly': {
          'directory': 'coverage',
          'subdirectory': 'lcov',
          'filename': 'lcov.info'
        },
        'html': {
          'directory': 'coverage',
          'subdirectory': 'html',
          'filename': '.'
        },
        'text': ''
      }
    }
  });
};
