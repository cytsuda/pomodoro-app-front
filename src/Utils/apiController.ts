import axios from "axios";
import qs from "qs";
import moment, { Moment } from "moment";

const api = (token?: string) => axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : "http://localhost:1337/",
  timeout: 10000,
  headers: token ? { 'Authorization': 'Bearer ' + token } : undefined
});

// TODO - optimize this thing
export const path = {
  apiRegister: "/api/auth/local/register",
  apiLogin: "/api/auth/local",
  apiMe: "/api/users/me",
  apiTasks: "/api/tasks",
  apiPomos: "/api/pomos",
  apiUserConfig: "/api/user-configs",
  // getPomos: `api/pomos?${getPomoQuery}`,
  // getrunning: `api/pomos?${queryFilterStatusrunning}`,
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
const queryFilterStatusrunning = qs.stringify({
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
    populate: [
      "tasks"
    ],
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

// Const query month

const queryAllPomoTime = (date: Moment, scope: "month" | "year", page?: number) => {
  const startTime = moment(date).startOf(scope);
  const endTime = moment(date).endOf(scope);
  const actualPage = page || 1;

  return qs.stringify({
    pagination: {
      page: actualPage,
      pageSize: 100,
    },
    populate: [
      "tasks"
    ],
    filters: {
      $and: [
        {
          end: {
            $gte: startTime.utc().format()
          }
        }, {
          end: {
            $lte: endTime.utc().format()
          }
        }, {
          status: {
            $eq: "completed"
          }
        }, {
          type: {
            $eq: "work"
          }
        }
      ]
    }
  })
};
export const query = {
  queryPopulateSubTasks,
  queryFilterStatusrunning,
  queryID,
  queryFilterToday,
  queryAllPomoTime
}
export default api;