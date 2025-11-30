import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 1. Importaciones QUE SÍ EXISTEN (Asegúrate de tener estos archivos)
import LoginView from './views/LoginView.vue'
import RegistroView from './views/RegistroView.vue'
import PreTestView from './views/PreTestView.vue'     // Creado en paso anterior
import DashboardView from './views/DashboardView.vue' // Creado en paso anterior
import ModuloView from './views/ModuloView.vue'       // Creado en paso anterior

// 2. Importaciones FUTURAS (Comentadas para que no den error de pantalla blanca)
 import PostTestView from './views/PostTestView.vue'
 import ResultadosView from './views/ResultadosView.vue'
 import AlertaCrisisView from './views/AlertaCrisisView.vue'
import AdminBotView from './views/AdminBotView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/registro', component: RegistroView },
  { 
    path: '/pre-test', 
    component: PreTestView, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/dashboard', 
    component: DashboardView, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/modulo/:id', 
    component: ModuloView, 
    props: true,
    meta: { requiresAuth: true } 
  },
  
  // Rutas COMENTADAS hasta que creemos los archivos:
  
  { path: '/post-test', component: PostTestView, meta: { requiresAuth: true } },
  { path: '/resultados', component: ResultadosView, meta: { requiresAuth: true } },
  { path: '/alerta-crisis', component: AlertaCrisisView },
  { path: '/admin-bots', component: AdminBotView }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de Navegación
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Esperar a que Firebase confirme si el usuario está logueado
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next('/login');
    } else {
      next();
    }
  });
});

export default router