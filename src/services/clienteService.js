import * as baseApi from './api.js'

let api = baseApi.getApi()

const getReservaHistory = async () => {
    var clientId = 1;
    api.get(`/clientes/${clientId}/reservas/historico`)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

export { getReservaHistory }