import Vue from 'vue'
import moment from 'vue-moment'
import _ from 'lodash'
import * as echarts from 'echarts'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'lib-flexible/flexible.js'
import './assets/styles/global/index.less'
import './assets/iconfonts/iconfont.css'
import './plugins/vant'
import './components/common/MedSvg/index.js'

import App from './App.vue'
import { router, store } from './permission'
import { preventWatch } from './utils/commonUtil'
import components from './plugins/components'
import business from './api/business.js'
import Bridge from './utils/bridge'
import backHelper from './utils/backHelper'
import Directives from './plugins/vue.directives'

Vue.use(moment)
Vue.use(components)
Vue.use(Directives)

Vue.prototype.$api = business
Vue.prototype.$bridge = Bridge
Vue.prototype.$echarts = echarts
Vue.prototype.$backhelper = backHelper
Vue.prototype._ = _
Vue.prototype.$preventWatch = preventWatch

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
