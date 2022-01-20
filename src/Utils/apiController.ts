import axios from "axios"

const api = (token?: string) => axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : "http://localhost:1337/",
  timeout: 1000,
  headers: token ? { 'Authorization': 'Bearer ' + token } : undefined
});

export const path = {
  register: 'api/auth/local/register',
  login: 'api/auth/local'
}

export default api;