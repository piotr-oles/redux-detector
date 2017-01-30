var webpack = require('webpack');
var path = require('path');
var process = require('process');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    files: [
      'test/*Test.js'
    ],
    preprocessors: {
      'test/*Test.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: require('./webpack.config'),
    webpackServer: {
      noInfo: true
    }
  });
};