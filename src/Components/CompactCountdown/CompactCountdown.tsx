import { useCallback, useEffect, useState } from 'react';
import clsx from "clsx";
import produce from "immer";
import moment from "moment";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { timerStart, timerFinish, timerNext, timerRefresh } from "@/Redux/timerReducer";
import { setPomos } from "@/Redux/pomosReducers";
import { getTasks } from "@/Redux/taskReducer"
import { setHistory } from "@/Redux/historyReducer";

// Axios
import request from 'axios';
import axios, { path as p, query as q } from "@/Utils/apiController";

// Ant Design
import { Statistic, Typography, Affix } from "antd"
import { PlayCircleOutlined, HourglassOutlined, CheckCircleOutlined } from '@ant-design/icons';

//Utils
import { durationLength, convertTime } from "@/Utils/utils";

// Custom components
import openNotification from "@/Components/Notification/Notification";

// Utils
import { historyFormat } from "@/Utils/utils";

// ClassName & Styles
import classes from "./CompactCountdown.module.less";

type StateType = {
  loading: boolean;
  progress: number;
}
type SoundProps = {
  work?: string,
  short?: string,
  long?: string,

}
type Props = {
  mobile?: boolean
}
// Desconstructor
const { Countdown } = Statistic;
const { Text } = Typography;

const CompactCountdown = ({ mobile = false }: Props) => {
  const { user, timer, task, pomo } = useSelector((state: RootState) => state);
  const { sounds } = user.userConfig.preferenceConfig;
  const token = user.token;
  const { pomoConfig } = user.userConfig;

  const dispatch = useDispatch();

  const [sound, setSound] = useState<SoundProps>({
    work: undefined,
    short: undefined,
    long: undefined
  })

  const [state, setState] = useState<StateType>({
    loading: false,
    progress: 0,
  });

  // ----------------------------------------------------------------------------------------
  useEffect(() => {
    if (sounds) {
      const { work, short, long } = sounds;
      setSound({
        work: process.env.REACT_APP_SERVER_URL + work.url,
        short: process.env.REACT_APP_SERVER_URL + short.url,
        long: process.env.REACT_APP_SERVER_URL + long.url,
      })
    }
  }, [sounds]);

  // ----------------------------------------------------------------------------------------

  // Get duration base on pomoType
  const duration = useCallback((value: PomoWorkTypes) => {
    const d = {
      work: pomoConfig.workDuration,
      short_break: pomoConfig.shortBreakDuration,
      long_break: pomoConfig.longBreakDuration,
    }
    return d[value];
  }, [pomoConfig.longBreakDuration, pomoConfig.shortBreakDuration, pomoConfig.workDuration]);
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
    if (sound.work && timer.type === "work") {
      const newAudio = new Audio(sound.work);
      newAudio.addEventListener("canplaythrough", event => {
        newAudio.play();
      });
    }
    if (sound.short && timer.type === "short_break") {
      const newAudio = new Audio(sound.short);
      newAudio.addEventListener("canplaythrough", event => {
        newAudio.play();
      });
    }
    if (sound.long && timer.type === "long_long") {
      const newAudio = new Audio(sound.long);
      newAudio.addEventListener("canplaythrough", event => {
        newAudio.play();
      });
    }
  }, [dispatch, sound.long, sound.short, sound.work, timer.type]);

  const onFinishPomo = useCallback(async () => {
    setState(produce(draft => {
      draft.loading = true;
    }));

    try {
      const workTasks = task.data.filter((item: FetchedTaskType) => item.attributes.intermediate || (!item.attributes.completeDate && item.attributes.complete));
      const { data: finish } = await axios(token).put(p.apiPomos + q.queryID(timer.pomoID), {
        data: {
          finish: true,
          tasks: workTasks,
        }
      });

      const updateTask = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(updateTask.data.data));
      const response = await axios(token).get(p.apiPomos + "?" + q.queryFilterToday());
      dispatch(setPomos({ pomos: response.data.data, total: response.data.meta.pagination.total }));

      if (finish.data.attributes.type === "work") {
        const date = moment();
        const { data: res } = await axios(token).get(p.apiPomos + "?" + q.queryAllPomoTime(date, 'month'));
        const { data: pomos } = res;
        const { pagination } = res.meta;
        const { historyArray, info } = historyFormat({ pomoArray: pomos, value: pagination.total });

        const scopeData = moment().format("YYYY-MM");

        dispatch(setHistory({
          index: moment(date).month(),
          scope: scopeData,
          data: historyArray,
          currentHistory: info
        }));
      }

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
      <MobileController mobile={mobile}>
        <>
          {timer.status === "waiting" && (
            <div className={clsx(classes.container, mobile && classes.mobile, getBtnClass(timer.type))} onClick={() => onStart(timer.type)}>
              <PlayCircleOutlined />
              <Text>
                Start
              </Text>
            </div>
          )}
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
        </>
      </MobileController>
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
type MobileProps = {
  mobile: boolean;
  children: JSX.Element
}
const MobileController = ({ mobile, children }: MobileProps) => {
  if (mobile) {
    return <>{children}</>
  } else {
    return (

      <Affix offsetTop={10}>{children}</Affix>
    )
  }
}