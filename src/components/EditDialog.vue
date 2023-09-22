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
              v-model="usuarioDisplay.nome"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Endereço de email"
              placeholder="exemplo@email.com"
              type="email"
              v-model="usuarioDisplay.email"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="CPF"
              hide-details="auto"
              v-model="usuarioDisplay.cpf"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Data de cadastro"
              hide-details="auto"
              variant="plain"
              readonly
              v-model="usuarioDisplay.dataCadastro"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Estado de bloqueio"
              hide-details="auto"
              variant="plain"
              readonly
              v-model="bloqueio"
            ></v-text-field>
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
              v-model="usuarioDisplay.endereco.logradouro"
            ></v-text-field>
          </v-col>
          <v-col cols="3"
            ><v-text-field
              label="Bairro"
              hide-details="auto"
              v-model="usuarioDisplay.endereco.bairro"
            ></v-text-field>
          </v-col>
          <v-col cols="2"
            ><v-text-field
              label="Numero"
              hide-details="auto"
              v-model="usuarioDisplay.endereco.numero"
            ></v-text-field>
          </v-col>
          <v-col cols="3"
            ><v-text-field
              label="Cidade"
              hide-details="auto"
              v-model="usuarioDisplay.endereco.cidade"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            ><v-text-field
              label="Complemento"
              hide-details="auto"
              v-model="usuarioDisplay.endereco.complemento"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="flex justify-end">
        <v-btn color="#c91827" @click="() => $emit('closeAction')"
          >Cancelar</v-btn
        >

        <v-btn color="green" variant="outlined" @click="editarUsuario">Editar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from "vue";

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

const editarUsuario = () => {
  console.log("Não implementado")
}
const bloqueio = computed(() => {
  return props.usuarioDisplay.bloqueio === false ? "Bloqueado" : "Sem bloqueio";
});
</script>
