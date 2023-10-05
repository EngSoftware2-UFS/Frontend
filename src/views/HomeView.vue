<template>
  <div class="container m-auto pb-4 pt-10 px-56 h-full d-flex flex-col">
    <v-row class="text-center px-4">
      <v-col cols="7" class="my-auto flex flex-col items-start pl-0">
        <h1 class="font-semibold text-xl">Seja bem vindo a</h1>
        <div class="flex items-center my-1">
          <h1 class="font-bold text-3xl mr-2 dark:!text-red-600  text-white 
          dark:bg-gray-200 border-2 border-gray-700 dark:border-red-600 bg-red-600 d-flex relative left-11 my-auto pr-11 pl-4 py-1 rounded-full">Biblioteca ESUFS</h1>
          <img :src="require('../assets/book.png')" class="img-icon z-10" />
        </div>

        <h1 class="font-semibold text-xl text-left">
          Um portal literário feito na matéria de Engenharia de Software
          <span class="times">II</span>
          <br />
          da Universidade Federal de Sergipe
        </h1>
      </v-col>
      <v-col cols="5" class="mt-auto flex flex-col pr-0">
        <div v-for="item in items" :key="item.id" class="w-full">
            <v-btn v-if="showItem(item.roles)" class="w-full mb-2 !bg-[#ce1b2bee]"
              variant="elevated"
              :prepend-icon="item.icon"
              :append-icon="item.icon"
              @click="$router.push(item.path)">
              <span class="mx-2">{{ item.text }}</span>
            </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row
      class="rounded-lg text-gray-800 dark:text-white bg-slate-200 dark:bg-slate-900 pt-4 justify-center align-middle"
    >
      <v-carousel class="h-fit max-h-[420px]" hide-delimiters :show-arrows="false" cycle>
          <v-carousel-item
          v-for="(imagem, index) in imagens"
          :key="index"
          class="h-fit"
          >
            <v-sheet
            class="text-gray-800 dark:text-white bg-slate-200 dark:bg-slate-900 d-flex px-4 pb-4 h-full"
            tile
            >
              <img class="max-h-[410px]" :src="imagem.url" />
              <div
                class="d-flex flex-col justify-start align-center max-h-[410px] pt-10 pb-6"
              >
                <div class="text-h4">{{ imagem.titulo }} Slide</div>
                <div class="font-semibold px-8 pt-8 text-justify">{{ imagem.resumo }}</div>
                <div class="self-end px-8 text-lg mt-auto">Autor: <span class="charline">{{ imagem.autores }}</span></div>
              </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-row>
    <v-spacer></v-spacer>
    <div class="mt-36 text-center">
      <h1 class="font-semibold text-regular">Grupo</h1>
      <h1 class="font-semibold text-regular">
        Allaphy Lima - Jonh Kennedy - Lucas Santiago
      </h1>
      <h1 class="font-semibold text-regular">2023.1</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",

  data: () => ({
    imagens: [
      {
        titulo: "Alice no país das maravilhas",
        resumo:
          '"O livro conta a história de uma menina chamada Alice que cai numa toca de coelho que a transporta para um lugar fantástico povoado por criaturas peculiares e antropomórficas, revelando uma lógica do absurdo, característica dos sonhos. Este está repleto de alusões satíricas dirigidas tanto aos amigos como aos inimigos de Carroll, de paródias a poemas populares infantis ingleses ensinados no século XIX e também de referências linguísticas e matemáticas frequentemente através de enigmas que contribuíram para a sua popularidade. É assim uma obra de difícil interpretação pois contém dois livros num só texto: um para crianças e outro para adultos."',
        url: require("../assets/images/alice-no-pais-das-maravilhas.jpg"),
        autores: "Lewis Carroll"
      },
      {
        titulo: "The Witcher",
        resumo:
          '"Geralt de Rívia é um bruxo sagaz e habilidoso. Um assassino impiedoso e de sangue-frio treinado, desde a infância, para caçar e eliminar monstros. Seu único objetivo: destruir as criaturas do mal que assolam o mundo. Um mundo fantástico criado por Sapkowski com claras influências da mitologia eslava."',
        url: require("../assets/images/the-witcher.jpg"),
        autores: "Andrzej Sapkowski"
      },
      {
        titulo: "Way of Kings",
        resumo:
          '"Roshar é uma terra cruel. Grandes tempestades, chamadas grantormentas, varrem sua superfície, e o bioma, a geografia e a civilização foram moldados a partir disso. Animais desenvolveram carapaças para aguentar essas furiosas tormentas. Plantas desaparecem sob o chão quando elas chegam. Cidades, vilarejos e acampamentos adaptaram sua organização para não sofrer o baque completo.\nQuando o rei dos alethianos é assassinado durante uma confraternização com o misterioso povo Parshendi, uma guerra se inicia. Ambos os povos passam a travar batalhas nas Planícies Quebradas, o território mais hostil e complexo de Roshar. Com grandes paredões a serem atravessados, e abismos que guardam monstros terríveis."',
        url: require("../assets/images/way-of-kings.jpg"),
        autores: 'Brandon Sanderson'
      },
      {
        titulo: "The Terror",
        resumo:
          '"Na primavera de 1845, Sir John Franklin comanda uma expedição de dois navios e 130 homens numa viagem arrojada para o distante e desconhecido Árctico. O seu objectivo: encontrar e mapear a lendária Passagem do Noroeste que, supostamente, ligará os oceanos Atlântico e Pacífico.Dois anos depois, a expedição, que começou sob um espírito de optimismo e confiança, enfrenta o desastre. Franklin está morto. Os dois navios (o Erebus e o Terror) estão fatalmente presos nas garras do gelo. As rações e o carvão escasseiam e os homens, mal preparados, lutam diariamente para sobreviver ao frio letal. Mas o seu verdadeiro inimigo é bem mais aterrorizador. Existe algo à espreita nas trevas glaciais: um predador oculto que captura marinheiros e abandona os seus corpos na vastidão de gelo…"',
        url: require("../assets/images/the-terror.jpg"),
        autores: 'Dan Simmons'
      },
    ],
    items: [
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
    userData: Object,
  },
  methods: {
    showItem: function (roles) {
      return roles?.includes(this.userData?.tipoUsuario?.toLowerCase()) || roles?.includes("everyone");
    }
  }
};
</script>
<style>
@import url('https://fonts.cdnfonts.com/css/charline');
.img-icon {
  height: 55px !important;
}
.times {
  font-family: 'Times New Roman', Times, serif;
}
.charline {
  font-family: 'Charline', sans-serif;
}
</style>
