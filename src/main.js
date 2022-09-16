import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initWorker } from './worker.api.js'

initWorker()

createApp(App).mount('#app')
