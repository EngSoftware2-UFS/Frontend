import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './assets/tailwind.css'
import * as api from './services/api.js'

loadFonts()

const app = createApp(App)

app.config.globalProperties.$api = api;

app.use(router)
.use(vuetify)
.mount('#app')
