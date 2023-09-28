import * as baseApi from "./api.js";

let api = baseApi.getApi();

const getCliente = async (id) => {
  return api
    .get(`/clientes/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

const getClientes = () => {
  return api
    .get("/clientes")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

const postCliente = (data) => {
  return api
    .post("/clientes", data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export { getCliente, getClientes, postCliente };
