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
const getPomoQuery = ''
// const getPomoQuery = qs.stringify({
//   populate: [
//     "sub_tasks"
//   ],
// }, {
//   encodeValuesOnly: true,
// });
const getRunningPomo = qs.stringify({
  filters: {
    status: {
      $eq: 'running'
    }
  }
})

// TODO - optimize this thing
export const path = {
  register: 'api/auth/local/register',
  login: 'api/auth/local',
  me: "api/users/me",
  newTask: "api/tasks",
  getTasks: `api/tasks?${getTaskQuery}`,
  updateTask: `api/tasks/`,
  createPomo: `api/pomos`,
  getPomos: `api/pomos?${getPomoQuery}`,
  getRunning: `api/pomos?${getRunningPomo}`,
  putPomo: `api/pomos/`
}

export default api;