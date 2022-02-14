import { useCallback, useEffect, useState } from 'react';
import clsx from "clsx";
import produce from "immer";
import moment from "moment";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { timerStart, timerFinish, timerNext, timerRefresh } from "@/Redux/timerReducer";
import { setPomos } from "@/Redux/pomosReducers";
import { getTasks } from "@/Redux/taskReducer"
// Axios
import request from 'axios';
import axios, { path as p, query as q } from "@/Utils/apiController";

// Ant Design
import { Statistic, Typography, Affix, notification } from "antd"
import { PlayCircleOutlined, HourglassOutlined, CheckCircleOutlined } from '@ant-design/icons';

//Utils
import { durationLength, convertTime } from "@/Utils/utils";

// ClassName & Styles
import classes from "./CompactCountdown.module.less";

type StateType = {
  loading: boolean;
  progress: number;
}

// Desconstructor
const { Countdown } = Statistic;
const { Text } = Typography;

const CompactCountdown = () => {
  const { user, timer, task, pomo } = useSelector((state: RootState) => state);
  const token = user.token;
  const { pomoConfig } = user.userConfig;

  const dispatch = useDispatch();

  const [state, setState] = useState<StateType>({
    loading: false,
    progress: 0,
  });

  // Get duration base on pomoType
  const duration = useCallback((value: PomoWorkTypes) => {
    const d = {
      work: pomoConfig.workDuration,
      short_break: pomoConfig.shortBreakDuration,
      long_break: pomoConfig.longBreakDuration,
    }
    return d[value];
  }, [pomoConfig.longBreakDuration, pomoConfig.shortBreakDuration, pomoConfig.workDuration]);

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const openNotification = ({ message, description, type }: MsgProps) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topLeft",
    });
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const onStart = useCallback(async (type: PomoWorkTypes) => {
    setState(produce(draft => {
      draft.loading = true;
    }));
    const now = moment();
    const end = moment(now).add(duration(type), durationLength);
    try {
      const { data: response } = await axios(token).post(p.apiPomos, {
        data: {
          start: now.utc().format(),
          end: end.utc().format(),
          type: type
        }
      });
      dispatch(timerStart({
        end: end.valueOf(),
        pomoID: response.data.id,
        type: type
      }));

      openNotification({
        type: 'warning',
        message: type === "work" ? "Focus Start" : "Break Start",
        description: ""
      });

    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        console.log(err);
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }
    setState(produce(draft => {
      draft.loading = false;
    }));
  }, [dispatch, duration, token]);

  const onAutoFinish = useCallback(() => {
    dispatch(timerFinish());
    openNotification({
      type: timer.type === "work" ? 'success' : "info",
      message: timer.type === "work" ? "Pomodoro is finish" : "Break is over",
      description: ``
    });

  }, [dispatch, timer.type]);

  const onFinishPomo = useCallback(async () => {
    setState(produce(draft => {
      draft.loading = true;
    }));

    try {
      const workTasks = task.data.filter((item: FetchedTaskType) => item.attributes.intermediate || (!item.attributes.completeDate && item.attributes.complete));
      await axios(token).put(p.apiPomos + q.queryID(timer.pomoID), {
        data: {
          finish: true,
          tasks: workTasks,
        }
      });

      const updateTask = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(updateTask.data.data));
      const response = await axios(token).get(p.apiPomos + "?" + q.queryFilterToday());
      dispatch(setPomos({ pomos: response.data.data, total: response.data.meta.pagination.total }));

      let newType: PomoWorkTypes = "work";
      if (timer.type === "work") {
        newType = (pomo.total > 0 && (pomo.total + 1) % (2 * pomoConfig.pomoBeforeLongBreak - 1) === 0) ? "long_break" : "short_break";
      }

      dispatch(timerNext(newType));

      if (timer.type === 'work') {
        openNotification({
          type: "success",
          message: "Pomodoro is completed",
          description: ``
        });
      }


    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        console.log(err);
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }

    setState(produce(draft => {
      draft.loading = false;
    }));

  }, [dispatch, pomo.total, pomoConfig.pomoBeforeLongBreak, task.data, timer.pomoID, timer.type, token, user.token]);

  const onStop = useCallback(async () => {
    setState(produce(draft => {
      draft.loading = true;
    }));
    try {

      const workTasks = task.data.filter((item: FetchedTaskType) => item.attributes.intermediate || (!item.attributes.completeDate && item.attributes.complete));
      await axios(token).put(p.apiPomos + q.queryID(timer.pomoID), {
        data: {
          finish: true,
          tasks: workTasks,
        }
      });

      const updateTask = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(updateTask.data.data));
      const response = await axios(token).get(p.apiPomos + "?" + q.queryFilterToday());
      dispatch(setPomos({ pomos: response.data.data, total: response.data.meta.pagination.total }));

      let newType: PomoWorkTypes = "work";
      dispatch(timerNext(newType));

      openNotification({
        type: timer.type === "work" ? 'error' : "warning",
        message: timer.type === "work" ? "Pomodoro was canceled" : "Break is over",
        description: ``
      });

    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        console.log(err);
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }

    setState(produce(draft => {
      draft.loading = true;
    }));

  }, [dispatch, task.data, timer.pomoID, timer.type, token, user.token]);
  // Controller functions =============================
  const checkPomoRunning = useCallback(async () => {
    setState(produce(draft => {
      draft.loading = true;
    }));

    try {
      const { data: response } = await axios(token).get(p.apiPomos + "?" + q.queryFilterStatusrunning);
      const { data } = response;
      if (data.length === 1) {
        const { attributes: att, id } = data[0];
        const now = moment();

        const diff = moment(att.end).diff(now);
        if (diff > 0) {
          dispatch(timerRefresh({
            end: att.end,
            status: att.status,
            type: att.type,
            pomoID: id
          }));



        } else {
          dispatch(timerRefresh({
            end: att.end,
            status: "finish",
            type: att.type,
            pomoID: id
          }));


        }
      } else if (data.length > 1) {

        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: Multiples pomo running.`
        });

      } else {
        const lastPomo: PomoType = pomo.pomos[pomo.total - 1];
        if (lastPomo) {
          if (lastPomo.attributes.type !== "work") {
            dispatch(timerNext("work"));
          } else {
            const newType = (pomo.total > 0 && (pomo.total) % (2 * pomoConfig.pomoBeforeLongBreak - 1) === 0) ? "long_break" : "short_break";
            dispatch(timerNext(newType));
          }
        }
      }
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }
    setState(produce(draft => {
      draft.loading = false;
    }));

  }, [dispatch, pomo, pomoConfig.pomoBeforeLongBreak, token]);


  // --------------------------------------------------
  const onChangeCountdown = useCallback((value: number | string | undefined) => {
    if (value !== undefined) {
      const calculateDuration = duration(timer.type) * convertTime(durationLength);
      const divide = Number(value) / calculateDuration;
      const percent = Math.round((1 - divide) * 100);
      setState(produce(draft => {
        draft.progress = percent;
      }));

    }
  }, [duration, timer.type]);


  useEffect(() => {
    if (token) {
      checkPomoRunning();
    }
  }, [checkPomoRunning, timer.active, token]);

  return (
    <div className={classes.wrapper}>
      <Affix offsetTop={10}>
        {timer.status === "waiting" && (
          <div className={clsx(classes.container, getBtnClass(timer.type))} onClick={() => onStart(timer.type)}>
            <PlayCircleOutlined />
            <Text>
              Start
            </Text>
          </div>
        )}
        {/* TODO add diferent colors for work/short/long */}
        {timer.status === "running" && (
          <div className={clsx(classes.progress, getBtnClass(timer.type))}>
            <div className={classes.progressText} onClick={onStop}>
              <HourglassOutlined />
              <Countdown
                value={moment(timer.end).format()}
                format={"mm:ss"}
                onChange={onChangeCountdown}
                onFinish={onAutoFinish}
                valueStyle={{ fontSize: 18, lineHeight: "44px" }}
              />
              <div
                className={clsx(classes.progressVal, getBtnClass(timer.type))}
                // style={{ width: `${state.progress}%` }}
                style={{ width: `${state.progress}%` }}
              />
            </div>

          </div>
        )}
        {timer.status === "finish" && (
          <div className={classes.finish} onClick={onFinishPomo}>
            <CheckCircleOutlined />
            <Text>
              Finish
            </Text>
          </div>
        )}
      </Affix>
    </div >
  );
}

export default CompactCountdown;

const getBtnClass = (type: PomoWorkTypes): string => {
  switch (type) {
    case "work":
      return classes.work;
    case "short_break":
      return classes.short;
    case "long_break":
      return classes.long;
    default:
      return ""
  }
}
/* onClick={() => onStart(timer.type)}
          <div className={classes.container}>
            <Countdown
              value={moment(timer.end).format()}
              format={"mm:ss"}
              onChange={onChangeCountdown}
              onFinish={onAutoFinish}
            />
          </div>
*/
