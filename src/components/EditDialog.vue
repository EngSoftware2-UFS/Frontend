<template>
  <v-dialog width="1000" persistent>
    <v-card>
      <v-card-text>
        <v-row>
          <h1 class="text-2xl font-semibold p-2">Informaçoes do Usuário</h1>
        </v-row>
        <v-row>
          {{ usuarioEditado.usuarioDisplay }}
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Nome completo"
              hide-details="auto"
            ></v-text-field>
            <!-- v-model="usuarioDisplay.nome" -->
          </v-col>
          <v-col>
            <v-text-field
              label="Endereço de email"
              placeholder="exemplo@email.com"
              type="email"
            ></v-text-field>
            <!-- v-model="usuarioDisplay.email" -->
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field label="CPF" hide-details="auto"></v-text-field>
            <!-- v-model="usuarioDisplay.cpf" -->
          </v-col>
          <v-col>
            <v-text-field
              label="Data de cadastro"
              hide-details="auto"
              variant="plain"
              readonly
            ></v-text-field>
            <!-- v-model="usuarioDisplay.dataCadastro" -->
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Estado de bloqueio"
              hide-details="auto"
              variant="plain"
              readonly
            ></v-text-field>
            <!-- v-model="bloqueio" -->
          </v-col>
        </v-row>
        <v-row>
          <h1 class="text-2xl font-semibold p-2">Informaçoes do Endereço</h1>
        </v-row>
        <v-row>
          <v-col cols="4"
            ><v-text-field
              label="Logradouro"
              hide-details="auto"
            ></v-text-field>
            <!-- v-model="usuarioDisplay.endereco.logradouro" -->
          </v-col>
          <v-col cols="3"
            ><v-text-field label="Bairro" hide-details="auto"></v-text-field>
            <!-- v-model="usuarioDisplay.endereco.bairro" -->
          </v-col>
          <v-col cols="2"
            ><v-text-field label="Numero" hide-details="auto"></v-text-field>
            <!-- v-model="usuarioDisplay.endereco.numero" -->
          </v-col>
          <v-col cols="3"
            ><v-text-field label="Cidade" hide-details="auto"></v-text-field>
            <!-- v-model="usuarioDisplay.endereco.cidade" -->
          </v-col>
        </v-row>
        <v-row>
          <v-col
            ><v-text-field
              label="Complemento"
              hide-details="auto"
            ></v-text-field>
            <!-- v-model="usuarioDisplay.endereco.complemento" -->
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="flex justify-end">
        <v-btn color="#c91827" @click="() => $emit('closeAction')"
          >Cancelar</v-btn
        >

        <v-btn color="green" variant="outlined" @click="editarUsuario"
          >Editar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, defineProps } from "vue";

const props = defineProps({
  usuarioDisplay: {
    id: Number,
    bloqueio: Boolean,
    nome: String,
    cpf: String,
    email: String,
    dataCadastro: String,
    enderecoId: Number,
    endereco: {
      id: Number,
      logradouro: String,
      numero: String,
      bairro: String,
      cidade: String,
      complemento: String,
    },
  },
});

console.log(props);
const usuarioEditado = ref(props);
const editarUsuario = () => {
  console.log("Não implementado");
};
const bloqueio = computed(() => {
  return props.usuarioDisplay.bloqueio === false ? "Bloqueado" : "Sem bloqueio";
});
console.log(bloqueio);
</script>
