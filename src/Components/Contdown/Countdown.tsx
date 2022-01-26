import { useCallback, useEffect } from 'react';

import moment from "moment";

// Axios
import axios, { path } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { countdownChange, countdownStart, countdownStop } from "@/Redux/timerReducer"

// Ant Design
import { Button, Progress, Statistic, Typography } from "antd"
import { SettingOutlined } from '@ant-design/icons';

// Custom Components
import IconButton from "@/Components/IconButton/IconButton";

// Classes & Styles
import classes from "./Countdown.module.less";

// Desconstructor
const { Countdown } = Statistic;
const { Text } = Typography;

// Type
type Props = {
  user: ControlType;
  type: "work" | "short_break" | "long_break"
};

const initiPomoConfig = {
  longBreakDuration: 15,
  shortBreakDuration: 5,
  workDuration: 25
}
function CountdownComponent({ user, type }: Props) {
  const token = user.token;

  let pomoConfig = initiPomoConfig;

  if (user.user?.pomoConfig) {
    pomoConfig = user.user.pomoConfig;
  }

  let duration = 0;
  switch (type) {
    case "work":
      duration = pomoConfig.workDuration;
      break;
    case "short_break":
      duration = pomoConfig.shortBreakDuration;
      break;
    case "long_break":
      duration = pomoConfig.longBreakDuration;
      break;
    default:
      duration = 0;
  }

  const timer = useSelector((state: RootState) => state.timer);
  const dispatch = useDispatch();

  const onCountdownChange = useCallback((value: number | string | undefined) => {
    if (value !== undefined) {
      const calculateDuration = duration * 1000 * 60;
      const percent = Math.round((1 - Number(value) / calculateDuration) * 100);
      dispatch(countdownChange(percent));
    }
  }, [dispatch, duration]);

  const onCountdownStart = useCallback(async () => {
    console.log("[POMO-START]");
    try {
      const response = await axios(token).post(path.createPomo, {
        data: {
          start: moment().utc().format(),
          type: type
        }
      });
      dispatch(countdownStart({
        pomo: response.data.data,
        timer: moment().add(duration, "m").valueOf()
      }));
    } catch (error) {
      console.log("ERRO");
      console.log(error);
    }
  }, [dispatch, duration, token, type]);


  const onCountdownStop = useCallback(() => {
    console.log(timer.pomo);
  }, [timer]);

  const countdownOnFinish = async () => {
    alert("countdown finish")
    const response = await axios(token).put(path.putPomo + timer.pomo.id, {
      data: {
        finish: true,
      }
    });
    console.log(response);
  }

  const formatHandler = () => {
    if (timer.active) {
      if (timer.timer >= 0) {
        return <Countdown
          value={timer.timer}
          onChange={onCountdownChange}
          format={"mm:ss"}
          onFinish={countdownOnFinish}
        />
      } else {
        return (
          <Text
            className={classes.specialBtn}
            type="success"
            onClick={countdownOnFinish}
          >
            Finish
          </Text>
        )
      }
    }
    return moment(25, "m").format("mm:ss");
  }

  const checkPomoRunning = useCallback(async () => {
    try {
      const response = await axios(token).get(path.getRunning);
      if (response.data.data.length > 0) {
        const end = moment(response.data.data[0].attributes.end);
        const diff = moment.duration(end.diff(moment()));
        console.log(diff.valueOf());
        if (diff.valueOf() > 0) {
          const calculate = moment().add(diff).valueOf();
          dispatch(countdownStart({
            timer: Number(calculate),
            pomo: response.data.data[0]
          }));
        } else {
          console.log("Diff is negative")
          dispatch(countdownStart({
            timer: Number(diff.valueOf()),
            pomo: response.data.data[0]
          }));
        }
      }
    } catch (error) {
      console.log("ERROR - Checking if exist a running pomo")
      console.log(error)
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!timer.active) {
      checkPomoRunning();
    }
  }, [checkPomoRunning, timer.active]);

  if (duration === 0) {
    return <div>something did goes extreme wrong.</div>
  }
  return (
    <div className={classes.timer}>
      <IconButton
        className={classes.timerIcon}
        tooltip="Setting"
        size="small"
        onClick={checkPomoRunning}
        icon={<SettingOutlined />}
      />
      <Progress
        type="circle"
        percent={timer.timer >= 0 ? timer.percent : 100}
        format={formatHandler}
      />
      <ButtonSelector
        active={timer.active}
        onStart={onCountdownStart}
        onStop={onCountdownStop}
      />
    </div>
  );
}
export default CountdownComponent;

type Btn = {
  active: boolean, onStart: () => void, onStop: () => void
}


const ButtonSelector = ({ active, onStart, onStop }: Btn) => {
  if (active) {
    return (
      <Button
        className={classes.timerBtn}
        shape="round" size="large"
        ghost danger
        onClick={onStop}
      >
        Stop
      </Button>
    );
  } else {
    return (
      <Button
        className={classes.timerBtn}
        shape="round" size="large"
        type="primary"
        onClick={onStart}
      >
        Start
      </Button>
    );
  }
}