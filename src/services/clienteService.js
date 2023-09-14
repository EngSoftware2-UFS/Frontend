import * as baseApi from './api.js'

let api = baseApi.getApi()

const setHeader = () => {
    if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}

const getHistoricoReserva = async () => {
    setHeader();
    var user = JSON.parse(localStorage.user);
    var clientId =user?.id;
    return api.get(`/clientes/${clientId}/reservas/historico`)
    .then(res => {
        return res;
    })
    .catch(err => {
        return err;
    })
}

const getHistoricoEmprestimo = async () => {
    setHeader();
    var clientId = localStorage.user ? JSON.parse(localStorage.user)?.id : null;
    return api.get(`/clientes/${clientId}/emprestimos/historico`)
    .then(res => {
        return res;
    })
    .catch(err => {
        return err;
    })
}

export { getHistoricoReserva, getHistoricoEmprestimo }