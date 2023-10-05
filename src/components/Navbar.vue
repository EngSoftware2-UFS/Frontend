<template>
  <div>
    <div
      class="d-flex w-100 px-4 py-2 text-gray-800 dark:text-white bg-slate-200 dark:bg-slate-900"
    >
      <div class="d-flex my-auto mr-2">
        <img class="w-8" :src="require('../assets/book.png')" />
      </div>
      <ul class="d-flex w-fit justify-start my-auto">
        <li
          v-for="item in items"
          :key="item.id"
          
        >
          <div v-if="showItem(item.roles)" @click="$router.push(item.path)"
          class="d-flex hover:bg-slate-300 dark:hover:bg-slate-800 cursor-pointer px-4 py-2 rounded-md">
            <v-icon :icon="item.icon" class="my-auto"></v-icon>
            <span class="my-auto ml-2">{{ item.text }}</span>
          </div>
        </li>
      </ul>
      <v-spacer />
      <div class="my-auto dar:text-white mx-2" v-if="$route.path != '/login'">
        <v-btn
          variant="outlined"
          @click="$router.push('/login')"
          v-if="!isUserLogged"
          >Login</v-btn
        >
        <div v-else class="d-flex my-auto mx-2">
          <span class="mx-4 text-xl font-semibold">Olá {{ userData.name }}</span>
          <v-tooltip text="Sair" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-logout my-auto" v-bind="props" @click="logout()"></v-icon>
            </template>
          </v-tooltip>
        </div>
      </div>
      <div class="my-auto">
        <v-tooltip v-if="isClient" text="Devoluções Pendentes" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-alert mr-4" v-bind="props" @click="notify()"></v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Alterar Tema" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-circle-half-full" v-bind="props" @click="toggleDark(); toggleTheme();"></v-icon>
          </template>
        </v-tooltip>
      </div>
    </div>
    <div v-if="showNotify" class="d-flex justify-end">
      <div class="d-flex flex-col text-center fixed w-fit rounded-lg border-[2px] dark:border-white border-slate-950 dark:bg-slate-800 dark:text-white bg-slate-300 px-6 py-6">
        <span>Você possui</span>
        <span class="text-xl font-bold">{{ devolucoes?.toLocaleString("en-us", { minimumIntegerDigits: 2 }) }}</span>
        <san v-if="devolucoes != 1">Devoluções pendentes!!</san>
        <span v-else>Devolução pendente!!</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as loginService from "../services/authService.js";
import * as clienteService from "../services/clienteService.js";

export default {
  name: "NavBar",
  data: () => ({
    items: [
      {
        id: crypto.randomUUID(),
        text: "Home",
        icon: "mdi-home",
        path: "/",
        roles: ["everyone"]
      },
      {
        id: crypto.randomUUID(),
        text: "Acervo",
        icon: "mdi-book",
        path: "/acervo",
        roles: ["everyone"]
      },
      {
        id: crypto.randomUUID(),
        text: "Clientes",
        icon: "mdi-account-multiple-plus",
        path: "/clientes",
        roles: ["atendente", "bibliotecario"]
      },
      {
        id: crypto.randomUUID(),
        text: "Atendentes",
        icon: "mdi-account-multiple-plus",
        path: "/atendentes",
        roles: ["bibliotecario"]
      },
      {
        id: crypto.randomUUID(),
        text: "Bibliotecarios",
        icon: "mdi-account-multiple-plus",
        path: "/bibliotecarios",
        roles: ["bibliotecario"]
      },
      {
        id: crypto.randomUUID(),
        text: "Reservas",
        icon: "mdi-book-open-page-variant",
        path: "/reservas",
        roles: ["atendente"]
      },
      {
        id: crypto.randomUUID(),
        text: "Emprestimos",
        icon: "mdi-bookshelf",
        path: "/emprestimos",
        roles: ["atendente"]
      },
      {
        id: crypto.randomUUID(),
        text: "Histórico",
        icon: "mdi-history",
        path: "/historico",
        roles: ["cliente"]
      }
    ],
    devolucoes: 0,
    showNotify: false
  }),
  props: {
    userLogged: Boolean,
    userData: Object,
  },
  methods: {
    logout() {
      loginService.logout();
      this.$emit("logout");
      this.$router.push("/");
    },
    showItem: function (roles) {
      return roles?.includes(this.userData?.tipoUsuario?.toLowerCase()) || roles?.includes("everyone");
    },
    notify: function () {
      this.showNotify = !this.showNotify;
      if (this.showNotify)
        this.devolucoesPendentes();
    },
    devolucoesPendentes() {
      if (this.isUserLogged) {
        clienteService.devolucoesPendentes()
        .then(res => {
          this.devolucoes = res;
        })
        .catch(() => {});
      }
    }
  },
  computed: {
    isUserLogged: function () {
      return this.userLogged;
    },
    isClient: function () {
      return this.userData?.tipoUsuario === "CLIENTE";
    }
  },
  mounted() {},
};
</script>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDark = useDark();
const toggleDark = useToggle(isDark)
function toggleTheme () {
  theme.global.name.value = !isDark.value ? 'light' : 'dark'
}
</script>
