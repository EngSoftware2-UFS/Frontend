import axios from 'axios';

var api = axios.create({
    // baseURL: 'https://es2api.projetosufs.cloud/'
    baseURL: 'https://localhost:7014/'
});


const setAuthToken = (jwt) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

const getApi = () => {
    return api;
}

export { getApi }
export { setAuthToken }