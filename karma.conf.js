var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      'test/*-test.js'
    ],
    preprocessors: {
      'test/*-test.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: {
      devtool: 'inline-source-map'
    },
    webpackServer: {
      noInfo: true
    }
  });
};