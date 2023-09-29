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
              @keyup="refreshClients()"
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
              @click:append-inner="refreshClients()"
              @keyup.enter="refreshClients()"
            ></v-text-field>
            <v-tooltip text="Cadastrar Cliente" location="top">
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
                <tr v-for="cliente in clientes" :key="cliente.id" class="border-[2px] dark:border-gray-950 border-gray-500">
                  <td class="px-4 py-2 text-left">{{ cliente.nome }}</td>
                  <td class="px-4 py-2 text-left">{{ cpf(cliente.cpf) }}</td>
                  <td class="px-4 py-2 text-left">{{ cliente.email }}</td>
                  <td class="px-4 py-2 text-right min-w-[110px]">
                    <v-icon icon="mdi-eye" size="small" @click="showCliente(cliente)"></v-icon>
                    <v-icon icon="mdi-update" size="small" class="ml-2" @click="updateDialog=true; clientUpdating = cliente"></v-icon>
                    <v-icon v-if="userData?.tipoUsuario == 'BIBLIOTECARIO'" icon="mdi-delete" size="small" class="ml-2" @click="deleteDialog=true; deleteClient = cliente"></v-icon>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="clientes.length == 0" class="px-4 py-2 d-flex justify-center text-center dark:bg-gray-800 bg-slate-300 border-[2px] dark:border-gray-950 border-gray-500">
              Nenhum resultado encontrado
            </div>
            <v-dialog v-model="createDialog" width="50%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  Cadastrar Cliente
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="createDialog = false; newCliente = defaultClient"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nome" :rules="[rules.required]" v-model="newCliente.nome" density="compact"/>
                  <v-text-field label="CPF" :rules="[rules.required]" v-model="newCliente.cpf" density="compact"/>
                  <v-text-field label="E-mail" type="email" :rules="[rules.required]" v-model="newCliente.email" density="compact"/>
                  <v-text-field label="Senha" type="password" :rules="[rules.required, rules.min]" v-model="newCliente.senha" density="compact"/>
                  <v-text-field label="Cidade" :rules="[rules.required]" v-model="newCliente.endereco.cidade" density="compact"/>
                  <v-text-field label="Bairro" :rules="[rules.required]" v-model="newCliente.endereco.bairro" density="compact"/>
                  <v-text-field label="Logradouro" v-model="newCliente.endereco.logradouro" density="compact"/>
                  <v-text-field label="Número" v-model="newCliente.endereco.numero" density="compact"/>
                  <v-text-field label="Complemento" v-model="newCliente.endereco.complemento" density="compact"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn @click="addCliente(newCliente)" class="dark:bg-slate-900 dark:text-white bg-indigo-300">Adicionar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="updateDialog" width="50%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  Editar cliente
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="updateDialog = false; clientUpdating = defaultClient;"></v-icon>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nome" :rules="[rules.required]" v-model="clientUpdating.nome" density="compact"/>
                  <v-text-field label="CPF" :rules="[rules.required]" v-model="clientUpdating.cpf" density="compact"/>
                  <v-text-field label="E-mail" type="email" :rules="[rules.required]" v-model="clientUpdating.email" density="compact"/>
                  <v-text-field label="Cidade" :rules="[rules.required]" v-model="clientUpdating.endereco.cidade" density="compact"/>
                  <v-text-field label="Bairro" :rules="[rules.required]" v-model="clientUpdating.endereco.bairro" density="compact"/>
                  <v-text-field label="Logradouro" v-model="clientUpdating.endereco.logradouro" density="compact"/>
                  <v-text-field label="Número" v-model="clientUpdating.endereco.numero" density="compact"/>
                  <v-text-field label="Complemento" v-model="clientUpdating.endereco.complemento" density="compact"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn @click="updateCliente(clientUpdating)" class="dark:bg-gray-900 dark:text-white bg-indigo-300 px-4">Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteDialog" width="auto" persistent>
              <v-card>
                <v-card-title class="d-flex mb-6 justify-center font-extrabold">
                    <h1>Excluir cliente {{ deleteClient.nome }}?</h1>
                </v-card-title>
                <v-card-actions class="d-flex justify-center">
                  <v-btn @click="deleteCliente(deleteClient.id)" class="bg-green-700 text-white">Confirmar</v-btn>
                  <v-btn @click="deleteDialog = false; deleteClient = {}" class="bg-red-700 text-white">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="viewDialog" width="auto" max-height="70%" persistent>
              <v-card>
                <v-card-title class="d-flex">
                  <v-spacer></v-spacer>
                  <v-icon icon="mdi-close" @click="viewDialog = false; viewClient = defaultClient; reservas = {obras: {}}; emprestimos = {obras: {}}"></v-icon>
                </v-card-title>
                <v-card-text class="px-10 py-5">
                  <div class="mt-2"><span class="font-bold text-xl">Cliente:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Nome:</span> {{ viewClient.nome }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">CPF:</span> {{ cpf(viewClient.cpf) }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">E-mail:</span> {{ viewClient.email }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Inadimplente:</span> {{ getInadimplencia }}</div>
                  <div class="mt-2"><span class="font-bold text-xl">Endereço:</span></div>
                  <div class="mt-1 ml-2"><span class="font-bold">Cidade:</span> {{ viewClient?.endereco?.cidade }}</div>
                  <div class="mt-1 ml-2"><span class="font-bold">Bariro:</span> {{ viewClient?.endereco?.bairro }}</div>
                  <div class="mt-1 ml-2" v-if="viewClient?.endereco?.logradouro"><span class="font-bold">Logradouro:</span> {{ viewClient?.endereco?.logradouro }}</div>
                  <div class="mt-1 ml-2" v-if="viewClient?.endereco?.numero"><span class="font-bold">Número:</span> {{ viewClient?.endereco?.numero }}</div>
                  <div class="mt-1 ml-2" v-if="viewClient?.endereco?.complemento"><span class="font-bold">Complemento:</span> {{ viewClient?.endereco?.complemento }}</div>
                  <div class="mt-4">
                    <span class="font-bold text-xl">Reservas:</span>
                    <ul class="d-flex flex-col">
                      <li class="ml-2 mb-2" v-for="r in reservas" :key="r.id">
                        <span class="font-bold">Data:</span> {{ format(r.dataReserva) }} <br />
                        <span class="font-bold">Obras:</span> {{ listObras(r.obras) }}  <br />
                        <span class="font-bold">{{ r.status }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-4">
                    <span class="font-bold text-xl">Empréstimos:</span>
                    <ul class="d-flex flex-col">
                      <li class="ml-2 mb-2" v-for="e in emprestimos" :key="e.id">
                        <span class="font-bold">Data:</span> {{ format(e.dataEmprestimo) }} <br />
                        <span class="font-bold">Obras:</span> {{ listObras(e.obras) }} <br />
                        <span class="font-bold" v-if="!e.dataDevolucao">Prazo: {{ format(e.prazoDevolucao) }}</span> <br />
                        <span class="font-bold" v-if="e.dataDevolucao">Devolvido: {{ format(e.dataDevolucao) }}</span>
                        <span class="font-bold">{{ e.status }}</span>
                      </li>
                    </ul>
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
import * as clienteService from "../services/clienteService";
import LogoView from "../components/Logo.vue";
import { defineComponent } from 'vue';
import moment from 'moment';
  
  export default defineComponent({
    name: 'TelaClientes',
    components: {
      LogoView
    },
    data() {
      return {
        rules: {
          required: value => !!value || 'Campo obrigatório.',
          min: v => v.length >= 8 || 'Mínimo 8 caracteres.'
        },
        defaultClient: {
          nome: null,
          cpf: null,
          email: null,
          senha: null,
          endereco: {
            cidade: null,
            bairro: null,
            logradouro: null,
            numero: null,
            complemento: null
          }
        },
        searchName: null,
        searchCpf: null,
        loadingCpf: false,
        loadingNome: false,
        createDialog: false,
        newCliente: {
          nome: null,
          cpf: null,
          email: null,
          senha: null,
          endereco: {
            cidade: null,
            bairro: null,
            logradouro: null,
            numero: null,
            complemento: null
          }
        },
        updateDialog: false,
        clientUpdating: null,
        deleteClient: null,
        viewClient: null,
        deleteDialog: false,
        viewDialog: false,
        clientes: [],
        emprestimos: {
          obras: {}
        },
        reservas: {
          obras: {}
        }
    }
  },
  props: {
    userData: Object,
  },
  computed: {
    getInadimplencia() {
      return this.viewClient?.inadimplencia;
    }
  },
  methods: {
    refreshClients: async function () {
      clienteService.getClientes(this.searchName, this.searchCpf).then(res => {
        if (res.length && res.length > 0) this.clientes = res;
        else {
          this.clientes = [];
          this.clientes.push(res);
        }
      }).catch(() => {
        this.clientes = [];
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
    addCliente: async function (data) {
      if (!data.nome || !data.cpf || !data.senha || !data.email || !data.endereco.cidade || !data.endereco.bairro)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        clienteService.createCliente(data).then(() => {
          this.$toast.success("Cliente cadastrado com sucesso.");
          this.refreshClients();
          this.createDialog = false;
          this.newCliente = this.defaultClient;
        }).catch(err => {return err});
      }
    },
    updateCliente: async function (data) {
      if (!data.nome || !data.cpf || !data.email || !data.endereco.cidade || !data.endereco.bairro || !data.id)
        this.$toast.error("Preencha todos os campos obrigatórios.");
      else {
        clienteService.updateCliente(data).then(() => {
          this.$toast.success("Cliente editado com sucesso.");
          this.refreshClients();
          this.updateDialog = false;
          this.clientUpdating = this.defaultClient;
        }).catch(err => {return err});
      }
    },
    deleteCliente: async function (id) {
      if (!id)
        this.$toast.error("Um erro ocorreu.");
      else {
        clienteService.deleteCliente(id).then(() => {
          this.$toast.success("Cliente excluído com sucesso.");
          this.refreshClients();
          this.deleteDialog = false;
          this.deleteClient = this.defaultClient;
        }).catch(err => {return err});
      }
    },
    getReservas: async function (id) {
      await clienteService.getHistoricoReserva(id).then(res => {
        this.reservas = res.data;
      }).catch(err => { return err });
    },
    getEmprestimos: async function (id) {
      await clienteService.getHistoricoEmprestimo(id).then(res => {
        this.emprestimos = res.data;
      }).catch(err => { return err });
    },
    format(date) {
      if (!date) return date;

      return moment(date).format("DD/MM/YYYY");
    },
    listObras(obras) {
      if (!obras) return obras;

      var obrastr = "";
      for(var o in obras) {
        obrastr += obras[o].titulo + "; ";
      }

      return obrastr;
    },
    verificaInadimplencia: function () {
      if (this.emprestimos && this.emprestimos.filter(e => e.inadimplencia).length > 0) {
        return "Sim";
      }
      return "Não";
    },
    showCliente: async function (cliente) {
      this.viewDialog=true;
      this.viewClient = cliente;
      await this.getReservas(cliente.id);
      await this.getEmprestimos(cliente.id);
      this.viewClient.inadimplencia = this.verificaInadimplencia();
    }
  },
  mounted() {
    this.refreshClients();
  }
  });
</script>