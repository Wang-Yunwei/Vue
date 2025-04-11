// import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './utils/svg' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import components from './plugins/components'
import permissions from '@/directive/permission'
import editRules from '@/directive/form-editor'

import * as echarts from 'echarts'
import JsonExcel from 'vue-json-excel'

import { commonMixin } from '@/layout/mixin/commonMixins'
Vue.mixin(commonMixin)

Vue.component('downloadExcel', JsonExcel)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.use(components)
Vue.use(permissions)
Vue.use(editRules)
Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
Vue.prototype.$eventBus = new Vue()

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
