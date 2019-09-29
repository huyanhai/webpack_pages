const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    vendor: [path.join(__dirname, 'app/pages/plugins/', 'index.js')]
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/dll', '[name]-manifest.json'),
      name: '[name]'
    })
  ]
};
