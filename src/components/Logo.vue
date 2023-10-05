<template>
    <div class="d-flex justify-center mb-16">
        <div class="flex items-center my-1">
          <h1 class="font-bold text-3xl mr-2 dark:!text-red-600  text-white 
          dark:bg-gray-200 border-2 border-gray-700 dark:border-red-600 bg-red-600 d-flex relative left-11 my-auto pr-11 pl-4 py-1 rounded-full">Biblioteca ESUFS</h1>
          <img :src="require('../assets/book.png')" class="img-icon z-10" />
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
  