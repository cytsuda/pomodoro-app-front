import axios from "axios";
import qs from "qs";

const api = (token?: string) => axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : "http://localhost:1337/",
  timeout: 10000,
  headers: token ? { 'Authorization': 'Bearer ' + token } : undefined
});

const getTaskQuery = qs.stringify({
  populate: [
    "sub_tasks"
  ],
}, {
  encodeValuesOnly: true,
});

export const path = {
  register: 'api/auth/local/register',
  login: 'api/auth/local',
  me: "api/users/me",
  newTask: "api/tasks",
  getTasks: `api/tasks?${getTaskQuery}`,
  updateTask: `api/tasks/`


}

export default api;