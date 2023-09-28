<template>
  <v-dialog width="1000" persistent>
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
        <v-btn color="#c91827" @click="() => $emit('closeAction')"
          >Cancelar</v-btn
        >

        <v-btn color="green" variant="outlined" @click="cadastrarUsuario"
          >Cadastrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, defineEmits} from "vue";
import * as atendenteService from "../services/atendenteService";
const emit = defineEmits(["closeAction"]);
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

const cadastrarUsuario = () => {
  atendenteService
    .postCliente(novoCliente.value)
    .then((res) => {
      console.log(res);
      emit("closeAction");
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
