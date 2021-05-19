import Vue from 'vue'
import App from './App.vue'
import {config} from 'dotenv'
config();
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
