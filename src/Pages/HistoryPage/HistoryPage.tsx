import { useCallback, useEffect, useState } from "react";
import moment, { Moment } from "moment";
// Axios
import request from 'axios';
import axios, { path as p, query as q } from "@/Utils/apiController";

// React Redux
import { useDispatch, useSelector } from 'react-redux';
import { setHistory } from "@/Redux/historyReducer";

// Ant Design
import { Row, Col, Calendar, Divider } from "antd"

// Custom Components
import InfoComponent from "@/Components/InfoComponent/InfoComponent";
import openNotification from "@/Components/Notification/Notification";

// Utils
import { getAllPomosUtil } from "@/Utils/utils";

// Class & Styles
// import classes from "./HistoryPage.module.less"


const HistoryPage = () => {
  const { history, user } = useSelector((state: RootState) => state);
  const { token } = user;
  const { goalsConfig: goals } = user.userConfig;
  const [stats, setStats] = useState({
    day: 0,
    week: 0,
    month: 0,
  });

  const dispatch = useDispatch();

  const getAllPomosMonth = useCallback(async (date: Moment, alert: boolean = false) => {
    try {
      const { data: res } = await axios(token).get(p.apiPomos + "?" + q.queryAllPomoMonth(date));
      const { data: pomos } = res;
      const { pagination } = res.meta;
      const data = getAllPomosUtil({
        array: pomos,
        date: date,
        total: pagination.total
      });
      dispatch(setHistory(data));
      if (alert) {
        openNotification({
          type: 'success',
          message: "SOMETHING DID GO RIGHT",
          description: `Yey this work`
        });
      }

    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        if (alert) {
          openNotification({
            type: 'error',
            message: "An error has occurred",
            description: `Error: ${error.message}`
          });
        }
      } else {
        console.log(err);
        if (alert) {
          openNotification({
            type: 'error',
            message: "An error has occurred",
            description: `Error: unknown error.`
          });
        }
      }
    }
  }, [dispatch, token]);


  useEffect(() => {
    const { history: data } = history;
    if (data.length > 0) {
      const { history: data } = history;
      const todaIndex = data.findIndex((his: MonthHistoryType) => moment(his.month).isSame(moment(), "day"))

      setStats({
        day: data[todaIndex].dailyPomos,
        week: data[todaIndex].weekPomos,
        month: data[todaIndex].monthPomos,
      });
      // setStats();
    }

  }, [getAllPomosMonth, history, history.history, token]);

  useEffect(() => {
    if (token) {
      getAllPomosMonth(moment())
    }
  }, [getAllPomosMonth, token]);

  if (!user) {
    return <div>Sonaovbit</div>
  }
  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <InfoComponent
          day={{
            done: stats.day,
            goal: goals.daily
          }}
          week={{
            done: stats.week,
            goal: goals.weekly
          }}
          month={{
            done: stats.month,
            goal: goals.monthly
          }}
        />
      </Col>
      <Col span={24}>
        <Divider />
        <h2 style={{ textAlign: "center" }}>⬇️⬇️⬇️⬇️⬇️ THIS IS DISABLE ⬇️⬇️⬇️⬇️⬇️</h2>
        <Divider />
      </Col>
      <Col span={12}>
        <Calendar />
      </Col>
      <Col span={12}>
        <p>Show pomo</p>
        <button onClick={() => getAllPomosMonth(moment(), true)}>CLICK HERE</button>
      </Col>
    </Row>
  );
}

export default HistoryPage;