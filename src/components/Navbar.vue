<template>
    <div class="d-flex w-100 px-4 py-2 text-gray-800 dark:text-white bg-slate-200 dark:bg-slate-900">
        <div class="d-flex my-auto mr-2">
            <img class="w-8" :src="require('../assets/book.png')" />
        </div>
        <ul class="d-flex w-fit justify-start my-auto">
            <li
                v-for="item in itens"
                :key="item.id"
                @click="$router.push(item.path)"
                class=" hover:bg-slate-300 dark:hover:bg-slate-800 cursor-pointer px-4 py-2 rounded-md">
                <div class="d-flex">
                <v-icon :icon="item.icon" class="my-auto"></v-icon>
                <span class="my-auto">{{ item.text }}</span>
                </div>
            </li>
        </ul>
        <v-spacer />
        <div class="my-auto">
            <v-icon icon="mdi-circle-half-full" @click="toggleDark()"></v-icon>
        </div>
    </div>
</template>

<script>
export default {
  name: 'NavBar',
  data: () => ({
    itens: [{
        id: crypto.randomUUID(),
        text: "Home",
        icon: "mdi-home",
        path: "/"
    }, {
        id: crypto.randomUUID(),
        text: 'Acervo',
        icon: "mdi-book",
        path: "/acervo"
    }]
  }),
  methods: {
    // toggleDark: function () {
    //     this.$emit('toggle');
    // }
  }
}
</script>

<script setup>
    import { useDark, useToggle } from '@vueuse/core'

    const isDark = useDark()
    const toggleDark = useToggle(isDark)
</script>