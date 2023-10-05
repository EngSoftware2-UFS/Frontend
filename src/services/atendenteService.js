import * as baseApi from "./api.js";

let api = baseApi.getApi();

const setHeader = () => {
  if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}

const getAtendente = async (id) => {
  setHeader();
  return api
    .get(`/atendentes/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const getAtendentes = (name = null, cpf = null) => {
  setHeader();
  var queries = [];
  if (name != null) queries.push(`name=${name}`);
  if (cpf != null) queries.push(`cpf=${cpf}`);
  var query = `?${queries.join("&")}`;

  return api
    .get(`/atendentes${query}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const createAtendente = (data) => {
  setHeader();
  return api
    .post("/atendentes", data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateAtendente = (data) => {
  setHeader();
  return api
    .patch(`/atendentes/${data.id}`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const deleteAtendente = (id) => {
  setHeader();
  return api
    .delete(`/atendentes/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getAtendente, getAtendentes, createAtendente, updateAtendente, deleteAtendente };
