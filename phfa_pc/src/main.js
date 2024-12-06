import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import Echarts from 'echarts'

import 'normalize.css/normalize.css'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'
import './utils/svg'
import './permission'
import './utils/error-log'

import App from './App'
import store from './store'
import router from './router'
import components from './components'
import readonlyDirective from './directive/readonly'
import { commonMixin } from '@/layout/mixin/commonMixins'

Vue.use(components)
Vue.use(readonlyDirective)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

Vue.mixin(commonMixin)

Vue.prototype.$echarts = Echarts

Vue.config.productionTip = false // 设置是否在生产环境中显示提示信息

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
