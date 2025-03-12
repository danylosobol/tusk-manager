import { createRouter, createWebHistory } from 'vue-router'
import { loadRoutes } from './routes'

const routes = await loadRoutes()
export const router = createRouter({
  history: createWebHistory(),
  routes,
})
