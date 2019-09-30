import Vue from 'vue';
import App from './index.vue';
import axios from '../../../services/index';
import '../../../mock/mock';

Vue.prototype.$ajax = axios;
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  render: h => h(App)
});
