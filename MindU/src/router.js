import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import RegistroView from './views/RegistroView.vue';
import HomeView from './views/HomeView.vue';
// Importamos las nuevas vistas
import TestSaludView from './views/TestSaludView.vue';
import MeditacionView from './views/MeditacionView.vue';
import EspecialistasView from './views/EspecialistasView.vue';
import PlanesView from './views/PlanesView.vue';
import { auth } from './firebaseConfig';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/registro', component: RegistroView },
  { path: '/home', component: HomeView, meta: { requiresAuth: true }},
  // Nuevas rutas protegidas
  { path: '/test-salud', component: TestSaludView, meta: { requiresAuth: true }},
  { path: '/meditacion', component: MeditacionView, meta: { requiresAuth: true }},
  { path: '/especialistas', component: EspecialistasView, meta: { requiresAuth: true }},
  { path: '/planes', component: PlanesView, meta: { requiresAuth: true }},
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protección de navegación
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else {
    next();
  }
});

export default router;