import * as baseApi from './api.js'

let api = baseApi.getApi()

const setHeader = () => {
    if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}
  
const getEmprestimos = (name = null, status = null) => {
    setHeader();
    var queries = [];
    if (name != null) queries.push(`nomeCliente=${name}`);
    if (status != null) queries.push(`status=${status.toUpperCase()}`);
    var query = `?${queries.join("&")}`;

    return api
      .get(`/emprestimos${query}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
};
  
const createEmprestimo = (data) => {
    setHeader();
    return api
      .post("/emprestimos", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

const renovar = (id) => {
  setHeader();
  return api
    .patch(`/emprestimos/${id}/renovar`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

const devolver = (id) => {
  setHeader();
  return api
    .patch(`/emprestimos/${id}/devolver`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

const pagar = (id) => {
  setHeader();
  return api
    .patch(`/emprestimos/${id}/pagarMulta`)
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
    .patch(`/emprestimos/${id}/cancelar`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export { getEmprestimos, createEmprestimo, renovar, devolver, pagar, cancelar  }