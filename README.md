# webpack_pages

webpack 多页面脚手架

> 支持多核 cpu 打包<br>
> 支持 dll<br>
> 支持多页面打包<br>
> 支持 mock<br>
> 支持 axios<br>

初始化项目

```zsh
// 创建目录
mkdir pages
// 初始化项目配置
npm init
// 得到package.json文件

// 安装webpack和webpack-cli
npm i webpack webpack-cli -d
```

新建 build 文件夹，用来存放 webpack 打包的相关配置文件

```javascript
// webpack入口配置和输出配置函数
const golb = require('glob');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html模板提取
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css提取

const PAGES_PATH = path.resolve(__dirname, '../app/pages/');

exports.entries = () => {
  // 入口配置
  // 入口文件为pages目录下页面目录下的main.js -> pages/
  const pages = {};
  golb.sync(PAGES_PATH + '/*/main.js').forEach(filepath => {
    const pageName = path.basename(path.dirname(filepath));
    pages[pageName] = filepath;
  });
  return pages;
};

exports.htmls = () => {
  // 设置每个单页面的html模板,默认在main.js中查找html文件，如果没有找到就在template目录里面去查找html文件
  const pages = [];
  golb.sync(PAGES_PATH + '/*/main.js').forEach(filepath => {
    const pageName = path.basename(path.dirname(filepath));
    let templatePath = path.dirname(filepath) + '/index.html';
    if (!fs.existsSync(templatePath)) {
      templatePath =
        path.resolve(path.dirname(templatePath), '../../../') +
        '/template/index.html';
    }
    pages.push(
      new HtmlWebpackPlugin({
        title: '输出的html',
        filename: `${pageName}.html`,
        chunks: ['vendors', pageName],
        template: templatePath, //模板
        hash: true, // 会在打包好的js后面加上hash串,防止缓存
        minify: {
          removeAttributeQuotes: false, //压缩 去掉引号
          removeComments: false, //移除HTML中的注释
          collapseWhitespace: false //删除空白符与换行符
        }
      })
    );
  });
  return pages;
};

exports.csss = () => {
  // 对css模块进行提取
  const pages = [];
  golb.sync(PAGES_PATH + '/*/main.js').forEach(filepath => {
    const pageName = path.basename(path.dirname(filepath));
    pages.push(
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[chunkhash:8].css'
      })
    );
  });
  return pages;
};
```

```javascript
// webpack.base.conf.js
const path = require('path');
const os = require('os');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清除打包后的目录文件夹文件
const HappyPack = require('happypack'); // 开启多cpu打包
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); // 设置开启几核，这里设置的是cpu的核数
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 处理.vue文件 15.*以后的版本需要使用VueLoaderPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离css到单独文件中
const utils = require('./utils.js'); // 多页面打包入口和输出配置
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

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
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '../dist/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '../dist/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '../dist/fonts/[name].[hash:7].[ext]'
        }
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
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) // 位置webpack环境变量
      }
    }),
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
```

```javascript
// 开发环境配置webpack配置
//
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge'); // 用于合并webpack.base.conf.js的相关配置
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
```

项目接入 axios 和 mock
npm i axios mock -d

```javascript
// axios配置
export const CONFIG = {
  baseUrl:
    process.env.NODE_ENV === 'mock' // 环境变量为mock就走本地mock，否则请求线上地址
      ? ''
      : process.env.NODE_ENV == 'development'
      ? '本地地址'
      : '线上地址',
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
};
console.log('NODE_ENV:' + process.env.NODE_ENV);

// axios拦截器
import qs from 'qs';
import Axios from 'axios';
import { CONFIG } from './config';

const service = Axios.create({
  timeout: CONFIG.timeout,
  baseURL: CONFIG.baseUrl
});

service.defaults.headers = CONFIG.headers;

service.interceptors.request.use(
  config => {
    config.method === 'post'
      ? (config.data = qs.parse(config.data))
      : (config.parmes = JSON.stringify(config.data));
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const responseCode = response.status;
    if (responseCode === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data);
    }
  },
  error => {
    const responseCode = (error.response || {}).status;
    if (!error.response) {
      // 请求超时状态
      if (error.message.includes('timeout')) {
        return Promise.reject({ message: '请求超时', code: responseCode });
      } else {
        // 可以展示断网组件
        return Promise.reject({ message: error.message });
      }
    }
    switch (responseCode) {
      // 401：未登录
      case 401:
        // 跳转登录页
        return Promise.reject({ message: '网络错误', code: responseCode });
      // 403: token过期
      case 403:
        // 清除token
        localStorage.removeItem('token');
        return Promise.reject({ message: 'token过期', code: responseCode });
      // 404请求不存在
      case 404:
        return Promise.reject({ message: '页面不存在', code: responseCode });
      // 其他错误，直接抛出错误提示
      default:
        return Promise.reject({
          message: error.response.data.message,
          code: responseCode
        });
    }
  }
);

export default service;
```

```javascript
const Mock = require('mockjs');
// 拦截本地的请求地址，mock数据返回
Mock.mock('/user/userInfo', 'get', function() {
  return {
    data: ['a', 'b']
  };
});

export default Mock;
```
