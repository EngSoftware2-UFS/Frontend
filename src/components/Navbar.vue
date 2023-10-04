<template>
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
        <v-btn variant="outlined" @click="logout()">Sair</v-btn>
      </div>
    </div>
    <div class="my-auto">
      <v-icon icon="mdi-circle-half-full" @click="toggleDark(); toggleTheme();"></v-icon>
    </div>
  </div>
</template>

<script>
import * as loginService from "../services/authService.js";

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
    }
  },
  computed: {
    isUserLogged: function () {
      return this.userLogged;
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
