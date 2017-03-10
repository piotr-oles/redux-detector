var path = require('path');
var webpack = require('webpack');
var process = require('process');

var env = process.env.NODE_ENV;

var config = {
  context: __dirname,
  target: 'web',
  name: 'redux-detector',
  entry: './src/index.ts',

  output: {
    library: 'ReduxDetector',
    libraryTarget: 'umd'
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.join(__dirname, 'src'),
        options: {
          configFileName: './tsconfig.json',
          silent: false,
          visualStudioErrorFormat: true
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        include: path.join(__dirname, 'src'),
        enforce: 'pre'
      }
    ]
  },

  externals: {
    'redux': {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux'
    }
  }
};

if ('production' === env) {
  config.plugins.push(
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
  );
}

module.exports = config;
