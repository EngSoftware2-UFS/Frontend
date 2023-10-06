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
              @keyup="refreshAtendentes()"
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
              @click:append-inner="refreshAtendentes()"
              @keyup.enter="refreshAtendentes()"
            ></v-text-field>
            <v-tooltip text="Cadastrar Atendente" location="top">
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
                <tr v-for="atendente in atendentes" :key="atendente.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ atendente.nome }}</td>
                  <td class="px-4 py-2 text-left">{{ atendente.cpf }}</td>
                  <td class="px-4 py-2 text-left">{{ atendente.email }}</td>
                  <td class="px-4 py-2 text-right min-w-[110px]">
                    <v-icon icon="mdi-eye" size="small" @click="showAtendente(atendente)"></v-icon>
                    <v-icon icon="mdi-update" size="small" class="ml-2" @click="updateDialog=true; atendenteUpdating = atendente"></v-icon>
                    <v-icon v-if="userData?.tipoUsuario == 'BIBLIOTECARIO'" icon="mdi-delete" size="small" class="ml-2" @click="deleteDialog=true; deleteAtendente = atendente"></v-icon>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="atendentes.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="createDialog" width="50%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  Cadastrar Atendente
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="createDialog = false; newAtendente = defaultAtendente"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nome" :rules="[rules.required]" v-model="newAtendente.nome" density="compact"/>
                  <v-text-field label="CPF" :rules="[rules.required]" v-model="newAtendente.cpf" density="compact" @keyup="maskcpf()"/>
                  <v-text-field label="E-mail" type="email" :rules="[rules.required]" v-model="newAtendente.email" density="compact"/>
                  <v-text-field label="Senha" type="password" :rules="[rules.required, rules.min]" v-model="newAtendente.senha" density="compact"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="addAtendente(newAtendente)" class="w-1/2 mb-2 !bg-[#ce1b2bee] text-white">Adicionar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="updateDialog" width="50%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  Editar atendente
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="updateDialog = false; atendenteUpdating = defaultAtendente;"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nome" :rules="[rules.required]" v-model="atendenteUpdating.nome" density="compact"/>
                  <v-text-field label="CPF" :rules="[rules.required]" v-model="atendenteUpdating.cpf" density="compact" @keyup="maskcpfupd()"/>
                  <v-text-field label="E-mail" type="email" :rules="[rules.required]" v-model="atendenteUpdating.email" density="compact"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="updateAtendente(atendenteUpdating)" class="w-1/2 mb-2 !bg-[#ce1b2bee] text-white">Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteDialog" width="auto" persistent>
              <v-card>
                <v-card-title class="d-flex mb-6 justify-center font-extrabold">
                    <h1>Excluir atendente {{ deleteAtendente.nome }}?</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="deleteAtendenteFunc(deleteAtendente.id)" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="deleteDialog = false; deleteAtendente = {}" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" min-width="30%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  {{ viewAtendente.nome }}
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewAtendente = defaultAtendente;"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Atendente:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Nome:</span> {{ viewAtendente.nome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">CPF:</span> {{ viewAtendente.cpf }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">E-mail:</span> {{ viewAtendente.email }}</div>
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
import * as atendenteService from "../services/atendenteService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'TelaAtendentes',
    components: {
      LogoView
    },
    data() {
      return {
        rules: {
          required: value => !!value || 'Campo obrigatório.',
          min: v => v.length >= 8 || 'Mínimo 8 caracteres.'
        },
        defaultAtendente: {
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
        newAtendente: {
          nome: null,
          cpf: null,
          email: null,
          senha: null
        },
        updateDialog: false,
        atendenteUpdating: null,
        deleteAtendente: null,
        viewAtendente: null,
        deleteDialog: false,
        viewDialog: false,
        atendentes: []
    }
  },
  props: {
    userData: Object,
  },
  methods: {
    refreshAtendentes: async function () {
      atendenteService.getAtendentes(this.searchName, this.searchCpf).then(res => {
        if (res.length && res.length > 0) this.atendentes = res;
        else {
          this.atendentes = [];
          this.atendentes.push(res);
        }
      }).catch(() => {
        this.atendentes = [];
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
      var cpf = this.newAtendente.cpf.split(/\/|\.|-/).join("");
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
      this.newAtendente.cpf = cpf;
    },
    maskcpfupd() {
      var cpf = this.atendenteUpdating.cpf.split(/\/|\.|-/).join("");
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
      this.atendenteUpdating.cpf = cpf;
    },
    addAtendente: async function (data) {
      if (!data.nome || !data.cpf || !data.senha || !data.email)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        atendenteService.createAtendente(data).then(() => {
          this.$toast.success("Atendente cadastrado com sucesso.");
          this.refreshAtendentes();
          this.createDialog = false;
          this.newAtendente = this.defaultAtendente;
        }).catch(err => {return err});
      }
    },
    updateAtendente: async function (data) {
      if (!data.nome || !data.cpf || !data.email || !data.id)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        atendenteService.updateAtendente(data).then(() => {
          this.$toast.success("Atendente editado com sucesso.");
          this.refreshAtendentes();
          this.updateDialog = false;
          this.atendenteUpdating = this.defaultAtendente;
        }).catch(err => {return err});
      }
    },
    deleteAtendenteFunc: async function (id) {
      if (!id)
        this.$toast.error("Um erro ocorreu.");
      else {
        atendenteService.deleteAtendente(id).then(() => {
          this.$toast.success("Atendente excluído com sucesso.");
          this.refreshAtendentes();
          this.deleteDialog = false;
          this.deleteAtendente = this.defaultAtendente;
        }).catch(err => {return err});
      }
    },
    showAtendente: async function (atendente) {
      this.viewDialog=true;
      this.viewAtendente = atendente;
    }
  },
  mounted() {
    this.refreshAtendentes();
  }
  });
</script>