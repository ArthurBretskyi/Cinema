import { useAuthStore } from '@/stores/auth'

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
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminView.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'import',
        name: 'AdminImport',
        component: () => import('@/views/admin/ImportView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'collections',
        name: 'AdminCollections',
        component: () => import('@/views/admin/CollectionsView.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAdmin) {
    const authStore = useAuthStore()
    if (!authStore.isAdmin) {
      return { name: 'Home' }
    }
  }
})

export default router
