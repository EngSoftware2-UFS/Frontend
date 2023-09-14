<template>
  <v-app class="dark:bg-slate-700 dark:text-white">
    <Loading v-if="loading" />
    <v-main class="d-flex flex-col">
      <Navbar @toggle="toggle" @logout="logout" :userLogged="userLogged" :userData="user" />
      <router-view @logged="logged" :userData="user" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Loading from './components/Loading.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Loading
  },
  data: () => ({
    loading: false,
    userLogged: false,
    requests: [],
    user: {}
  }),
  methods: {
    mountInterceptors: function () {
      this.$api.getApi().interceptors.request.use(config => {
        this.requests.push(1);
        this.loading = true;
        return config;
      }, error => {
        return error;
      });

      this.$api.getApi().interceptors.response.use(config => {
        if (this.requests.length > 1) {
          this.requests.pop();
        }
        else {
          this.requests.pop();
          this.loading = false;
        }
        return config;
      }, error => {
        if (this.requests.length > 1) {
          this.requests.pop();
        }
        else {
          this.requests.pop();
          this.loading = false;
        }

        var errors = error.response?.data?.errors;
        if (errors) {
          var errorMessage = errors.join("\n");
          this.$toast.error(errorMessage);
        }
        else {
          this.$toast.error("Um erro ocorreu.");
        }
        throw error;
      })
    },
    logged: function () {
        if (localStorage.token && !this.userLogged) {
            this.userLogged = true;
            this.user = JSON.parse(localStorage.user);
        }
    },
    logout: function () {
      this.userLogged = false;
      this.user = {};
    }
  },
  mounted() {
    this.mountInterceptors();
    this.logged();
  }
}
</script>
