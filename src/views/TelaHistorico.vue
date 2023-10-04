<template>
  <div class="container m-auto p-10 h-full d-flex flex-col">
    <div class="mb-10">
      <LogoView />
      <div class="d-flex flex-col justify-center align-middle">
        <div class="mx-auto w-6/12 mb-5 d-flex">
          <div :class="['text-center border-[2px] w-6/12 py-4 text-2xl font-bold cursor-pointer hover:border-white dark:bg-slate-900', history == 'rs' ? 'border-white' : 'border-slate-900']"
            @click="history = 'rs'; refreshData();">Reservas</div>
          <div :class="['text-center border-[2px] w-6/12 py-4 text-2xl font-bold cursor-pointer hover:border-white dark:bg-slate-900', history == 'ep' ? 'border-white' : 'border-slate-900']"
            @click="history = 'ep'; refreshDataEP();">Empréstimos</div>
        </div>
        <div v-if="history == 'rs'" class="mx-auto w-6/12">
          <div class="d-flex">
            <v-select
              class="mb-4"
              :loading="loadingStatus"
              v-model="searchStatus"
              density="compact"
              variant="solo"
              label="pesquisar por status"
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
                  <th class="text-left px-4 py-2">Data</th>
                  <th class="text-left px-4 py-2">Status</th>
                  <th class="text-right px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="reserva in reservas" :key="reserva.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ formatDate(reserva.dataReserva) }}</td>
                  <td class="px-4 py-2 text-left">{{ reserva.status }}</td>
                  <td class="px-4 py-2 text-right">
                    <v-tooltip v-if="userData?.tipoUsuario == 'CLIENTE' && reserva.status == 'ATIVA'" text="Cancelar Reserva" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-cancel" size="small" @click="startAction(reserva)"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-icon icon="mdi-eye ml-2" size="small" @click="showReserva(reserva)"></v-icon>
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
                    <h1>Cancelar reserva?</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="cancelarReserva()" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="cleanDialog()" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewReserva = defaultReserva;"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Reserva:</span></div>
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
        <!-- EMPRESTIMOS -->
        <div v-else class="mx-auto w-6/12">
          <div class="d-flex">
            <v-select
              class="mb-4"
              v-model="searchStatusEP"
              density="compact"
              variant="solo"
              label="pesquisar por status"
              :items="statusDropdownEP"
              single-line
              hide-details
              @update:modelValue="refreshDataEP"
            ></v-select>
          </div>

          <div>
            <table class="table-auto border-[2px] dark:border-gray-950 border-gray-500 w-full">
              <thead class="dark:bg-gray-900 bg-gray-400 border-[2px] dark:border-gray-950 border-gray-500">
                <tr>
                  <th class="text-left px-4 py-2">Data</th>
                  <th class="text-left px-4 py-2">Prazo</th>
                  <th class="text-left px-4 py-2">Status</th>
                  <th class="text-left px-4 py-2">Multa</th>
                  <th class="text-right px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody class="dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
                <tr v-for="emprestimo in emprestimos" :key="emprestimo.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ formatDate(emprestimo.dataEmprestimo) }}</td>
                  <td class="px-4 py-2 text-left">{{ formatDate(emprestimo.prazoDevolucao) }}</td>
                  <td class="px-4 py-2 text-left">{{ emprestimo.status }}</td>
                  <td :class="['px-4 py-2 text-left font-bold', emprestimo.multa ? 'text-[#ff2222]' : '']">R$ {{ emprestimo.multa ? emprestimo.multa?.toLocaleString('en-us', { minimumIntegerDigits: 2 }) : '00' }},00</td>
                  <td class="px-4 py-2 text-right">
                    <v-icon icon="mdi-eye" size="small" @click="showEmprestimo(emprestimo)"></v-icon>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="emprestimos.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="viewDialogEP" width="auto" max-height="70%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialogEP = false; viewEmprestimo = defaultEmprestimo;"></v-icon>
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
import * as reservaService from "../services/reservaService";
import * as clienteService from "../services/clienteService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
import moment from 'moment';
  
  export default defineComponent({
    name: 'TelaHistorico',
    components: {
      LogoView
    },
    data() {
      return {
        history: 'rs',
        statusDropdown: [
          "Todos",
          "Ativa",
          "Cancelada",
          "Expirada",
          "Finalizada"
        ],
        statusDropdownEP: [
          "Todos",
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
        defaultReserva: {
          id: null,
          dataReserva: null,
          status: null,
          clienteId: null,
          clienteNome: null,
          obras: {}
        },
        searchStatus: null,
        searchStatusEP: null,
        loadingStatus: false,
        viewEmprestimo: null,
        viewDialogEP: false,
        confirmDialog: false,
        confirmData: null,
        viewReserva: null,
        viewDialog: false,
        emprestimos: [],
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
      return moment(date).format("DD/MM/YYYY");
    },
    refreshData: async function () {
      clienteService.getHistoricoReserva(this.userData?.id).then(res => {
        let data = res.data;
        if (this.searchStatus && this.searchStatus != "Todos")
          data = data.filter(x => x.status == this.searchStatus.toUpperCase());
        this.reservas = data;
      }).catch(() => {
        this.reservas = [];
      })
    },
    refreshDataEP: async function () {
      clienteService.getHistoricoEmprestimo(this.userData?.id).then(res => {
        let data = res.data;
        if (this.searchStatusEP && this.searchStatusEP != "Todos")
          data = data.filter(x => x.status == this.searchStatusEP.toUpperCase());
        this.emprestimos = data;
      }).catch(() => {
        this.emprestimos = [];
      })
    },
    showEmprestimo: async function (emprestimo) {
      this.viewDialogEP=true;
      this.viewEmprestimo = emprestimo;
    },
    showReserva: async function (reserva) {
      this.viewDialog=true;
      this.viewReserva = reserva;
    },
    startAction: function (reserva) {
      this.confirmData = reserva;
      this.confirmDialog = true;
    },
    cleanDialog: function () {
      this.confirmData = null;
      this.confirmDialog = false;
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
  },
  mounted() {
    this.refreshData();
  }
  });
</script>