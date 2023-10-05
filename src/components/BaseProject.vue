<template>
  <v-container class="mt-10 w-4/5 max-w-6xl">
    <v-row class="text-center">
      <v-col class="mb-8 flex flex-col items-start pl-0">
        <h1 class="font-semibold text-xl">Seja bem vindo a</h1>

        <div class="flex items-center my-1">
          <h1 class="font-bold text-3xl mr-2 text-red-600">Biblioteca ESUFS</h1>
          <img :src="require('../assets/book.png')" class="img-icon" />
        </div>

        <h1 class="font-semibold text-xl">
          Seu portal de conhecimento feito na matéria de Engenharia de Software
          II
        </h1>
      </v-col>
    </v-row>

    <v-row
      class="rounded-lg text-gray-800 dark:text-white bg-slate-200 dark:bg-slate-900 py-4 justify-center align-middle"
    >
      <v-col cols="3">
        <v-carousel height="320" hide-delimiters :show-arrows="false" cycle>
          <v-carousel-item
            v-for="(imagem, index) in imagens"
            :key="index"
            :src="imagem.url"
          />
        </v-carousel>
      </v-col>

      <v-col cols="8">
        <v-carousel height="320" hide-delimiters :show-arrows="false" cycle>
          <v-carousel-item v-for="(imagem, index) in imagens" :key="index">
            <v-sheet
              class="text-gray-800 dark:text-white bg-slate-200 dark:bg-slate-900"
              height="100%"
              tile
            >
              <div
                class="d-flex flex-col fill-height justify-start align-center"
              >
                <div class="text-h4">{{ imagem.titulo }} Slide</div>
                <div class="font-semibold p-8">{{ imagem.resumo }}</div>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
  <v-row class="mt-36">
    <v-col class="text-center">
      <h1 class="font-semibold text-regular">Grupo</h1>
      <h1 class="font-semibold text-regular">
        Allaphy Lima - Jonh Kennedy - Lucas Santiago
      </h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "BaseProject",

  data: () => ({
    imagens: [
      {
        titulo: "Alice no país das maravilhas",
        resumo:
          '"O livro conta a história de uma menina chamada Alice que cai numa toca de coelho que a transporta para um lugar fantástico povoado por criaturas peculiares e antropomórficas, revelando uma lógica do absurdo, característica dos sonhos. Este está repleto de alusões satíricas dirigidas tanto aos amigos como aos inimigos de Carroll, de paródias a poemas populares infantis ingleses ensinados no século XIX e também de referências linguísticas e matemáticas frequentemente através de enigmas que contribuíram para a sua popularidade. É assim uma obra de difícil interpretação pois contém dois livros num só texto: um para crianças e outro para adultos."',
        url: require("../assets/images/alice-no-pais-das-maravilhas.jpg"),
      },
      {
        titulo: "The Witcher",
        resumo:
          '"Geralt de Rívia é um bruxo sagaz e habilidoso. Um assassino impiedoso e de sangue-frio treinado, desde a infância, para caçar e eliminar monstros. Seu único objetivo: destruir as criaturas do mal que assolam o mundo. Um mundo fantástico criado por Sapkowski com claras influências da mitologia eslava."',
        url: require("../assets/images/the-witcher.jpg"),
      },
      {
        titulo: "Way of Kings",
        resumo:
          '"Roshar é uma terra cruel. Grandes tempestades, chamadas grantormentas, varrem sua superfície, e o bioma, a geografia e a civilização foram moldados a partir disso. Animais desenvolveram carapaças para aguentar essas furiosas tormentas. Plantas desaparecem sob o chão quando elas chegam. Cidades, vilarejos e acampamentos adaptaram sua organização para não sofrer o baque completo.\nQuando o rei dos alethianos é assassinado durante uma confraternização com o misterioso povo Parshendi, uma guerra se inicia. Ambos os povos passam a travar batalhas nas Planícies Quebradas, o território mais hostil e complexo de Roshar. Com grandes paredões a serem atravessados, e abismos que guardam monstros terríveis."',
        url: require("../assets/images/way-of-kings.jpg"),
      },
      {
        titulo: "The Terror",
        resumo:
          '"Na primavera de 1845, Sir John Franklin comanda uma expedição de dois navios e 130 homens numa viagem arrojada para o distante e desconhecido Árctico. O seu objectivo: encontrar e mapear a lendária Passagem do Noroeste que, supostamente, ligará os oceanos Atlântico e Pacífico.Dois anos depois, a expedição, que começou sob um espírito de optimismo e confiança, enfrenta o desastre. Franklin está morto. Os dois navios (o Erebus e o Terror) estão fatalmente presos nas garras do gelo. As rações e o carvão escasseiam e os homens, mal preparados, lutam diariamente para sobreviver ao frio letal. Mas o seu verdadeiro inimigo é bem mais aterrorizador. Existe algo à espreita nas trevas glaciais: um predador oculto que captura marinheiros e abandona os seus corpos na vastidão de gelo…"',
        url: require("../assets/images/the-terror.jpg"),
      },
    ],

    ecosystem: [
      {
        text: "vuetify-loader",
        href: "https://github.com/vuetifyjs/vuetify-loader/tree/next",
      },
      {
        text: "github",
        href: "https://github.com/vuetifyjs/vuetify/tree/next",
      },
      {
        text: "awesome-vuetify",
        href: "https://github.com/vuetifyjs/awesome-vuetify",
      },
    ],
    importantLinks: [
      {
        text: "Chat",
        href: "https://community.vuetifyjs.com",
      },
      {
        text: "Made with Vuetify",
        href: "https://madewithvuejs.com/vuetify",
      },
      {
        text: "Twitter",
        href: "https://twitter.com/vuetifyjs",
      },
      {
        text: "Articles",
        href: "https://medium.com/vuetify",
      },
    ],
    whatsNext: [
      {
        text: "Explore components",
        href: "https://vuetifyjs.com",
      },
      {
        text: "Roadmap",
        href: "https://vuetifyjs.com/introduction/roadmap/",
      },
      {
        text: "Frequently Asked Questions",
        href: "https://vuetifyjs.com/getting-started/frequently-asked-questions",
      },
    ],
  }),
};
</script>
<style>
.img-icon {
  height: 50px !important;
}
.v-img__img {
  height: 300px !important;
}
</style>
