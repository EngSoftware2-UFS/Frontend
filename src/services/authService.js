import * as baseApi from './api.js'

let api = baseApi.getApi()

const login = (user) => {
    return api.post('/login', user)
    .then(res => {
        let user = res.data?.user;
        let token = res.data?.token;
        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        baseApi.setAuthToken(token);
    })
    .catch(err => {throw err})
}

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}

export { login, logout }