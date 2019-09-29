const golb = require('glob');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PAGES_PATH = path.resolve(__dirname, '../app/pages/');

exports.entries = () => {
  const pages = {};
  golb.sync(PAGES_PATH + '/*/main.js').forEach(filepath => {
    const pageName = path.basename(path.dirname(filepath));
    pages[pageName] = filepath;
  });
  console.log(pages);
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
        chunks: [pageName],
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
