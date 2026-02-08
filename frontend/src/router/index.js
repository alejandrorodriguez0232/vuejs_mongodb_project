import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home - User Management' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: 'About - MERN Vue App' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'MERN + Vue.js App'
  next()
})

export default router
