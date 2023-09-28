<template>
  <v-data-table
    :items-per-page="_itemsPerPage"
    items-per-page-text="Resultados por página"
    :headers="headers"
    :items="data"
    return-object
    class="rounded-lg"
    color="bg-blue"
    sort-asc-icon="mdi-chevron-up"
    sort-desc-icon="mdi-chevron-down"
    :density="$props.density"
    :show-select="allowSelected"
    v-model="values"
    :select-strategy="strategySingle ? 'single' : 'multiple'"
    @update:modelValue="
      () => {
        allcheckMark = false;
      }
    "
  >
    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <template v-for="column in columns" :key="column.key">
          <th
            :class="{
              'bg-blue-grey-lighten-3': true,
              'text-body-2': $props.density === 'compact',
            }"
          >
            <div class="d-flex align-center justify-center font-semibold">
              <span
                v-if="column.key !== 'data-table-select'"
                class="mr-2 cursor-pointer"
                @click="() => toggleSort(column)"
              >
                {{ column.title }}
              </span>
              <div class="pt-5 h-[1%]" v-else>
                <v-checkbox
                  v-model="allcheckMark"
                  @click="
                    () => {
                      allcheckMark = !allcheckMark;
                      selectAll();
                    }
                  "
                  class="ml-[-0.4rem]"
                ></v-checkbox>
              </div>

              <div
                v-if="column.sortable && !isSorted(column)"
                class="d-flex flex-column flex-nowrap"
              >
                <v-icon icon="mdi-chevron-up"> </v-icon>
                <v-icon icon="mdi-chevron-down"> </v-icon>
              </div>
              <div
                v-if="column.sortable && isSorted(column)"
                class="d-flex flex-column flex-nowrap"
              >
                <v-icon
                  icon="mdi-chevron-up"
                  :class="
                    getSortIcon(column) == 'mdi-chevron-down' && 'opacity-50'
                  "
                >
                </v-icon>
                <v-icon
                  icon="mdi-chevron-down"
                  :class="
                    getSortIcon(column) == 'mdi-chevron-up' && 'opacity-50'
                  "
                >
                </v-icon>
              </div>
            </div>
          </th>
        </template>
      </tr>
    </template>
    <template v-for="column in _headers" v-slot:[column.slotKey]="{ item }">
      <slot
        v-if="column.slotKey !== 'item.actions'"
        :name="column.slotKey"
        :item="item"
      >
        {{
          column.slotKey !== "item.dataCadastro"
            ? item.columns[column.key]
            : dataCadastroFormatada(item.columns[column.key])
        }}
      </slot>
      <slot v-else :name="column.slotKey">
        <v-btn
          variant="plain"
          density="comfortable"
          icon="mdi-pencil"
          @click="($event) => abrirEditarUsuario(item.value.id)"
        ></v-btn>
      </slot>
    </template>
    <template v-slot:no-data>
      <p class="font-bold text-xl mt-8">
        <v-icon size="50">mdi-alert-circle</v-icon>
        Nenhum resultado encontrado.
      </p>
    </template>
  </v-data-table>
</template>
<script setup>

import moment from "moment";
import { defineProps, defineEmits, onBeforeMount, ref } from "vue";
import * as atendenteService from "../services/atendenteService";
const props = defineProps({
  itemsPerPage: Number,
  headers: [Object],
  data: [Object],
  allowSelected: Boolean,
  functionSender: Number,
  strategySingle: Boolean,
});

const emit = defineEmits(["estadoDialog", "dadosUsuario"]);
const dadosUsuario = ref();
const values = ref([]);
const _itemsPerPage = ref(props.itemsPerPage);
const _headers = ref([]);
const allcheckMark = ref(false);

onBeforeMount(() => {
  _headers.value = props.headers.map((header) => ({
    ...header,
    slotKey: `item.${header.key}`,
  }));
});

function selectAll() {
  if (allcheckMark.value) {
    for (let i = 0; i < props.data.length; i++) {
      values.value.push(props.data[i]);
    }
  } else {
    deselectAll();
  }
}

function deselectAll() {
  for (let i = 0; i < props.data.length; i++) {
    values.value.forEach(() => {
      values.value.pop();
    });
  }
}

const dataCadastroFormatada = (value) => {
  return moment(value).format("DD/MM/YYYY");
};

const abrirEditarUsuario = (id) => {
  atendenteService
    .getCliente(id)
    .then((res) => {
      dadosUsuario.value = res;
      emit("estadoDialog", true);
      emit("dadosUsuario", dadosUsuario);
    })
    .catch((err) => {
      console.log(err);
      emit("estadoDialog", true);
    });
};
</script>
