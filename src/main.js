import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import GlobalRules from './static/Global-rules'
import { Notification } from 'element-ui'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
axios.defaults.baseURL = GlobalRules.URL

Vue.prototype.GLOBAL = GlobalRules
Vue.prototype.openTips = function (title, text, type) {
  const h = this.$createElement;
  Notification({
    title: title,
    message: h('i', { style: 'color:teal' }, text),
    type: type
  });
};
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
