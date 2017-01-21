var webpack = require('webpack');
var path = require('path');

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
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['', '.webpack.js', '.web.js', '.js'],
        root: path.join(__dirname, 'test')
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};