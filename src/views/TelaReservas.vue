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
                  <th class="text-right px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="reserva in reservas" :key="reserva.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ reserva.clienteNome }}</td>
                  <td class="px-4 py-2 text-left">{{ formatDate(reserva.dataReserva) }}</td>
                  <td class="px-4 py-2 text-left">{{ reserva.status }}</td>
                  <td class="px-4 py-2 text-right min-w-[110px]">
                    <v-icon icon="mdi-eye" size="small" @click="showReserva(reserva)"></v-icon>
                    <v-tooltip v-if="userData?.tipoUsuario == 'ATENDENTE'" text="Realizar Empréstimo" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-book-plus" size="small" class="ml-2" @click="startAction(reserva, 'Realizar o empréstimo desta reserva?', 'emprestar')"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip v-if="userData?.tipoUsuario == 'ATENDENTE'" text="Cancelar Reserva" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-cancel" size="small" class="ml-2" @click="startAction(reserva, 'Cancelar reserva?', 'cancelar')"></v-icon>
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="reservas.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="confirmDialog" width="auto" persistent>
              <v-card>
                <v-card-title class="d-flex mb-6 justify-center font-extrabold">
                    <h1>{{ text }}</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="sendAction()" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="cleanDialog()" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" min-width="30%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewReserva = defaultReserva;"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Reserva:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Cliente:</span> {{ viewReserva.clienteNome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Data:</span> {{ formatDate(viewReserva.dataReserva) }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Status:</span> {{ viewReserva.status }}</div>
                  <div class="mt-2"><span class="font-bold text-xl">Obras:</span></div>
                  <div v-for="obra in viewReserva.obras" :key="obra.id">
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
import * as reservaService from "../services/reservaService";
import * as emprestimoService from "../services/emprestimoService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
import moment from 'moment';
  
  export default defineComponent({
    name: 'TelaReservas',
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
          "Ativa",
          "Cancelada",
          "Expirada",
          "Finalizada"
        ],
        defaultReserva: {
          id: null,
          dataReserva: null,
          status: null,
          clienteId: null,
          clienteNome: null,
          obras: {}
        },
        searchName: null,
        searchStatus: null,
        loadingCpf: false,
        loadingNome: false,
        confirmDialog: false,
        confirmData: null,
        text: null,
        action: null,
        viewReserva: null,
        viewDialog: false,
        reservas: []
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
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    refreshData: async function () {
      reservaService.getReservas(this.searchName, this.searchStatus).then(res => {
        this.reservas = res;
      }).catch(() => {
        this.reservas = [];
      })
    },
    showReserva: async function (reserva) {
      this.viewDialog=true;
      this.viewReserva = reserva;
    },
    startAction: function (reserva, text, action) {
      this.text = text;
      this.action = action;
      this.confirmData = reserva;
      this.confirmDialog = true;
    },
    cleanDialog: function () {
      this.text = null;
      this.action = null;
      this.confirmData = null;
      this.confirmDialog = false;
    },
    sendAction: async function () {
      if (this.action == 'emprestar') {
        await this.emprestar();
      }
      else if (this.action == 'cancelar') {
        await this.cancelarReserva();
      }
    },
    cancelarReserva: async function () {
      reservaService.cancelar(this.confirmData.id)
      .then(() => {
        this.$toast.success("Reserva cancelada.");
        this.refreshData();
      })
      /* eslint-disable-next-line */
      .catch(_ => {});
      this.cleanDialog();
    },
    emprestar: async function () {
      emprestimoService.createEmprestimo({ clientId: this.confirmData.clienteId, reservaId: this.confirmData.id })
      .then(() => {
        this.$toast.success("Reserva finalizada e empréstimo criado.");
        this.refreshData();
      })
      /* eslint-disable-next-line */
      .catch(_ => {});
      this.cleanDialog();
    }
  },
  mounted() {
    this.refreshData();
  }
  });
</script>