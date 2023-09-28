<template>
  <div class="w-72 mr-auto ml-auto pb-4">
    <v-card v-for="r in reservas" :key="r.id" class="mt-2 dark:bg-slate-500 dark:text-white">
      <v-card-title>{{ r.data }}</v-card-title>
      <v-card-subtitle>{{ r.status }}</v-card-subtitle>

      <p class="pl-4" v-for="(o, index) in r.obras" :key="index" >{{ o.titulo }}</p>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'HomeView',

  data() {
    return {
      reservas: []
    }
  },
  methods: {
    getHistory() {
      axios.get('https://es2api.projetosufs.cloud/clientes/1/reservas/historico')
      .then(dt => {
        var data = dt.data;
        var includedIds = [];
        for (var i in data) {
          var e = data[i];
          if (!includedIds.includes(e.id)) {
            this.reservas.push(
              {
                id: e.id,
                status: e.status,
                data: new moment(e.dataReserva).format("DD/MM/yyy"),
                obras: data?.filter(x => x.id == e.id)?.map(x => {
                  return {
                    titulo: x.titulo
                  }
                })
            });
            includedIds.push(e.id);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });

      var obj = {
        "email": "zearmando@asd.ads",
        "senha": "senha123",
        "tipoUsuario": 0
      }
      axios.post("https://es2api.projetosufs.cloud/login", obj)
      .then(dt => {
        console.log(dt);
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
  mounted() {
    this.getHistory();
  }
};
</script>