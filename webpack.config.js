'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 'webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/only-dev-server',
module.exports = {
  context: __dirname,
  entry: {
    script: ['./frontend/index.jsx'],
    styles: './frontend/index.sass'
  },
  output: {
    path: __dirname + '/public',
    // publicPath: '/',
    filename: './script/[name].js',
    chunkFilename: '[id].js'
  },

  // watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  resolve: {
    extensions: ['', '.jsx', '.sass']
  },

  devtool: NODE_ENV === 'development' ? 'source-map' : null,

  plugins: [
    new webpack.OldWatchingPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      template: './frontend/index.jade'
    }),
    new ExtractTextPlugin('./assets/styles.css', { allChunks: true}),
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: ['babel'],
        include: __dirname + '',
        exclude: [/bower_components/, /node_modules/],
        query: {
          presets: ['es2015', 'es2016', 'es2017', 'react']
        }
      },
      {
        test: /\.jade$/,
        loader: 'jade?pretty=true'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!resolve-url!sass?sourceMap')
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=../[name].[ext]'
      }
    ],

    noParse: [],

    devServer: {
      host: 'localhost',
      port: 8080,
      contentBase: __dirname + '/public',
      hot: true
    }
  }
};

if (NODE_ENV === 'build') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  );
  module.exports.entry.script = ['./frontend/index']
}