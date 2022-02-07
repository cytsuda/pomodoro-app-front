import { useCallback, useEffect, useState } from 'react';
import clsx from "clsx";
import moment from "moment";

// Axios
import request from 'axios';
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { timerStart, timerFinish, timerNext, timerRefresh } from "@/Redux/timerReducer";
import { setPomos } from "@/Redux/pomosReducers";
import { getTasks } from "@/Redux/taskReducer"

// Ant Design
import { Progress, Statistic, Typography } from "antd"
import { cyan, blue, red } from "@ant-design/colors";
import { SettingOutlined } from '@ant-design/icons';

// Custom Components
import IconButton from "@/Components/IconButton/IconButton";
import CountdownBtn from '@/Components/Contdown/CountdownBtn';

// Classes & Styles
import classes from "./Countdown.module.less";

// Desconstructor
const { Countdown } = Statistic;
const { Text } = Typography;

// Type
type Props = {
  user: ControlType;
};

type StateType = "work" | "short_break" | "long_break"
const durationLength = 's';
const convertTime = (type: "m" | "s") => {
  let multiplier = 1000;
  if (type === "m") {
    multiplier *= 60;
  }
  return multiplier;
}
function CountdownComponent({ user }: Props) {
  const token = user.token;
  const timer = useSelector((state: RootState) => state.timer);
  const task = useSelector((state: RootState) => state.task);
  const pomo = useSelector((state: RootState) => state.pomo);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Calculate Duration base on type of pomo;
  const { pomoConfig } = user;
  const duration = useCallback((value: StateType) => {
    const d = {
      work: pomoConfig.workDuration,
      short_break: pomoConfig.shortBreakDuration,
      long_break: pomoConfig.longBreakDuration,
    }
    return d[value];
  }, [pomoConfig.longBreakDuration, pomoConfig.shortBreakDuration, pomoConfig.workDuration]);

  // ------------------------------------------
  const onStart = useCallback(async (type: StateType) => {
    setLoading(true);
    const now = moment();
    const end = moment(now).add(duration(type), durationLength);
    console.log(type)
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
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        console.log(error)
      }
    }

    setLoading(false);
  }, [dispatch, duration, token]);

  const onAutoFinish = useCallback(() => {
    dispatch(timerFinish());
  }, [dispatch]);

  const onFinishPomo = useCallback(async () => {
    setLoading(true);
    try {
      console.log("[onPomoFinish]");
      const workTasks = task.data.filter((item: FetchedTaskType) => item.attributes.intermediate || item.attributes.complete);

      const { data: res } = await axios(token).put(p.apiPomos + q.queryID(timer.pomoID), {
        data: {
          finish: true,
          tasks: workTasks,
        }
      });
      console.log("update");
      console.log(res.data);
      const updateTask = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(updateTask.data.data));
      const response = await axios(token).get(p.apiPomos + "?" + q.queryFilterToday());
      dispatch(setPomos({ pomos: response.data.data, total: response.data.meta.pagination.total }));

      let newType: StateType = "work";
      if (timer.type === "work") {
        newType = (pomo.total > 0 && (pomo.total + 1) % (2 * pomoConfig.pomoBeforeLongBreak - 1) === 0) ? "long_break" : "short_break";
      }

      dispatch(timerNext(newType));
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        console.log(error)
      }
    }

    setLoading(false);
  }, [dispatch, pomo.total, pomoConfig.pomoBeforeLongBreak, task.data, timer.pomoID, timer.type, token, user.token]);

  // Controller functions =============================
  const checkPomoRunning = useCallback(async () => {
    setLoading(true);

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

      } else if (response.data.length > 1) {
        console.error("[CHECK POMO running] - ERROR");
        console.error("Multiples pomo running");
      } else {
        const lastPomo: PomoType = pomo.pomos[pomo.total - 1];
        if (lastPomo) {
          console.log(lastPomo);
          if (lastPomo.attributes.type !== "work") {
            dispatch(timerNext("work"));
          } else {
            const newType = (pomo.total > 0 && (pomo.total) % (2 * pomoConfig.pomoBeforeLongBreak - 1) === 0) ? "long_break" : "short_break";
            console.log("   Next Type: ", newType)
            dispatch(timerNext(newType));
          }
        }
      }
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        console.log(error);
      }
    }
    setLoading(false);
  }, [dispatch, pomo, pomoConfig.pomoBeforeLongBreak, token]);
  // --------------------------------------------------

  const onChangeCountdown = useCallback((value: number | string | undefined) => {
    if (value !== undefined) {
      const calculateDuration = duration(timer.type) * convertTime(durationLength);
      const divide = Number(value) / calculateDuration;
      const percent = Math.round((1 - divide) * 100);
      setProgress(percent);
    }
  }, [duration, timer.type]);

  const formatHandler = useCallback(() => {
    //  "running" | "finish" | "pause" | "waiting";
    if (timer.status === "running") {
      return (
        <Countdown
          value={moment(timer.end).format()}
          format={"mm:ss"}
          onChange={onChangeCountdown}
          onFinish={onAutoFinish}
        />
      );
    } else if (timer.status === "finish") {
      return (
        <Text
          className={clsx(classes.specialBtn, getBtnClass(timer.type))}
          onClick={onFinishPomo}
        >
          Done
        </Text>
      );
    } else if (timer.status === "waiting") {
      return (
        <Text
          className={classes.specialBtn}
          type="secondary"
          onClick={() => onStart(timer.type)}
        >
          Start
        </Text>
      );
    }
    return (
      <Text>
        not ready
      </Text>
    );
  }, [onAutoFinish, onChangeCountdown, onFinishPomo, onStart, timer.end, timer.status, timer.type]);


  useEffect(() => {
    if (token) {
      checkPomoRunning();
    }
  }, [checkPomoRunning, timer.active, token]);

  return (
    <div className={classes.timer}>
      <p>{timer.status} - {timer.type} - {timer.pomoID}</p>
      <IconButton
        className={classes.timerIcon}
        tooltip="Setting"
        size="small"
        onClick={checkPomoRunning}
        icon={<SettingOutlined />}
      />
      <Progress
        type="circle"
        percent={getProgress({ state: timer.status, progress: progress })}
        format={formatHandler}
        strokeColor={getStroke({ type: timer.type, progress })}
      />
      <CountdownBtn
        status={timer.status}
        className={getBtnClass(timer.type)}
        onStart={() => onStart(timer.type)}
        disabled={loading}
        onFinish={onFinishPomo}
      />
    </div>
  );
}
export default CountdownComponent;
// Util
type GetProgressProps = {
  state: CountdownStatusType;
  progress: number;
}
const getProgress = ({ state, progress }: GetProgressProps) => {
  switch (state) {
    case "running":
      return progress;
    case "waiting":
      return 0;
    case "finish":
      return 100;
    case "pause":
      return progress; //???
    default:
      return 0;
  }
}
type GetStrokeProps = {
  type: PomoWorkTypes;
  progress: number
}
const getStroke = ({ type, progress }: GetStrokeProps): string => {
  switch (type) {
    case "work":
      return red[6];
    case "short_break":
      return cyan[6];
    case "long_break":
      return blue[6];
    default:
      return red[5]
  }
}

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