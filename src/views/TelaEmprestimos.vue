<template>
  <div class="container m-auto p-10 h-full d-flex flex-col">
    <div class="mb-10">
      <LogoView />
      <div class="d-flex flex-col justify-center">
        <div class="w-6/12 mx-auto">
          <div class="d-flex">
            <v-text-field
              class="mb-4 mr-4 w-[20%]"
              :loading="loadingNome"
              v-model="searchName"
              density="compact"
              variant="solo"
              label="filtrar cliente"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @click:append-inner="refreshData()"
              @keyup.enter="refreshData()"
            ></v-text-field>
            <v-select
              class="mb-4"
              :loading="loadingCpf"
              v-model="searchStatus"
              density="compact"
              variant="solo"
              label="pesquisar por status"
              append-inner-icon="mdi-magnify"
              :items="statusDropdown"
              single-line
              hide-details
              @update:modelValue="refreshData"
            ></v-select>
          </div>

          <div>
            <table class="table-auto border-[2px] dark:border-gray-950 border-gray-500 w-full">
              <thead class="dark:bg-gray-900 bg-gray-400 border-[2px] dark:border-gray-950 border-gray-500">
                <tr>
                  <th class="text-left px-4 py-2">Cliente</th>
                  <th class="text-left px-4 py-2">Data</th>
                  <th class="text-left px-4 py-2">Status</th>
                  <th class="text-left px-4 py-2">Multa</th>
                  <th class="text-right px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="emprestimo in emprestimos" :key="emprestimo.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ emprestimo.clienteNome }}</td>
                  <td class="px-4 py-2 text-left">{{ formatDate(emprestimo.dataEmprestimo) }}</td>
                  <td class="px-4 py-2 text-left">{{ emprestimo.status }}</td>
                  <td :class="['px-4 py-2 text-left font-bold', emprestimo.multa ? 'text-[#ff2222]' : '']">R$ {{ emprestimo.multa ? emprestimo.multa?.toLocaleString('en-us', { minimumIntegerDigits: 2 }) : '00' }},00</td>
                  <td class="px-4 py-2 text-right min-w-[110px]">
                    <v-icon icon="mdi-eye" size="small" @click="showEmprestimo(emprestimo)"></v-icon>
                    <v-tooltip v-if="userData?.tipoUsuario == 'ATENDENTE'" text="Renovar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-autorenew" size="small" class="ml-2" @click="startAction(emprestimo, 'Renovar')"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip v-if="userData?.tipoUsuario == 'ATENDENTE' && !emprestimo.multa" text="Devolver" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-book-arrow-up" size="small" class="ml-2" @click="startAction(emprestimo, 'Devolver')"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip v-if="userData?.tipoUsuario == 'ATENDENTE' && emprestimo.multa" text="Pagar Multa e Devolver" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-currency-usd" size="small" class="ml-2" @click="startAction(emprestimo, 'Pagar Multa do')"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip v-if="userData?.tipoUsuario == 'ATENDENTE'" text="Cancelar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-cancel" size="small" class="ml-2" @click="startAction(emprestimo, 'Cancelar')"></v-icon>
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="emprestimos.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="confirmDialog" width="auto" persistent>
              <v-card>
                <v-card-title class="d-flex mb-6 justify-center font-extrabold">
                    <h1>{{ action + ' emprestimo?' }}?</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="sendAction()" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="cleanDialog()" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewEmprestimo = defaultEmprestimo;"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Emprestimo:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Cliente:</span> {{ viewEmprestimo.clienteNome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Data:</span> {{ formatDate(viewEmprestimo.dataEmprestimo) }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Prazo:</span> {{ formatDate(viewEmprestimo.prazoDevolucao) }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Devolução:</span> {{ formatDate(viewEmprestimo.dataDevolucao) }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Renovações disponíveis:</span> {{ viewEmprestimo.quantidadeRenovacao?.toLocaleString("en-us", { minimumIntegerDigits: 2 }) }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Inadimplente:</span> {{ viewEmprestimo.inadimplencia ? "Sim" : "Não" }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Status:</span> {{ viewEmprestimo.status }}</div>
                  <div class="mt-2"><span class="font-bold text-xl">Obras:</span></div>
                  <div v-for="obra in viewEmprestimo.obras" :key="obra.id">
                    <div class="mt-1 ml-2">{{ obra.titulo }}</div>
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
import * as emprestimoService from "../services/emprestimoService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
import moment from 'moment';
  
  export default defineComponent({
    name: 'TelaEmprestimos',
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
        statusDropdown: [
          "Ativo",
          "Cancelado",
          "Atrasado",
          "Devolvido"
        ],
        defaultEmprestimo: {
          id: null,
          dataEmprestimo: null,
          dataDevolucao: null,
          prazoDevolucao: null,
          quantidadeRenovacao: null,
          inadimplencia: null,
          multa: null,
          status: null,
          clienteNome: null,
          obras: {}
        },
        searchName: null,
        searchStatus: null,
        loadingCpf: false,
        loadingNome: false,
        confirmDialog: false,
        confirmData: null,
        action: null,
        viewEmprestimo: null,
        viewDialog: false,
        emprestimos: []
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
    formatDate: function (date) {
      if (!date) return "--";
      return moment(date).format("DD/MM/YYYY");
    },
    refreshData: async function () {
      emprestimoService.getEmprestimos(this.searchName, this.searchStatus).then(res => {
        this.emprestimos = res;
      }).catch(() => {
        this.emprestimos = [];
      })
    },
    showEmprestimo: async function (emprestimo) {
      this.viewDialog=true;
      this.viewEmprestimo = emprestimo;
    },
    startAction: function (emprestimo, action) {
      this.action = action;
      this.confirmData = emprestimo;
      this.confirmDialog = true;
    },
    cleanDialog: function () {
      this.action = null;
      this.confirmData = null;
      this.confirmDialog = false;
    },
    sendAction: function () {
      if (this.action == "Renovar") {
        emprestimoService.renovar(this.confirmData.id)
        .then(() => {
          this.$toast.success("Empréstimo renovado.");
          this.refreshData();
        })
        /* eslint-disable-next-line */
        .catch(_ => {});
        this.cleanDialog();
      }
      else if (this.action == "Devolver") {
        emprestimoService.devolver(this.confirmData.id)
        .then(() => {
          this.$toast.success("Empréstimo devolvido.");
          this.refreshData();
        })
        /* eslint-disable-next-line */
        .catch(_ => {});
        this.cleanDialog();
      }else if (this.action == "Pagar Multa do") {
        emprestimoService.pagar(this.confirmData.id).then(() => {
          this.$toast.success("Multa paga e empréstimo devolvido.");
          this.refreshData();
        })
        /* eslint-disable-next-line */
        .catch(_ => {});
        this.cleanDialog();
      }else if (this.action == "Cancelar") {
        emprestimoService.cancelar(this.confirmData.id).then(() => {
          this.$toast.success("Empréstimo cancelado.");
          this.refreshData();
        })
        /* eslint-disable-next-line */
        .catch(_ => {});
        this.cleanDialog();
      }
    }
  },
  mounted() {
    this.refreshData();
  }
  });
</script>