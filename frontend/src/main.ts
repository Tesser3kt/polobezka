import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import AnimatedNumber from 'vue-3-animated-number'

import './scss/styles.scss'

import { Modal } from 'bootstrap'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(AnimatedNumber)

app.mount('#app')
