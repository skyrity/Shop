import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'

import qs from 'qs'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
// 配置拦截器
// axios.interceptors.request.use(config => {
//   console.log('axios.config', config)
//   config.headers.Authorization = window.sessionStorage.getItem("accessToken")
//   return config
// })
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
// 注册一个全局自定义指令 `v-focus`
// Vue.directive('focus', {
//   // 当被绑定的元素插入到 DOM 中时……
//   inserted: function (el) {
//     // 聚焦元素
//     el.focus()
//   }
// })
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
