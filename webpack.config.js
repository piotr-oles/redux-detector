var path = require('path');
var webpack = require('webpack');
var process = require('process');

var env = process.env.NODE_ENV;

module.exports = {
  context: __dirname,
  target: 'web',
  name: 'redux-detector',
  entry: './src/index.ts',

  output: {
    library: 'ReduxDetector',
    libraryTarget: 'umd'
  },

  devtool: 'source-map',

  tslint: {
    emitErrors: true
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    root: path.join(__dirname, 'src')
  },

  plugins: [
   // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ].concat(
    env === 'production' ?
      [
        new webpack.optimize.UglifyJsPlugin({
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

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        include: path.join(__dirname, 'src')
      }
    ],

    preLoaders: [
      {
        test: /\.tsx?$/,
        loader: 'tslint',
        include: path.join(__dirname, 'src')
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        include: path.join(__dirname, 'src')
      }
    ]
  },

  externals: {
    'redux': 'Redux'
  }
};
