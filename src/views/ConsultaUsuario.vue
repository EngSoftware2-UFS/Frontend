<template>
  <div class="container m-auto p-10 h-full d-flex flex-col">
    <div class="mb-10">
      <v-row class="flex w-full h-fit justify-between">
        <v-col cols="9">
          <v-text-field
            class="mx-5"
            label="Nome"
            placeholder="Ex: Arnaldo da Silva"
            append-inner-icon="mdi-magnify"
            variant="solo"
            color="rgb(201, 24, 39)"
          ></v-text-field>
        </v-col>

        <v-col>
          <v-select
            v-model="tipoUsuario"
            label="Buscar entre"
            :items="['Clientes', 'Funcionários']"
            variant="solo"
          ></v-select>
        </v-col>
      </v-row>
    </div>

    <v-row>
      <v-col>
        <v-table v-if="tipoUsuario === 'Clientes'" elevation="24">
          <thead>
            <tr>
              <th
                v-for="(header, index) in headersCliente"
                :key="index"
                class="text-left"
              >
                {{ header.value }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <v-col cols="auto">
                  <v-btn
                    variant="plain"
                    density="comfortable"
                    icon="mdi-pencil"
                  ></v-btn>
                </v-col>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-table v-else>
          <thead>
            <tr>
              <th
                v-for="(header, index) in headersFuncionario"
                :key="index"
                class="text-left"
              >
                {{ header.value }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(funcionario, index) in funcionarios" :key="index">
              <td>{{ funcionario.nome }}</td>
              <td>{{ funcionario.email }}</td>
              <td>{{ funcionario.tipo }}</td>
              <td>
                <v-col cols="auto">
                  <v-btn
                    variant="plain"
                    density="comfortable"
                    icon="mdi-pencil"
                    @click="editarUsuario(funcionario)"
                  ></v-btn>
                </v-col>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>

  <v-dialog v-model="estadoDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        {{ funcionarioDisplay.nome }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="estadoDialog = false"
          >Close Dialog</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
const tipoUsuario = ref("Funcionários");
let estadoDialog = ref(false);

const funcionarios = ref([
  {
    nome: "Lucas",
    email: "lucsallk@hotmail.com",
    tipo: "Bibliotecario",
    endereco: "Aloisio Braga",
    numero: "202",
  },
  {
    nome: "Itallo",
    email: "capivara@hotmail.com",
    tipo: "Atendente",
    endereco: "Outro Braga",
    numero: "404",
  },
]);

const funcionarioDisplay = ref({});

const headersCliente = [
  { value: "Nome" },
  { value: "Email" },
  { value: "Situação" },
  { value: "Ações" },
];

const headersFuncionario = [
  { value: "Nome" },
  { value: "Email" },
  { value: "Tipo" },
  { value: "Ações" },
];

const editarUsuario = (funcionario) => {
  funcionarioDisplay.value = funcionario;
  estadoDialog.value = !estadoDialog.value;
};

onBeforeMount(() => {
  console.log("ola");
});
</script>
<style>
.v-field__input {
  color: rgb(201, 24, 39) !important;
}
</style>
