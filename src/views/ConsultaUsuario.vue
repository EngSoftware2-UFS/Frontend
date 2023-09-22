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

    <v-row>
      <v-col>
        <v-table v-if="tipoUsuario === 'Clientes'" elevation="24">
          <thead>
            <tr>
              <th
                v-for="(header, index) in headers"
                :key="index"
                class="text-left"
              >
                {{ header.value }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dados, index) in clientes" :key="index">
              <td>{{ dados.nome }}</td>
              <td>{{ dados.email }}</td>
              <td>{{ dados.dataCadastro.split("T")[0] }}</td>
              <td>
                <v-col cols="auto">
                  <v-btn
                    variant="plain"
                    density="comfortable"
                    icon="mdi-pencil"
                    @click="abrirUsuarioDialog(dados)"
                  ></v-btn>
                </v-col>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
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
  <!-- pendendo componentizar -->

  <!-- <v-dialog v-model="estadoDialogCadastro" width="1000" persistent>
    <v-card>
      <v-card-text>
        <v-row>
          <h1 class="text-2xl font-semibold p-2">Informaçoes do Usuário</h1>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Nome completo"
              hide-details="auto"
              v-model="novoCliente.nome"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Endereço de email"
              placeholder="exemplo@email.com"
              type="email"
              v-model="novoCliente.email"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="CPF"
              hide-details="auto"
              v-model="novoCliente.cpf"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Senha"
              hide-details="auto"
              v-model="novoCliente.senha"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <h1 class="text-2xl font-semibold p-2">Informaçoes do Endereço</h1>
        </v-row>
        <v-row>
          <v-col cols="4"
            ><v-text-field
              label="Endereco"
              hide-details="auto"
              v-model="novoCliente.endereco.logradouro"
            ></v-text-field>
          </v-col>
          <v-col cols="3"
            ><v-text-field
              label="Numero"
              hide-details="auto"
              v-model="novoCliente.endereco.numero"
            ></v-text-field>
          </v-col>
          <v-col cols="2"
            ><v-text-field
              label="Bairro"
              hide-details="auto"
              v-model="novoCliente.endereco.bairro"
            ></v-text-field>
          </v-col>
          <v-col cols="3"
            ><v-text-field
              label="Cidade"
              hide-details="auto"
              v-model="novoCliente.endereco.cidade"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            ><v-text-field
              label="Complemento"
              hide-details="auto"
              v-model="novoCliente.endereco.complemento"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="flex justify-end">
        <v-btn color="#c91827" @click="estadoDialogCadastro = false"
          >Cancelar</v-btn
        >

        <v-btn color="green" variant="outlined" @click="cadastrarUsuario"
          >Cadastrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import * as atendenteService from "../services/atendenteService";
import EditDialog from "../components/EditDialog.vue";
import CadastroDialog from "../components/CadastroDialog.vue";

let estadoDialog = ref(false);
let estadoDialogCadastro = ref(false);

const tipoUsuario = ref("Clientes");

const clientes = ref([]);

const usuarioDisplay = ref({});

const headers = [
  { value: "Nome" },
  { value: "Email" },
  { value: "Data de cadastro" },
  { value: "Ações" },
];

const abrirUsuarioDialog = (dados) => {
  usuarioDisplay.value = dados;
  estadoDialog.value = !estadoDialog.value;
};

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
