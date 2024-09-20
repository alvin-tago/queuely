import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Home from './Home.vue'
import Admin from './Admin.vue'
import NumberDisplay from './NumberDisplay.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { db } from './firebase'

const routes = [
  { path: '/', component: Home },
  { path: '/admin', component: Admin },
  { path: '/number-display', component: NumberDisplay }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.config.globalProperties.$db = db
app.use(router)
app.mount('#app')

router.afterEach((to) => {
  if (to.path === '/admin') {
    document.title = "Queuely Admin";
  } else {
    document.title = "Queuely";
  }
})
