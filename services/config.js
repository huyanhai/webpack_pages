/*
 * @Description: 环境变量配置信息
 * @Author: hyh
 * @since: 2019-05-29 09:58:28
 * @lastTime: 2019-09-30 16:10:07
 */

export const CONFIG = {
  baseUrl:
    process.env.NODE_ENV === 'mock'
      ? ''
      : process.env.NODE_ENV == 'development'
      ? 'http://127.0.0.1:3000'
      : 'http://127.0.0.1:3000',
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
};
console.log('NODE_ENV:' + process.env.NODE_ENV);
