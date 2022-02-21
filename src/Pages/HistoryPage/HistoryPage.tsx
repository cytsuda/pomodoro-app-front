import React, { useCallback, useEffect, useState } from "react";
import moment, { Moment } from "moment";
// Axios
import request from 'axios';
import axios, { path as p, query as q } from "@/Utils/apiController";

// React Redux
import { useDispatch, useSelector } from 'react-redux';
import { setHistory } from "@/Redux/historyReducer";

// Ant Design
import { Row, Col, Calendar, Typography, List, Button, Tooltip } from "antd"
import {
  WarningOutlined, CheckCircleOutlined, CalendarOutlined, ClockCircleOutlined

} from '@ant-design/icons';

// Custom Components
import InfoComponent from "@/Components/InfoComponent/InfoComponent";
import openNotification from "@/Components/Notification/Notification";

// Utils
import { checkDailyWeek, weekOfMonth } from "@/Utils/utils";

// Class & Styles
import classes from "./HistoryPage.module.less";

// Desconstructor 
const { Text } = Typography;

type ListItemMessageProps = {
  value: number;
  type: "pomo" | "task"
}
const ListItemMessage = ({ type, value }: ListItemMessageProps) => {
  if (value > 1) {
    return <Text type="success">{value} {type}s done</Text>
  } else if (value === 1) {
    return <Text type="success">{value} {type} done</Text>
  } else if (value === 0) {
    return <Text type="warning">No {type} done</Text>
  }
  return <Text type="danger">{value} Weird</Text>
}

