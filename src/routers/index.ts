import { createRouter, createWebHashHistory } from 'vue-router';
import RootLayout from '../layouts/RootLayout.vue';
import HomePage from '../pages/HomePage.vue';
import AboutPage from '../pages/AboutPage.vue';
import AlgorithmPage from '../pages/AlgorithmPage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active-menu',
  linkExactActiveClass: 'exact-active-menu',
  routes: [
    {
      path: '/',
      name: 'main-view',
      component: RootLayout,
      children: [
        { path: '', name: 'home-page', component: HomePage },
        {
          path: 'about',
          name: 'about-page',
          component: AboutPage
        },
        {
          path: 'algorithm',
          name: 'algorithm-page',
          component: AlgorithmPage
        }
      ]
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
