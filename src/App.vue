<template>
  <v-app class="dark:bg-slate-700 dark:text-white">
    <Loading v-if="loading" />
    <v-main>
      <Navbar @toggle="toggle" />
      <router-view/>
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
    requests: []
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
        return error;
      })
    }
  },
  mounted() {
    this.mountInterceptors();
  }
}
</script>
