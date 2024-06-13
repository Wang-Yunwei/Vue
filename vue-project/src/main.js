import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import localforage from 'localforage';
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import './assets/element-ui-reset.scss'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(localforage)
app.use(ElementPlus)

app.mount('#app')