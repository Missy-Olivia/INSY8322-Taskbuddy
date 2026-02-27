import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useTasksStore } from './stores/tasks'
import { useTheme } from './composables/useTheme'
import { useZoom } from './composables/useZoom'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

useTheme().initTheme()
useZoom().initZoom()
useAuthStore().loadFromStorage()
useTasksStore().loadFromStorage()

app.mount('#app')
