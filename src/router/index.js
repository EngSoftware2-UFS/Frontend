import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ConsultaUsuario from '../views/ConsultaUsuario.vue'


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/consultaUsuario',
    name: 'consultaUsuario',
    component: ConsultaUsuario,
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const authenticated =
    localStorage.getItem("token") !== null || "" ? true : false;
  if (to.meta.requiresAuth && authenticated === false) return "/home";
});

export default router;
