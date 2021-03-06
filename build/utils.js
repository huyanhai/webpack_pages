/*
 * @Description:webpack打包多页面基础配置
 * @Author: huyanhai
 * @since: 2019-09-27 13:47:28
 * @lastTime: 2019-10-16 10:46:06
 * @如果有bug，那肯定不是我的锅
 */

const golb = require('glob');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PAGES_PATH = path.resolve(__dirname, '../app/pages/');

exports.entries = () => {
  // 入口配置
  // 入口文件为pages目录下
  const pages = {};
  golb.sync(PAGES_PATH + '/*/main.js').forEach(filepath => {
    const pageName = path.basename(path.dirname(filepath));
    pages[pageName] = filepath;
  });
  return pages;
};

exports.htmls = () => {
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
