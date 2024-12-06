import Vue from 'vue'
import Es6Promise from 'es6-promise'
import moment from 'vue-moment'

import '@babel/polyfill'
import 'lib-flexible/flexible.js'
import './assets/styles/index.less'
import './assets/iconfonts/iconfont.css'
import './plugins/vant'
import './plugins/iview'
import './plugins/vueBaiduMap'
import './components/common/MedSvg/index'

import App from './App.vue'
import { router, store } from './permission'
import components from './plugins/components'
import { preventWatch, clearNull } from './utils/functions'
import business from './api/business'
import Bridge from './utils/bridge'

require('es6-promise').polyfill()
Es6Promise.polyfill()

Vue.prototype.$bus = new Vue() // 事件总线
Vue.prototype.$preventWatch = preventWatch
Vue.prototype.clearNull = clearNull
Vue.prototype.$api = business
Vue.prototype.$bridge = Bridge

Vue.use(moment)
Vue.use(components)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount('#app')
