import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './assets/tailwind.css'
import * as api from './services/api.js'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

loadFonts()

const app = createApp(App)

app.config.globalProperties.$api = api;
app.config.globalProperties.$user = null;

app.use(router)
.use(ToastPlugin)
.use(vuetify)
.mount('#app')
