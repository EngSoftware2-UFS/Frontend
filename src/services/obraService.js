import * as baseApi from "./api.js";

let api = baseApi.getApi();

const setHeader = () => {
  if (localStorage.token) baseApi.setAuthToken(localStorage.token);
}

const getObra = async (id) => {
  setHeader();
  return api
    .get(`/obras/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const getObras = (title = null, gender = null) => {
  setHeader();
  var queries = [];
  if (title != null) queries.push(`title=${title}`);
  if (gender != null) queries.push(`genero=${gender}`);
  var query = `?${queries.join("&")}`;

  return api
    .get(`/obras${query}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const createObra = (data) => {
  setHeader();
  return api
    .post("/obras", data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateObra = (data) => {
  setHeader();
  return api
    .patch(`/obras/${data.id}`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const deleteObra = (id) => {
  setHeader();
  return api
    .delete(`/obras/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getObra, getObras, createObra, updateObra, deleteObra };
