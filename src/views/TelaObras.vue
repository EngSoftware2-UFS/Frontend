<template>
  <div class="container m-auto p-10 h-full d-flex flex-col">
    <div class="mb-10">
      <LogoView />
      <div class="d-flex flex-col justify-center">
        <div class="w-6/12 mx-auto">
          <div v-if="reservar.length > 0" class="d-flex flex-col mb-5 align-center">
            <div class="text-4xl font-bold text-center w-full mb-2">Lista de Reserva</div>
            <table class="table-auto border-[2px] dark:border-gray-950 border-gray-500 w-full">
              <thead class="dark:bg-gray-900 bg-gray-400 border-[2px] dark:border-gray-950 border-gray-500">
                <tr>
                  <th class="text-left px-4 py-2">Título</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="robra in reservar" :key="robra.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ robra.titulo }}</td>
                </tr>
              </tbody>
            </table>
            <v-btn class="mt-4 w-6/12 dark:bg-slate-300 dark:!text-black bg-slate-900 text-white" @click="concluirReserva()">
              Concluir Reserva
            </v-btn>
          </div>

          <div class="d-flex flex-col items-center">
            <span class="text-center text-2xl font-bold">Pesquisar por</span>
            <v-radio-group inline v-model="searchFor">
              <v-radio class="mr-6" label="Título" value="titulo"></v-radio>
              <v-radio class="mr-6" label="ISBN" value="isbn"></v-radio>
              <v-radio class="mr-6" label="Autor" value="autor"></v-radio>
              <v-radio label="Gênero" value="genero"></v-radio>
            </v-radio-group>
            <v-text-field
              class="mb-4 w-full"
              :loading="loading"
              v-model="search"
              density="compact"
              variant="solo"
              :label="`filtrar por ${searchFor}`"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @click:append-inner="refreshObras()"
              @keyup.enter="refreshObras()"
            ></v-text-field>
            <v-tooltip v-if="userData?.tipoUsuario == 'BIBLIOTECARIO'" text="Cadastrar Obra" location="top">
              <template v-slot:activator="{ props }">
                <v-icon 
                  class="dark:bg-slate-950 dark:text-white bg-slate-500 rounded-full ml-4 cursor-pointer p-[22px]" 
                  size="large"
                  icon="mdi-plus"
                  v-bind="props"
                  @click="createDialog = true" />
              </template>
            </v-tooltip>
          </div>

          <div>
            <table class="table-auto border-[2px] dark:border-gray-950 border-gray-500 w-full">
              <thead class="dark:bg-gray-900 bg-gray-400 border-[2px] dark:border-gray-950 border-gray-500">
                <tr>
                  <th class="text-left px-4 py-2">Título</th>
                  <th class="text-left px-4 py-2">Gênero</th>
                  <th class="text-left px-4 py-2">Editora</th>
                  <th class="text-right px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="obra in obras" :key="obra.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ obra.titulo }}</td>
                  <td class="px-4 py-2 text-left">{{ obra.genero?.nome }}</td>
                  <td class="px-4 py-2 text-left">{{ obra.editora?.nome }}</td>
                  <td class="px-4 py-2 text-right min-w-[110px]">
                    <v-icon icon="mdi-eye" size="small" @click="showObra(obra)"></v-icon>
                    <v-tooltip v-if="userData?.tipoUsuario == 'CLIENTE'" text="Adicionar à lista de reserva." location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-book-plus-multiple" size="small" class="ml-2" @click="addObraToReserva(obra)"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-icon v-if="userData?.tipoUsuario == 'BIBLIOTECARIO'" icon="mdi-update" size="small" class="ml-2" @click="showUpdateDialog(obra)"></v-icon>
                    <v-icon v-if="userData?.tipoUsuario == 'BIBLIOTECARIO'" icon="mdi-delete" size="small" class="ml-2" @click="deleteDialog=true; deleteObra = obra"></v-icon>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="obras.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="createDialog" width="50%" persistent max-height="80%">
              <v-card>
                <v-card-title class="d-flex">
                  Cadastrar Obra
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="createDialog = false; newObra = defaultObra; currentAuthor = null"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Título" :rules="[rules.required]" v-model="newObra.titulo" density="compact"/>
                  <v-text-field label="Quantidade de Exemplares" type="number" :rules="[rules.required, rules.great1]" v-model="newObra.quantidadeExemplares" density="compact"/>
                  <v-text-field label="Ano" type="number" :rules="[rules.required]" v-model="newObra.ano" density="compact"/>
                  <v-text-field label="Idioma" :rules="[rules.required]" v-model="newObra.idioma" density="compact"/>
                  <v-text-field label="Gênero" :rules="[rules.required]" v-model="newObra.generoNome" density="compact"/>
                  <v-text-field label="Editora" :rules="[rules.required]" v-model="newObra.editoraNome" density="compact"/>
                  <v-text-field label="Nacionalidade da Editora" :rules="[rules.required]" v-model="newObra.editoraNacionalidade" density="compact"/>
                  <v-text-field label="Edição" :rules="[rules.required]" v-model="newObra.edicao" density="compact"/>
                  <v-text-field label="Isbn" :rules="[rules.required]" v-model="newObra.isbn" density="compact"/>
                  <div v-for="autor in newObra.autores" :key="autor">
                    <v-text-field label="Autor" readonly
                      append-inner-icon="mdi-delete"
                      :model-value="autor"
                      density="compact"
                      @click:append-inner="removeAuthor(autor)"
                      @keyup.enter="removeAuthor(autor)"/>
                  </div>
                  <v-text-field label="Autor" 
                    :rules="[rules.required]"
                    v-model="currentAuthor"
                    append-inner-icon="mdi-plus"
                    density="compact"
                    @click:append-inner="addAuthor()"
                    @keyup.enter="addAuthor()"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn @click="addObra(newObra)" class="dark:bg-slate-900 dark:text-white bg-indigo-300">Adicionar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="updateDialog" width="50%" persistent max-height="80%">
              <v-card>
                <v-card-title class="d-flex">
                  Editar obra
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="updateDialog = false; obraUpdating = defaultObra;"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Título" :rules="[rules.required]" v-model="obraUpdating.titulo" density="compact"/>
                  <v-text-field label="Ano" type="number" :rules="[rules.required]" v-model="obraUpdating.ano" density="compact"/>
                  <v-text-field label="Idioma" :rules="[rules.required]" v-model="obraUpdating.idioma" density="compact"/>
                  <v-text-field label="Gênero" :rules="[rules.required]" v-model="obraUpdating.generoNome" density="compact"/>
                  <v-text-field label="Editora" :rules="[rules.required]" v-model="obraUpdating.editoraNome" density="compact"/>
                  <v-text-field label="Nacionalidade da Editora" :rules="[rules.required]" v-model="obraUpdating.editoraNacionalidade" density="compact"/>
                  <v-text-field label="Edição" :rules="[rules.required]" v-model="obraUpdating.edicao" density="compact"/>
                  <v-text-field label="Isbn" :rules="[rules.required]" v-model="obraUpdating.isbn" density="compact"/>
                  <div v-for="autor in obraUpdating.autores" :key="autor">
                    <v-text-field label="Autor" readonly
                      append-inner-icon="mdi-delete"
                      :model-value="autor"
                      density="compact"
                      @click:append-inner="removeAuthor(autor)"
                      @keyup.enter="removeAuthor(autor)"/>
                  </div>
                  <v-text-field label="Autor" 
                    :rules="[rules.required]"
                    v-model="currentAuthorUpdt"
                    append-inner-icon="mdi-plus"
                    density="compact"
                    @click:append-inner="addAuthorUpdt()"
                    @keyup.enter="addAuthorUpdt()"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn @click="updateObra(obraUpdating)" class="dark:bg-gray-900 dark:text-white bg-indigo-300 px-4">Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteDialog" width="auto" persistent>
              <v-card>
                <v-card-title class="d-flex mb-6 justify-center font-extrabold">
                    <h1>Excluir obra {{ deleteObra.nome }}?</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="deleteObraFunc(deleteObra.id)" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="deleteDialog = false; deleteObra = {}" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewObra = defaultObra;"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Obra:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Título:</span> {{ viewObra.titulo }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Ano:</span> {{ viewObra.ano }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Genero:</span> {{ viewObra.genero?.nome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Idioma:</span> {{ viewObra.idioma }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Edição:</span> {{ viewObra.edicao }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Isbn:</span> {{ viewObra.isbn }}</div>
                  <div v-if="checkUserLogged" class="mt-1 ml-2"><span class="font-bold">Cadastrado por:</span> {{ viewObra.cadastrado?.nome }}</div>
                  <div class="mt-2"><span class="font-bold text-xl">Editora:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Nome:</span> {{ viewObra.editora?.nome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Nacionalidade:</span> {{ viewObra.editora?.nacionalidade }}</div>
                  <div class="mt-2"><span class="font-bold text-xl">Autores:</span></div>
                  <div v-for="autor in viewObra.autors" :key="autor.id">
                    <div class="mt-1 ml-2">{{ autor.nome }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as obraService from "../services/obraService";
import * as reservaService from "../services/reservaService";
import * as bibliotecarioService from "../services/bibliotecarioService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'TelaObras',
    components: {
      LogoView
    },
    data() {
      return {
        rules: {
          required: value => !!value || 'Campo obrigatório.',
          min: v => v.length >= 8 || 'Mínimo 8 caracteres.',
          great1: v => parseInt(v) >= 1 || 'Quantidade mínima de 1 exemplar.'
        },
        defaultObra: {
          quantidadeExemplares: null,
          titulo: null,
          idioma: null,
          ano: null,
          isbn: null,
          edicao: null,
          editora: {},
          genero: {},
          editoraNome: null,
          generoNome: null,
          editoraId: null,
          generoId: null,
          bibliotecarioId: null,
          autors: []
        },
        search: null,
        searchFor: "titulo",
        loading: false,
        createDialog: false,
        newObra: {
          quantidadeExemplares: null,
          titulo: null,
          idioma: null,
          ano: null,
          isbn: null,
          edicao: null,
          editora: {},
          genero: {},
          editoraNome: null,
          generoNome: null,
          editoraId: null,
          generoId: null,
          bibliotecarioId: null,
          autores: []
        },
        updateDialog: false,
        obraUpdating: null,
        deleteObra: null,
        viewObra: null,
        deleteDialog: false,
        viewDialog: false,
        currentAuthor: null,
        currentAuthorUpdt: null,
        obras: [],
        reservar: []
    }
  },
  props: {
    userData: Object,
  },
  computed: {
    checkUserLogged: function () {
      console.log(this.userData);
      return this.userData?.id;
    }
  },
  methods: {
    addObraToReserva: function (obra) {
      if (this.reservar.findIndex(x => x.id == obra.id) > -1)
        this.$toast.error("Esta obra já foi adicionada na lista.");
      else if (this.reservar.length < 3) {
        this.reservar.push({ id: obra.id, titulo: obra.titulo });
      }else this.$toast.error("Não é possível reservar mais de 3 obras de uma vez.");
    },
    concluirReserva: function () {
      let obrasId = this.reservar.map(x => x.id);
      reservaService.createReserva({ obrasId })
      .then(() => {
        this.reservar = [];
        this.$toast.success("Obras reservadas.");
      }).catch(() => {
        this.reservar = [];
      })
    },
    refreshObras: async function () {
      obraService.getObras(this.searchFor, this.search)
      .then(res => {
        this.obras = res;
      }).catch(() => {
        this.obras = [];
      })
    },
    addObra: async function (data) {
      if (!data.titulo || !data.ano || !data.idioma || !data.generoNome || !data.editoraNome || !data.editoraNacionalidade
      || !data.edicao || !data.isbn || !data.autores || data.autores?.length == 0)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        obraService.createObra(data).then(() => {
          this.$toast.success("Obra cadastrado com sucesso.");
          this.refreshObras();
          this.createDialog = false;
          this.newObra = this.defaultObra;
        }).catch(err => {return err});
      }
    },
    updateObra: async function (data) {
      if (!data.titulo || !data.ano || !data.idioma || !data.generoNome || !data.editoraNome || !data.editoraNacionalidade
      || !data.edicao || !data.isbn || !data.autores || !data.id || data.autores?.length == 0)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        obraService.updateObra(data).then(() => {
          this.$toast.success("Obra editado com sucesso.");
          this.refreshObras();
          this.updateDialog = false;
          this.obraUpdating = this.defaultObra;
        }).catch(err => {return err});
      }
    },
    deleteObraFunc: async function (id) {
      if (!id)
        this.$toast.error("Um erro ocorreu.");
      else {
        obraService.deleteObra(id).then(() => {
          this.$toast.success("Obra excluído com sucesso.");
          this.refreshObras();
          this.deleteDialog = false;
          this.deleteObra = this.defaultObra;
        }).catch(err => {return err});
      }
    },
    showObra: async function (obra) {
      this.viewDialog=true;
      this.viewObra = obra;
      this.viewObra.cadastrado = await bibliotecarioService.getBibliotecario(obra.bibliotecarioId)
      .catch(err => { return err; });
    },
    showUpdateDialog: function (obra) {
      this.updateDialog=true;
      this.obraUpdating = obra;
      this.obraUpdating.autores = obra.autors ? obra.autors.map(x => x.nome) : [];
      this.obraUpdating.generoNome = obra.genero?.nome;
      this.obraUpdating.editoraNome = obra.editora?.nome;
      this.obraUpdating.editoraNacionalidade = obra.editora?.nacionalidade;
    },
    addAuthor: function () {
      if (this.currentAuthor) {
        if (!this.newObra.autores) this.newObra.autores = [];
        this.newObra.autores.push(this.currentAuthor);
        this.currentAuthor = null;
      }
    },
    addAuthorUpdt: function () {
      if (this.currentAuthorUpdt) {
        if (!this.obraUpdating.autores) this.obraUpdating.autores = [];
        this.obraUpdating.autores.push(this.currentAuthorUpdt);
        this.currentAuthorUpdt = null;
      }
    },
    removeAuthor: function (autor) {
      if (autor) {
        var index = this.newObra?.autores.findIndex(x => x == autor);
        if (index > -1)
          this.newObra?.autores.splice(index, 1);
      }
    }
  },
  mounted() {
    this.refreshObras();
  }
  });
</script>