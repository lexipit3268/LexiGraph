import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'main-view',
      component: () => import('../layouts/RootLayout.vue'),
      children: [{ path: '', name: 'home-page', component: () => import('../pages/HomePage.vue') }]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      return false;
    }
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

export default router;
