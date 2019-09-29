const path = require('path');
const os = require('os');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack'); // 开启多cpu打包
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 15.*以后的版本需要使用VueLoaderPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('../config/index.js');

module.exports = {
  entry: utils.entries(),
  output: {
    filename: './assets/js/[name]_[hash:8].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBabel'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../css'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    // 公共js文件提取
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendors', //提取出来的文件命名
          chunks: 'initial', //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0, //表示提取公共部分最小的大小
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: 'babel-loader'
        }
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true
    })
  ].concat(utils.htmls(), utils.csss())
};
