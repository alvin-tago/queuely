import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Home from './Home.vue'
import Admin from './Admin.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { db } from './firebase'

const routes = [
  { path: '/', component: Home },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.config.globalProperties.$db = db
app.use(router)
app.mount('#app')

// 保持前台不变
if (window.location.pathname === '/admin') {
  document.title = "Queuely Admin";
} else {
  document.title = "Queuely";
}
