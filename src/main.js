import Vue from 'vue'
import App from './App.vue'
import {config} from 'dotenv'
config();
Vue.config.productionTip = false

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('service.js'); //notice the file name
  return swRegistration;
} 

(async() => {
  // eslint-disable-next-line
  const swRegistration = await registerServiceWorker();
  Vue.prototype.$sw = swRegistration
})();
new Vue({
  render: h => h(App),
}).$mount('#app')
