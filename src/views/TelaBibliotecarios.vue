<template>
  <div class="container m-auto p-10 h-full d-flex flex-col">
    <div class="mb-10">
      <LogoView />
      <div class="d-flex flex-col justify-center">
        <div class="w-6/12 mx-auto">
          <div class="d-flex">
            <v-text-field
              class="mb-4 mr-4 w-6/12"
              :loading="loadingNome"
              v-model="searchName"
              density="compact"
              variant="solo"
              label="filtrar por nome"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @keyup="refreshBibliotecarios()"
            ></v-text-field>
            <v-text-field
              class="mb-4"
              :loading="loadingCpf"
              v-model="searchCpf"
              density="compact"
              variant="solo"
              label="pesquisar por cpf completo"
              append-inner-icon="mdi-magnify"
              single-line
              type="number"
              hide-details
              @click:append-inner="refreshBibliotecarios()"
              @keyup.enter="refreshBibliotecarios()"
            ></v-text-field>
            <v-tooltip text="Cadastrar Bibliotecario" location="top">
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
                  <th class="text-left px-4 py-2">Nome</th>
                  <th class="text-left px-4 py-2">CPF</th>
                  <th class="text-left px-4 py-2">E-mail</th>
                  <th class="text-right px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="bibliotecario in bibliotecarios" :key="bibliotecario.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ bibliotecario.nome }}</td>
                  <td class="px-4 py-2 text-left">{{ bibliotecario.cpf }}</td>
                  <td class="px-4 py-2 text-left">{{ bibliotecario.email }}</td>
                  <td class="px-4 py-2 text-right min-w-[110px]">
                    <v-icon icon="mdi-eye" size="small" @click="showBibliotecario(bibliotecario)"></v-icon>
                    <v-icon icon="mdi-update" size="small" class="ml-2" @click="updateDialog=true; bibliotecarioUpdating = bibliotecario"></v-icon>
                    <v-icon v-if="userData?.tipoUsuario == 'BIBLIOTECARIO'" icon="mdi-delete" size="small" class="ml-2" @click="deleteDialog=true; deleteBibliotecario = bibliotecario"></v-icon>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="bibliotecarios.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="createDialog" width="50%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  Cadastrar Bibliotecario
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="createDialog = false; newBibliotecario = defaultBibliotecario"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nome" :rules="[rules.required]" v-model="newBibliotecario.nome" density="compact"/>
                  <v-text-field label="CPF" :rules="[rules.required]" v-model="newBibliotecario.cpf" density="compact" @keyup="maskcpf()"/>
                  <v-text-field label="E-mail" type="email" :rules="[rules.required]" v-model="newBibliotecario.email" density="compact"/>
                  <v-text-field label="Senha" type="password" :rules="[rules.required, rules.min]" v-model="newBibliotecario.senha" density="compact"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="addBibliotecario(newBibliotecario)" class="w-1/2 mb-2 !bg-[#ce1b2bee] text-white">Adicionar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="updateDialog" width="50%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  Editar bibliotecario
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="updateDialog = false; bibliotecarioUpdating = defaultBibliotecario;"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nome" :rules="[rules.required]" v-model="bibliotecarioUpdating.nome" density="compact"/>
                  <v-text-field label="CPF" :rules="[rules.required]" v-model="bibliotecarioUpdating.cpf" density="compact" @keyup="maskcpfupd()"/>
                  <v-text-field label="E-mail" type="email" :rules="[rules.required]" v-model="bibliotecarioUpdating.email" density="compact"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="updateBibliotecario(bibliotecarioUpdating)" class="w-1/2 mb-2 !bg-[#ce1b2bee] text-white">Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteDialog" width="auto" persistent>
              <v-card>
                <v-card-title class="d-flex mb-6 justify-center font-extrabold">
                    <h1>Excluir bibliotecario {{ deleteBibliotecario.nome }}?</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="deleteBibliotecarioFunc(deleteBibliotecario.id)" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="deleteDialog = false; deleteBibliotecario = {}" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" min-width="30%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  {{ viewBibliotecario.nome }}
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewBibliotecario = defaultBibliotecario;"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Bibliotecario:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Nome:</span> {{ viewBibliotecario.nome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">CPF:</span> {{ viewBibliotecario.cpf }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">E-mail:</span> {{ viewBibliotecario.email }}</div>
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
import * as bibliotecarioService from "../services/bibliotecarioService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'TelaBibliotecarios',
    components: {
      LogoView
    },
    data() {
      return {
        rules: {
          required: value => !!value || 'Campo obrigatório.',
          min: v => v.length >= 8 || 'Mínimo 8 caracteres.'
        },
        defaultBibliotecario: {
          nome: null,
          cpf: null,
          email: null,
          senha: null
        },
        searchName: null,
        searchCpf: null,
        loadingCpf: false,
        loadingNome: false,
        createDialog: false,
        newBibliotecario: {
          nome: null,
          cpf: null,
          email: null,
          senha: null
        },
        updateDialog: false,
        bibliotecarioUpdating: null,
        deleteBibliotecario: null,
        viewBibliotecario: null,
        deleteDialog: false,
        viewDialog: false,
        bibliotecarios: []
    }
  },
  props: {
    userData: Object,
  },
  methods: {
    refreshBibliotecarios: async function () {
      bibliotecarioService.getBibliotecarios(this.searchName, this.searchCpf).then(res => {
        if (res.length && res.length > 0) this.bibliotecarios = res;
        else {
          this.bibliotecarios = [];
          this.bibliotecarios.push(res);
        }
      }).catch(() => {
        this.bibliotecarios = [];
      })
    },
    cpf: function (v) {
      if (!v) return v;
      v=v.replace(/\D/g,"")
      v=v.replace(/(\d{3})(\d)/,"$1.$2")
      v=v.replace(/(\d{3})(\d)/,"$1.$2")
      v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
      return v
    },
    maskcpf() {
      var cpf = this.newBibliotecario.cpf.split(/\/|\.|-/).join("");
      if (!cpf.match(/^[0-9]*$/)) {
        cpf = cpf.match(/\d/g) || []
        cpf = cpf.join("")
      }
      var end = -1;
      if (cpf.length >= 9 && cpf.length < 11) end = 3 + cpf.length;
      if (cpf.length >= 6 && cpf.length < 9) end = 2 + cpf.length;
      if (cpf.length >= 3 && cpf.length < 6) end = 1 + cpf.length;
      if (cpf.length <= 2) end = cpf.length;
      cpf = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
      if (end > -1) cpf = cpf.substring(0, end);
      this.newBibliotecario.cpf = cpf;
    },
    maskcpfupd() {
      var cpf = this.bibliotecarioUpdating.cpf.split(/\/|\.|-/).join("");
      if (!cpf.match(/^[0-9]*$/)) {
        cpf = cpf.match(/\d/g) || []
        cpf = cpf.join("")
      }
      var end = -1;
      if (cpf.length >= 9 && cpf.length < 11) end = 3 + cpf.length;
      if (cpf.length >= 6 && cpf.length < 9) end = 2 + cpf.length;
      if (cpf.length >= 3 && cpf.length < 6) end = 1 + cpf.length;
      if (cpf.length <= 2) end = cpf.length;
      cpf = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
      if (end > -1) cpf = cpf.substring(0, end);
      this.bibliotecarioUpdating.cpf = cpf;
    },
    addBibliotecario: async function (data) {
      if (!data.nome || !data.cpf || !data.senha || !data.email)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        bibliotecarioService.createBibliotecario(data).then(() => {
          this.$toast.success("Bibliotecario cadastrado com sucesso.");
          this.refreshBibliotecarios();
          this.createDialog = false;
          this.newBibliotecario = this.defaultBibliotecario;
        }).catch(err => {return err});
      }
    },
    updateBibliotecario: async function (data) {
      if (!data.nome || !data.cpf || !data.email || !data.id)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        bibliotecarioService.updateBibliotecario(data).then(() => {
          this.$toast.success("Bibliotecario editado com sucesso.");
          this.refreshBibliotecarios();
          this.updateDialog = false;
          this.bibliotecarioUpdating = this.defaultBibliotecario;
        }).catch(err => {return err});
      }
    },
    deleteBibliotecarioFunc: async function (id) {
      if (!id)
        this.$toast.error("Um erro ocorreu.");
      else {
        bibliotecarioService.deleteBibliotecario(id).then(() => {
          this.$toast.success("Bibliotecario excluído com sucesso.");
          this.refreshBibliotecarios();
          this.deleteDialog = false;
          this.deleteBibliotecario = this.defaultBibliotecario;
        }).catch(err => {return err});
      }
    },
    showBibliotecario: async function (bibliotecario) {
      this.viewDialog=true;
      this.viewBibliotecario = bibliotecario;
    }
  },
  mounted() {
    this.refreshBibliotecarios();
  }
  });
</script>