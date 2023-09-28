<template>
  <div class="container m-auto p-10 h-full d-flex flex-col">
    <div class="mb-10">
      <v-row class="flex w-full h-fit">
        <v-col cols="8">
          <v-text-field
            class="mx-5"
            label="Nome"
            placeholder="Ex: Arnaldo da Silva"
            append-inner-icon="mdi-magnify"
            variant="solo"
            color="rgb(201, 24, 39)"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="tipoUsuario"
            label="Buscar entre"
            :items="['Clientes']"
            variant="solo"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-btn
            variant="tonal"
            size="large"
            dense
            @click="estadoDialogCadastro = !estadoDialogCadastro"
            >Cadastrar</v-btn
          >
        </v-col>
      </v-row>
    </div>

    <DataTable
      :items-per-page="itemsPerPage"
      :headers="headers"
      :data="clientes"
      :density="onMobileScreen ? 'compact' : 'default'"
      @estadoDialog="_estadoDialog"
      @dadosUsuario="dadosUsuario"
    />
  </div>

  <EditDialog
    v-model="estadoDialog"
    @closeAction="estadoDialog = !estadoDialog"
    :usuarioDisplay="usuarioDisplay"
  />
  <CadastroDialog
    v-model="estadoDialogCadastro"
    @closeAction="estadoDialogCadastro = !estadoDialogCadastro"
  />
</template>

<script setup>

import { ref, onBeforeMount } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import * as atendenteService from "../services/atendenteService";
import DataTable from "../components/DataTable.vue";
import EditDialog from "../components/EditDialog.vue";
import CadastroDialog from "../components/CadastroDialog.vue";

let estadoDialog = ref(false);
const _estadoDialog = (evento) => {
  estadoDialog.value = evento;
};

let estadoDialogCadastro = ref(false);

const tipoUsuario = ref("Clientes");

const clientes = ref([]);

const usuarioDisplay = ref();
let dadosUsuario = (evento) => {
  usuarioDisplay.value = evento.value;
};
// Table Values
const itemsPerPage = 5;
const headers = [
  {
    title: "Id",
    align: "center",
    sortable: true,
    key: "id",
  },
  {
    title: "Nome",
    align: "center",
    sortable: true,
    key: "nome",
  },
  {
    title: "Email",
    align: "center",
    sortable: true,
    key: "email",
  },
  {
    title: "Data de cadastro",
    align: "center",
    sortable: true,
    key: "dataCadastro",
  },
  {
    title: "Ações",
    align: "center",
    sortable: false,
    key: "actions",
  },
];
const breaks = useDisplay();
const onMobileScreen = ref(breaks.smAndDown);

onBeforeMount(() => {
  atendenteService
    .getClientes()
    .then((res) => {
      clientes.value = res;
    })
    .catch((err) => console.log(err));
});
</script>
<style></style>
