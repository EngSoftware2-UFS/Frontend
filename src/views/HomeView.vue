<template>
  <BaseProject />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import BaseProject from '../components/BaseProject.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    BaseProject,
  },
});
</script>
