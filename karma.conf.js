var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      'test/index.js'
    ],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    reporters: ['dots'],
    webpack: {
      devtool: 'source-map'
    },
    webpackServer: {
      noInfo: true
    }
  });
};