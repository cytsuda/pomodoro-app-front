import { useCallback, useEffect, useState } from 'react';
import clsx from "clsx";
import moment from "moment";

// Axios
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { timerStart, timerFinish, timerNext } from "@/Redux/timerReducer"

// Ant Design
import { Progress, Statistic, Typography } from "antd"
import { SettingOutlined } from '@ant-design/icons';

// Custom Components
import IconButton from "@/Components/IconButton/IconButton";
import CountdownBtn from '@/Components/Contdown/CountdownBtn';

// Classes & Styles
import classes from "./Countdown.module.less";
import { Content } from 'antd/lib/layout/layout';

// Desconstructor
const { Countdown } = Statistic;
const { Text } = Typography;

// Type
type Props = {
  user: ControlType;
  numPomos: number;
};

type StateType = "work" | "short_break" | "long_break"
const durationMesure = 's';
const convertTime = (type: "m" | "s") => {
  let multiplier = 1000;
  if (type === "m") {
    multiplier *= 60;
  }
  return multiplier;
}
function CountdownComponent({ user, numPomos }: Props) {
  const token = user.token;
  const timer = useSelector((state: RootState) => state.timer);
  const dispatch = useDispatch();
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
  // TODO make stop and pause
  const onStart = useCallback((type: StateType) => {
    const now = moment();
    const end = moment(now).add(duration(type), durationMesure);
    dispatch(timerStart({
      end: end.valueOf(),
      type: type
    }))
  }, [dispatch, duration]);

  const onAutoFinish = useCallback(() => {
    dispatch(timerFinish());
  }, [dispatch]);

  const onFinishPomo = useCallback(() => {
    let newType: StateType = "work";
    if (timer.type === "work") {
      newType = (numPomos > 0 && numPomos % pomoConfig.pomoBeforeLongBreak === 0) ? "long_break" : "short_break";
    }
    dispatch(timerNext(newType));
  }, [dispatch, numPomos, pomoConfig.pomoBeforeLongBreak, timer.type]);

  // -------------------------------------------------

  const onChangeCountdown = useCallback((value: number | string | undefined) => {
    // TODO - put different colors on the progress bar if complete or yada yada yada
    if (value !== undefined) {
      const calculateDuration = duration(timer.type) * convertTime(durationMesure);
      const divide = Number(value) / calculateDuration;
      console.log(divide);
      const percent = Math.round((1 - divide) * 100);
      console.log(percent);
      setProgress(percent);
    }
  }, [duration, timer.type]);


  const formatHandler = useCallback(() => {
    //  "running" | "finish" | "pause" | "waiting";
    switch (timer.status) {
      case "running":
        return (
          <Countdown
            value={moment(timer.end).format()}
            format={"mm:ss"}
            onChange={onChangeCountdown}
            onFinish={onAutoFinish}
          />
        );
      case "finish":
        return (
          <Text
            className={classes.specialBtn}
            type="success"
            onClick={onFinishPomo}
          >
            Finish
          </Text>
        );
      case "waiting":
        return (
          <Text
            className={classes.specialBtn}
            type="secondary"
            onClick={() => onStart(timer.type)}
          >
            Start
          </Text>
        )
      default:
        return (
          <Text>
            not ready
          </Text>
        )
    }
  }, [onAutoFinish, onChangeCountdown, onFinishPomo, onStart, timer.end, timer.status, timer.type]);

  return (
    <div className={classes.timer}>
      <p>{timer.status}</p>
      <IconButton
        className={classes.timerIcon}
        tooltip="Setting"
        size="small"
        onClick={() => console.log("IDONT WHAT IS IT")}
        icon={<SettingOutlined />}
      />
      <Progress
        type="circle"
        percent={timer.status === "running" ? progress : 0}
        format={formatHandler}
      />
      <CountdownBtn
        status={timer.status}
        onStart={() => onStart(timer.type)}
        onFinish={onFinishPomo}
      />
    </div>
  );
}
export default CountdownComponent;
