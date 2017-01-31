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
      'test/*Test.js': ['webpack', 'sourcemap'],
      'src/index.ts': ['coverage']
    },
    reporters: ['dots', 'coverage', 'remap-coverage'],

    webpack: require('./webpack.config'),
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      type: 'in-memory'
    },
    remapCoverageReporter: {
      'text-summary': null,
      html: './coverage/html',
      cobertura: './coverage/cobertura.xml'
    }
  });
};