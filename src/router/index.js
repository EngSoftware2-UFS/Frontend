import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import TelaClientes from "../views/TelaClientes.vue";
import TelaAtendentes from "../views/TelaAtendentes.vue";
import TelaBibliotecarios from "../views/TelaBibliotecarios.vue";
import TelaObras from "../views/TelaObras.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/clientes",
    name: "TelaClientes",
    component: TelaClientes,
    meta: { requiresAuth: true },
  },
  {
    path: "/atendentes",
    name: "TelaAtendentes",
    component: TelaAtendentes,
    meta: { requiresAuth: true },
  },
  {
    path: "/bibliotecarios",
    name: "TelaBibliotecarios",
    component: TelaBibliotecarios,
    meta: { requiresAuth: true },
  },
  {
    path: "/acervo",
    name: "TelaObras",
    component: TelaObras,
    meta: { requiresAuth: false },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authenticated =
    localStorage.getItem("token") !== null || "" ? true : false;
  if (to.meta.requiresAuth && authenticated === false) return "/";
});

export default router;
