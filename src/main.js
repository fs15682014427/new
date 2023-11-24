import { createApp } from 'vue'
import router from '@/router'
import '@/style/index.scss'
import './style.css'
import App from '@/App.vue'
import pinia from './store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import i18n from './locales'
import vuetyped from 'vue3typed'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(vuetyped)
app.use(i18n)
app.use(router)
app.use(pinia)
app.mount('#app')
