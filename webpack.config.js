var path = require('path');
var webpack = require('webpack');
var process = require('process');

var env = process.env.NODE_ENV;

module.exports = {
  context: __dirname,
  target: 'web',
  name: 'redux-detector',
  entry: './dist/index.js',

  output: {
    library: 'ReduxDetector',
    libraryTarget: 'umd'
  },

  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['', '.webpack.js', '.web.js', '.js'],
    root: path.join(__dirname, 'src')
  },

  plugins: [
   // new webpack.optimize.OccurrenceOrderPlugin(),
   //  new webpack.DefinePlugin({
   //    'process.env.NODE_ENV': JSON.stringify(env)
   //  })
  ].concat(
    env === 'production' ?
      [
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compressor: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
            screw_ie8: false
          },
          mangle: {
            screw_ie8: false
          },
          output: {
            screw_ie8: false
          }
        })
      ] :
      []
  ),

  externals: {
    'redux': 'Redux'
  }
};
