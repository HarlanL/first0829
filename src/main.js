import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'

import './assets/fonts/iconfont.css'

import axios from 'axios'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 给axios配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// axios 请求拦截器
axios.interceptors.request.use(config => {
  // config：axios的配置对象，具体是axios大对象 内部的子级成员
  // console.dir(axios)
  // console.dir(config)
  // 把token绑定到axios的身上 通过请求头实现
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, error => {
  return Promise.reject(error)
})
Vue.prototype.$http = axios
// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
