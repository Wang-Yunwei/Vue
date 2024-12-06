import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import MedicalUI from 'medical-ui'
import Print from 'vue-print-nb'
import bootstrap from './core/bootstrap'
import './core/use'
import './utils/http'
import './permission'
import './utils/filter'
import './assets/styles/global.less'
import './assets/iconfonts/iconfont.css'
import 'medical-ui/lib/medical-ui.css'

Vue.use(MedicalUI)
Vue.use(Print)
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
