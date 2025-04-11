import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import commonDirectives from './directive/common'
Vue.use(commonDirectives)
import components from './plugins/components'
Vue.use(components)
import Print from 'vue-print-nb'
Vue.use(Print)
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)

import './utils/svg' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import { _permission } from './utils/permissions'
import { preventWatch } from './utils/commonUtil'

import { commonMixin } from '@/layout/mixin/commonMixins'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)
Vue.mixin(commonMixin)

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$preventWatch = preventWatch
Vue.prototype._permission = _permission

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
