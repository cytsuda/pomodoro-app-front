import axios from "axios";
import qs from "qs";
import moment from "moment";

const api = (token?: string) => axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : "http://localhost:1337/",
  timeout: 10000,
  headers: token ? { 'Authorization': 'Bearer ' + token } : undefined
});

// TODO - optimize this thing
export const path = {
  apiRegister: "api/auth/local/register",
  apiLogin: "api/auth/local",
  apiMe: "api/users/me",
  apiTasks: "api/tasks",
  apiPomos: "api/pomos",
  apiUserConfig: "/api/user-configs",
  // getPomos: `api/pomos?${getPomoQuery}`,
  // getRunning: `api/pomos?${queryFilterStatusRunning}`,
  // putPomo: `api/pomos/`,
  // updateTask: `api/tasks/`,
  // getTasks: `api/tasks?${queryPopulateSubTasks}`,
}
// QUERIES
const queryPopulateSubTasks = qs.stringify({
  populate: [
    "sub_tasks"
  ],
}, {
  encodeValuesOnly: true,
});

// const getPomoQuery = ''
const queryID = (id: number | string) => `/${id}`;
const queryFilterStatusRunning = qs.stringify({
  filters: {
    status: {
      $eq: 'running'
    }
  }
});
// created_at_gte=2020-01-01&created_at_lte=2020-01-31

const queryFilterToday = () => {
  const start = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const end = moment().add(1, "days").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  return qs.stringify({
    filters: {
      $and: [
        {
          end: {
            $gte: start.utc().format()
          }
        }, {
          end: {
            $lte: end.utc().format()
          }
        }, {
          status: {
            $eq: "completed"
          }
        }
      ]
    }
  })
};
export const query = {
  queryPopulateSubTasks,
  queryFilterStatusRunning,
  queryID,
  queryFilterToday
}
export default api;