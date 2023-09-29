<template>
  <div class="container m-auto p-10 h-full d-flex">
    <v-card class="w-9/12 m-auto d-flex h-2/3 dark:!bg-slate-800 dark:text-white bg-slate-100" elevation="4">
      <div class="fill" v-if="!$vuetify.display.mobile">
        <img :src="require('../assets/images/library.jpg')" />
      </div>
      <div class="d-flex m-auto flex-column">
        <v-img
          :src="require('../assets/book.png')"
          class="my-3"
          contain
          height="100"
        />
        <v-card-title class="mx-auto">Login</v-card-title>
        <v-text-field label="Email" type="email" v-model="credentials.email"></v-text-field>
        <v-text-field label="Senha" type="password" v-model="credentials.senha"></v-text-field>
        <v-radio-group inline v-model="credentials.tipoUsuario">
          <v-radio label="Cliente" value="0"></v-radio>
          <v-radio label="Atendente" value="1"></v-radio>
          <v-radio label="Bibliotecario" value="2"></v-radio>
        </v-radio-group>
        <v-btn class="mx-auto dark:!text-black dark:!bg-white bg-black" variant="solo" @click="login()">Entrar</v-btn>
      </div>
    </v-card>
  </div>    
</template>
  
<script>
  import { defineComponent } from 'vue';
  import * as loginService from '../services/authService.js';
  
  export default defineComponent({
    name: 'LoginView',
    data() {
    return {
      credentials: {
        email: null,
        senha: null,
        tipoUsuario: '0'
      }
    }
  },
  methods: {
    login: async function () {
      if (!this.credentials.email) {
        this.$toast.error("Email não informado.");
        return;
      }

      if (!this.credentials.senha) {
        this.$toast.error("Senha não informada.");
        return;
      }

      if (!this.credentials.tipoUsuario) {
        this.$toast.error("Tipo de usuário não informado.");
        return;
      }

      loginService.login(this.credentials).then(() => {
        this.$toast.success("Login efetuado com sucesso!")
        this.$emit("logged")
        this.$router.push("/")
      })
      .catch(err => { return err })
    }
  },
  mounted() {
  }
  });
</script>

<style>
.fill {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 46%;
}
.fill img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
}
</style>
  