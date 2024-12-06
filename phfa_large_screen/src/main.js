import Vue from "vue";
import less from "less";
import moment from "moment";
import "moment/locale/zh-cn";
import { VueAxios } from "./utils/request";
import * as api from '@/api/index'
import App from "./App.vue";
import router from "./router";
import components from "@/components";
import store from './store'
import './permission'
import Antd from 'ant-design-vue';
import "ant-design-vue/dist/antd.css";
import "./global.less";

Vue.config.productionTip = false;

Vue.prototype.$moment = moment;
Vue.prototype.$api = api;


Vue.use(Antd)
Vue.use(VueAxios)
Vue.use(less);
Vue.use(components);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
