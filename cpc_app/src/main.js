import Vue from 'vue'
import App from './App.vue'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'lib-flexible/flexible.js'
import { router, store } from './permission'
import { _permission, _resources } from './utils/permission'
import { preventWatch } from './utils/commonUtil'

import './assets/styles/global/index.less'
import './assets/iconfonts/iconfont.css'

import './plugins/vant'
import components from './plugins/components'
import api from './utils/http'
import moment from 'vue-moment'
import _ from 'lodash'
// require('echarts/lib/chart/line')
// require('echarts/lib/chart/bar')

import './components/common/MedSvg/index.js'

import Bridge from './utils/bridge'
import backHelper from './utils/backHelper'
import Directives from './plugins/vue.directives'
import * as echarts from 'echarts'
// const echarts = require('echarts')

Vue.prototype.$bridge = Bridge
Vue.prototype.$echarts = echarts
Vue.prototype.$backhelper = backHelper
Vue.prototype._ = _
Vue.prototype._permission = _permission
Vue.prototype._resources = _resources
Vue.prototype.$preventWatch = preventWatch

Vue.use(moment)
Vue.use(components)
Vue.use(api)
Vue.use(Directives)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
