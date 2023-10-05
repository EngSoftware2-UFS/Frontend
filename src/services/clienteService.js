import * as baseApi from './api.js'

let api = baseApi.getApi()

const setHeader = () => {
    if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}

const getCliente = async (id) => {
    setHeader();
    return api
      .get(`/clientes/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
};
  
const getClientes = (name = null, cpf = null) => {
    setHeader();
    var queries = [];
    if (name != null) queries.push(`name=${name}`);
    if (cpf != null) queries.push(`cpf=${cpf}`);
    var query = `?${queries.join("&")}`;

    return api
      .get(`/clientes${query}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
};
  
const createCliente = (data) => {
    setHeader();
    return api
      .post("/clientes", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

const updateCliente = (data) => {
    setHeader();
    return api
      .patch(`/clientes/${data.id}`, data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

const deleteCliente = (id) => {
    setHeader();
    return api
      .delete(`/clientes/${id}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

const getHistoricoReserva = async (id) => {
    setHeader();
    return api.get(`/clientes/${id}/reservas/historico`)
    .then(res => {
        return res;
    })
    .catch(err => {
        throw err;
    })
}

const getReservas = async (id) => {
    setHeader();
    return api.get(`/clientes/${id}/reservas`).then(res => { return res }).catch(err => { throw err });
}

const getEmprestimos = async (id) => {
    setHeader();
    return api.get(`/clientes/${id}/emprestimos`).then(res => { return res }).catch(err => { throw err });
}

const getHistoricoEmprestimo = async (id) => {
    setHeader();
    return api.get(`/clientes/${id}/emprestimos/historico`)
    .then(res => {
        return res;
    })
    .catch(err => {
        throw err;
    })
}

const devolucoesPendentes = async () => {
  setHeader();
    return api.get(`/clientes/devolucoesPendentes`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        throw err;
    })
}

export { getHistoricoReserva, getHistoricoEmprestimo, getCliente, getClientes, createCliente, updateCliente, deleteCliente, getReservas, getEmprestimos, devolucoesPendentes  }