import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import JsonExcel from 'vue-json-excel'
import Print from 'vue-print-nb'
import moment from 'vue-moment'

import App from './App'
import store from './store'
import router from './router'
import * as filters from './filters'
import Business from './api/business'
import components from './components'

import 'normalize.css/normalize.css'
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'
import '@/assets/fonts/iconfont.css'
import './utils/svg'
import './permission'
import './utils/error-log'

Vue.component('downloadExcel', JsonExcel)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})
Vue.use(Print)
Vue.use(moment)
Vue.use(components)

Vue.prototype.$api = Business

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
