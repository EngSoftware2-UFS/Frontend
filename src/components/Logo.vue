<template>
    <div class="d-flex justify-center mb-16">
        <img
            :src="require('../assets/book.png')"
            class="my-3 z-10"
            width="100"
        />
        <div class="dark:bg-slate-950 bg-slate-300 d-flex relative right-24 h-20 my-auto pl-24 pr-6 rounded-full">
            <h1 class="font-extrabold text-red-600 text-2xl my-auto ml-4">
                Biblioteca
                <br />
                ESUFS
            </h1>
        </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'LogoView',
    data: () => ({
    }),
  }
  </script>
  