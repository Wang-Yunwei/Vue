import Vue from 'vue'
import App from './App.vue'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './plugins/vant'
import './components/special/MedSvg'
import { router, store } from './permission'
import { entitled } from './utils/permission'
import { preventWatch } from './utils/commonUtil'

import components from './plugins/components'
import 'lib-flexible/flexible.js'
import api from './utils/http'
import Bridge from './utils/bridge'
import backHelper from '@/utils/backHelper'
import Directives from './plugins/vue.directives'

import _ from 'lodash'
import moment from 'vue-moment'
import storage from 'store'

import './assets/styles/global/index.less'
import './assets/iconfonts/iconfont.css'

Vue.prototype.$preventWatch = preventWatch
Vue.prototype.$bridge = Bridge
Vue.prototype.$backhelper = backHelper
Vue.prototype.$entitled = entitled
Vue.prototype._ = _
Vue.prototype._storage = storage

Vue.use(Directives)
Vue.use(moment)
Vue.use(components)
Vue.use(api)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
