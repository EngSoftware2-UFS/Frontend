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
              @click="abrirCadastrarDialog"
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
  
    <!-- pendendo componentizar -->
    <v-dialog v-model="estadoDialog" width="1000" persistent>
      <v-card>
        <v-card-text>
          <v-row>
            <h1 class="text-2xl font-semibold p-2">Informaçoes do Usuário</h1>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="usuarioDisplay.nome"
                label="Nome completo"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="usuarioDisplay.email"
                label="Endereço de email"
                placeholder="exemplo@email.com"
                type="email"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="usuarioDisplay.cpf"
                label="CPF"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="usuarioDisplay.dataCadastro"
                label="Data de cadastro"
                hide-details="auto"
                variant="plain"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="bloqueio"
                label="Data de cadastro"
                hide-details="auto"
                variant="plain"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <h1 class="text-2xl font-semibold p-2">Informaçoes do Endereço</h1>
          </v-row>
          <v-row>
            <v-col cols="4"
              ><v-text-field
                v-model="usuarioDisplay.endereco.logradouro"
                label="Logradouro"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="3"
              ><v-text-field
                v-model="usuarioDisplay.endereco.bairro"
                label="Bairro"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="2"
              ><v-text-field
                v-model="usuarioDisplay.endereco.numero"
                label="Numero"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="3"
              ><v-text-field
                v-model="usuarioDisplay.endereco.cidade"
                label="Cidade"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-text-field
                v-model="usuarioDisplay.endereco.complemento"
                label="Complemento"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="flex justify-end">
          <v-btn color="#c91827" @click="estadoDialog = false">Cancelar</v-btn>
  
          <v-btn
            color="green"
            variant="outlined"
            @click="editarUsuario(usuarioDisplay)"
            >Editar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-dialog v-model="estadoDialogCadastro" width="1000" persistent>
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
          <v-btn color="#c91827" @click="estadoDialog = false">Cancelar</v-btn>
  
          <v-btn color="green" variant="outlined" @click="cadastrarUsuario"
            >Cadastrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <button @click="teste">
      clicque
    </button>
  </template>
  
  <script setup>
  import { ref, computed, onBeforeMount } from "vue";
  import * as atendenteService from "../services/atendenteService";
    
  let estadoDialog = ref(false);
  let estadoDialogCadastro = ref(false);
  const tipoUsuario = ref("Clientes");
  
  const bloqueio = computed(() => {
    return usuarioDisplay.value.bloqueio === false ? "Bloqueado" : "Desbloqueado";
  });
  
  const clientes = ref([]);
  
  const usuarioDisplay = ref({});
  
  const headers = [
    { value: "Nome" },
    { value: "Email" },
    { value: "Data de cadastro" },
    { value: "Ações" },
  ];
  
  const abrirCadastrarDialog = () => {
    estadoDialogCadastro.value = !estadoDialogCadastro.value;
  };
  
  const abrirUsuarioDialog = (dados) => {
    usuarioDisplay.value = dados;
    estadoDialog.value = !estadoDialog.value;
  };
  
  const editarUsuario = () => {
    // Pendente endpoint para alteração.
    console.log(usuarioDisplay.value);
  };
  
  const novoCliente = ref({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      complemento: "",
    },
  });
  const teste = () => {
    console.log('teste')
  };
  const cadastrarUsuario = () => {
    atendenteService
      .postCliente(novoCliente.value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    novoCliente.value = {
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      endereco: {
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        complemento: "",
      },
    };
    abrirCadastrarDialog();
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