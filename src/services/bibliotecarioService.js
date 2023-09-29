import * as baseApi from "./api.js";

let api = baseApi.getApi();

const setHeader = () => {
  if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}

const getBibliotecario = async (id) => {
  setHeader();
  return api
    .get(`/bibliotecarios/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const getBibliotecarios = (name = null, cpf = null) => {
  setHeader();
  var queries = [];
  if (name != null) queries.push(`name=${name}`);
  if (cpf != null) queries.push(`cpf=${cpf}`);
  var query = `?${queries.join("&")}`;

  return api
    .get(`/bibliotecarios${query}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const createBibliotecario = (data) => {
  setHeader();
  return api
    .post("/bibliotecarios", data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateBibliotecario = (data) => {
  setHeader();
  return api
    .patch(`/bibliotecarios/${data.id}`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const deleteBibliotecario = (id) => {
  setHeader();
  return api
    .delete(`/bibliotecarios/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getBibliotecario, getBibliotecarios, createBibliotecario, updateBibliotecario, deleteBibliotecario };
