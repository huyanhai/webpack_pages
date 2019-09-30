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
