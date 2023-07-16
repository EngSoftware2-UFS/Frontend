<template>
  <v-app class="dark:bg-slate-700 dark:text-white">
    <v-main>
      <Navbar @toggle="toggle" />
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data: () => ({
    //
  }),
}
</script>
