import * as baseApi from './api.js'

let api = baseApi.getApi()

const setHeader = () => {
    if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}
  
const getReservas = (name = null, status = null) => {
    setHeader();
    var queries = [];
    if (name != null) queries.push(`nomeCliente=${name}`);
    if (status != null) queries.push(`status=${status.toUpperCase()}`);
    var query = `?${queries.join("&")}`;

    return api
      .get(`/reservas${query}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
};

const createReserva = (data) => {
  setHeader();
  return api
    .post(`/reservas`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

const cancelar = (id) => {
  setHeader();
  return api
    .patch(`/reservas/${id}/cancelar`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export { getReservas, cancelar, createReserva  }