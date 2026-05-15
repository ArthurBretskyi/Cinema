import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/map', name: 'MapView', component: () => import('@/views/MapView.vue') },
  {
    path: '/now-in-cinemas',
    name: 'NowInCinemas',
    component: () => import('@/views/NowInCinemasView.vue'),
  },
  {
    path: '/soon-in-cinemas',
    name: 'SoonInCinemas',
    component: () => import('@/views/SoonInCinemasView.vue'),
  },
  {
    path: '/snacks',
    name: 'Snacks',
    component: () => import('@/views/SnacksListView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
