import * as baseApi from "./api.js";

let api = baseApi.getApi();

// const setHeader = () => {
//   if (localStorage.token) baseApi.setAuthToken(localStorage.token);
// };

const getClientes = async () => {
  //   setHeader();

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

export { getClientes, postCliente};
