/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let libraryName = pkg.name;
let libraryVersion = pkg.version;

let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = libraryName + '.min.js';
} else {
  mode = 'development';
  outputFile = libraryName + '.js';
}

const config = {
  mode: mode,
  entry: ['idempotent-babel-polyfill', __dirname + '/src/index.js'],
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimize: mode === 'production',
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          mangle: {
            // eslint-disable-next-line camelcase
            keep_fnames: true,
          },
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/
          },
          compress: {
            // eslint-disable-next-line camelcase
            keep_fnames: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: mode === 'production',
      LIBRARY_VERSION: libraryVersion,
    }),
  ],
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  externals: {
    vue: 'vue',
    moment: 'moment'
  }
};

module.exports = config;
