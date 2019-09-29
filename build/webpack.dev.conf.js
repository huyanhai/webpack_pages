const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: 'localhost',
    port: 9000,
    overlay: true, //在浏览器上全屏显示编译的errors或warnings
    open: true //自动打开浏览器
  }
});
