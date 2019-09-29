const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const manifest = require('./dist/dll/vendor-manifest.json');

module.exports = merge(baseWebpackConfig, {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest
    })
  ]
});
