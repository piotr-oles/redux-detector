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
   // new webpack.optimize.OccurrenceOrderPlugin(),
   //  new webpack.DefinePlugin({
   //    'process.env.NODE_ENV': JSON.stringify(env)
   //  })
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
      }
    ]
  },

  externals: {}
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

  config.externals['redux'] = 'Redux';
}

if ('production' !== env) {
  config.performance = {
    hints: false
  };
}

module.exports = config;