const HistoryPage = () => {
  const [filter, setFilter] = useState({
    filterDay: false,
    month: 0,
    day: moment().format(),
  });
  const [pageSize, setPageSize] = useState(10);
  const { history, user } = useSelector((state: RootState) => state);
  const { token } = user;
  const { goalsConfig: goals } = user.userConfig;
  const dispatch = useDispatch();

  const getAllPomosMonth = useCallback(async (date: Moment, alert: boolean = false) => {
    try {
      const { data: res } = await axios(token).get(p.apiPomos + "?" + q.queryAllPomoTime(date, 'month'));
      const { data: pomos } = res;
      const { pagination } = res.meta;

      let scopeHistoryDate: ScopeHistoryDateType[] = [];

      let dayPomo = 0;
      let weekPomo = 0;
      let totalDays = 0;
      let totalWeeks: string[] = [];
      pomos.forEach((pomo: PomoType, index: number) => {
        const check = checkDailyWeek(moment(pomo.attributes.start));
        if (check === "day") {
          dayPomo += 1;
          weekPomo += 1;
        } else if (check === "week") {
          weekPomo += 1;
        }

        if (index === 0) {
          scopeHistoryDate.push({
            day: moment(pomo.attributes.start).format('YYYY-MM-DD'),
            week: weekOfMonth(moment(pomo.attributes.start)).toString(),
            pomos: [pomo],
          });
          totalDays += 1;
          totalWeeks.push(weekOfMonth(moment(pomo.attributes.start)).toString());
        } else {
          let scopeIndex = scopeHistoryDate.findIndex((item: ScopeHistoryDateType) => item.day === moment(pomo.attributes.start).format('YYYY-MM-DD'))
          if (scopeIndex === -1) {
            scopeHistoryDate.push({
              day: moment(pomo.attributes.start).format('YYYY-MM-DD'),
              week: weekOfMonth(moment(pomo.attributes.start)).toString(),
              pomos: [pomo],
            });
            totalDays += 1;
            const weekScopeIndex = totalWeeks.findIndex((item: string) => item === weekOfMonth(moment(pomo.attributes.start)).toString());
            if (weekScopeIndex === -1) {
              totalWeeks.push(weekOfMonth(moment(pomo.attributes.start)).toString());
            }
          } else {
            scopeHistoryDate[scopeIndex].pomos.push(pomo)
          }
        }
      });

      let currentHistory: CurrentHistoryType = {
        dailyPomos: dayPomo,
        weekPomos: weekPomo,
        monthPomos: pagination.total,
        totalDays: totalDays,
        totalWeeks: totalWeeks.length,
      }
      setFilter({
        filterDay: true,
        month: moment(date).month(),
        day: moment().format()
      })
      dispatch(setHistory({
        index: moment(date).month(),
        scope: moment().format("YYYY-MM"),
        data: scopeHistoryDate,
        currentHistory: currentHistory
      }))
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



  const dateCellHandler = (value: Moment) => {
    const checkIndex = moment(value).month()
    if (history.history[checkIndex]) {
      const checkDay = history.history[checkIndex].data.find((item: ScopeHistoryDateType) => moment(item.day).isSame(value, "day"));
      if (checkDay) {
        if (checkDay.pomos.length >= goals.daily) {
          return <Text type="success"><CheckCircleOutlined /> {checkDay.pomos.length}</Text>
        } else {
          return <Text type="warning" ><WarningOutlined /> {checkDay.pomos.length}</Text>
        }
      }
    }
  }
  const changeDay = (value: Moment) => {
    if (value.isSame(moment(), "month")) {
      setFilter(prev => ({
        ...prev,
        month: value.month(),
        day: value.format()
      }));
    } else {
      setFilter(prev => ({
        ...prev,
        day: value.format(),
        month: value.month(),
      }));
    }
    // (history && history.history.length > 0 && history.history[filter.month]) ? (filter.filterDay) 
  }

  const monthCellHander = (value: Moment) => {
    const checkIndex = moment(value).month();
    if (history.history[checkIndex]) {
      let total = 0;
      history.history[checkIndex].data.forEach((item: ScopeHistoryDateType) => {
        total += item.pomos.length;
      });
      if (total >= goals.monthly) {
        return <Text type="success"><CheckCircleOutlined /> {total}</Text>
      } else {
        return <Text type="warning" ><WarningOutlined /> {total}</Text>
      }
    }
  }

  const panelHandler = (date: Moment, mode: string) => {
    if (mode === "year") {
      setFilter(prev => ({ ...prev, filterDay: false }))
    } else {
      setFilter(prev => ({ ...prev, filterDay: true, day: date.format() }))
    }
  }

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
            done: history.currentHistory.dailyPomos,
            goal: goals.daily
          }}
          week={{
            done: history.currentHistory.weekPomos,
            goal: goals.weekly
          }}
          month={{
            done: history.currentHistory.monthPomos,
            goal: goals.monthly
          }}
        />
        <Button onClick={() => getAllPomosMonth(moment())}>GET ALL POMOS</Button>
      </Col>

      <Col span={14}>
        <div className={classes.calendar}>
          <Calendar
            value={moment(filter.day)}
            dateCellRender={dateCellHandler}
            monthCellRender={monthCellHander}
            onPanelChange={panelHandler}
            onSelect={changeDay}
          />
        </div>
      </Col>
      <Col span={10}>
        {(history && history.history.length > 0) ? (filter.filterDay && history.history[filter.month]) ? (
          <List
            className={classes.list}
            itemLayout="vertical"
            size="large"
            bordered
            pagination={{
              pageSize: 10,
            }}
            dataSource={checkDate(history.history[filter.month].data.filter((item: ScopeHistoryDateType) => moment(item.day).isSame(moment(filter.day), "day"))[0])}
            header={
              <b>All Pomos Completed on {moment(filter.day).format("MMMM DD of YYYY")}</b>
            }

            renderItem={(item: PomoType) => (
              <List.Item key={item.id} className={classes.listItem}>
                <div className={classes.listItemTime}>
                  <span>
                    <Tooltip title={`Start at ${moment(item.attributes.start).format("HH:mm:ss")}`}>
                      <ClockCircleOutlined className={classes.listIcon} />
                      {moment(item.attributes.start).format("HH:mm:ss")}
                    </Tooltip>
                  </span>
                  <span>
                    <Tooltip title={`End at ${moment(item.attributes.end).format("HH:mm:ss")}`}>
                      <ClockCircleOutlined className={classes.listIcon} />
                      {moment(item.attributes.end).format("HH:mm:ss")}
                    </Tooltip>
                  </span>
                </div>
                <span>
                  <ListItemMessage value={item.attributes.tasks.data ? item.attributes.tasks.data.length : 0} type="task" />
                </span>

              </List.Item>
            )}
          />
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onShowSizeChange: (current, size) => {
                setPageSize(size);
              },
              pageSize: pageSize,
            }}
            dataSource={history.history[filter.month] ? history.history[filter.month].data : []}
            header={
              <div>
                Month Pomo
              </div>
            }
            renderItem={(item: ScopeHistoryDateType) => (
              <List.Item key={item.day} className={classes.listItem}>
                <div className={classes.listItemTime}>
                  <span>
                    <CalendarOutlined className={classes.listIcon} />
                    {moment(item.day).format("YYYY/MM/DD")}
                  </span>
                </div>
                <span>
                  <ListItemMessage value={item.pomos.length} type="pomo" />
                </span>

              </List.Item>
            )}
          />
        ) : <>{filter.month}</>}
      </Col>
    </Row>
  );
}

export default HistoryPage;

const checkDate = (check: ScopeHistoryDateType | undefined) => {

  if (check) {
    return check.pomos;
  } else {
    return [];
  }
}

/*

 <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onShowSizeChange: (current, size) => {
                setPageSize(size);
              },
              pageSize: pageSize,
            }}
            dataSource={history.history[filter.month] ? [].concat.apply([], history.history[filter.month].data.map((item: ScopeHistoryDateType) => item.pomos)) : []}
            header={
              <div>
                Month Pomo
              </div>
            }
            footer={
              <div>
                <b>ant design</b> footer part
              </div>
            }
            renderItem={(item: PomoType) => (
              <List.Item key={item.id}>
                {item.id} - {item.attributes.type} - {item.attributes.status}
              </List.Item>
            )}
          />
*/