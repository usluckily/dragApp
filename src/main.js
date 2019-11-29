import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'    

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.css'
import './assets/css/element-reset.css'

Vue.config.productionTip = false
Vue.use(elementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
