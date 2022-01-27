import { useCallback, useEffect, useState } from 'react';

import moment from "moment";

// Axios
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { percentChange, timerStart, timerFinish } from "@/Redux/timerReducer"

// Ant Design
import { Button, Progress, Statistic, Typography } from "antd"
import { SettingOutlined } from '@ant-design/icons';

// Custom Components
import IconButton from "@/Components/IconButton/IconButton";

// Classes & Styles
import classes from "./Countdown.module.less";
import { workerData } from 'worker_threads';

// Desconstructor
const { Countdown } = Statistic;
const { Text } = Typography;

// Type
type Props = {
  user: ControlType;
  numPomos: number;
};

type StateType = "work" | "short_break" | "long_break"

function CountdownComponent({ user, numPomos }: Props) {
  const token = user.token;
  const [type, setType] = useState<StateType>("work");

  const { pomoConfig } = user;
  const duration = useCallback((value: StateType) => {
    const d = {
      work: pomoConfig.workDuration,
      short_break: pomoConfig.shortBreakDuration,
      long_break: pomoConfig.longBreakDuration,
    }
    return d[value];
  }, [pomoConfig.longBreakDuration, pomoConfig.shortBreakDuration, pomoConfig.workDuration]);

  const timer = useSelector((state: RootState) => state.timer);
  const dispatch = useDispatch();

  const onCountdownChange = useCallback((value: number | string | undefined) => {
    if (value !== undefined) {
      const calculateDuration = duration(type) * 1000 * 60;
      const percent = Math.round((1 - Number(value) / calculateDuration) * 100);
      dispatch(percentChange(percent));
    }
  }, [dispatch, duration, type]);

  const onCountdownStart = useCallback(async (value: StateType) => {
    try {
      // createPomo: `api/pomos`,
      const response = await axios(token).post(p.apiPomos, {
        data: {
          start: moment().utc().format(),
          type: value
        }
      });
      dispatch(timerStart({
        pomo: response.data.data,
        timer: moment().add(duration(value), "m").valueOf()
      }));
    } catch (error) {
      console.log("ERRO");
      console.log(error);
    }
  }, [dispatch, duration, token]);


  const onCountdownStop = useCallback(() => {
    console.log(timer.pomo);
  }, [timer]);

  const countdownOnFinish = async () => {
    alert("countdown finish")
    const response = await axios(token).put(p.apiPomos + q.queryID(timer.pomo.id), {
      data: {
        finish: true,
      }
    });
    console.log(response);
    dispatch(timerFinish());
    // let type: StateType = "work";
    let newType: StateType = "work";
    if (type === "work") {
      newType = (numPomos > 0 && numPomos % pomoConfig.pomoBeforeLongBreak === 0) ? "long_break" : "short_break";
    }
    setType(newType);

    console.log("ITS POSSIBLE THAT WORKS!")
    onCountdownStart(newType);
  }

  const formatHandler = () => {
    if (timer.active) {
      if (timer.timer >= 0) {
        return <Countdown
          value={timer.timer}
          onChange={onCountdownChange}
          format={"mm:ss"}
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
      const response = await axios(token).get(p.apiPomos + "?" + q.queryFilterStatusRunning);
      if (response.data.data.length > 0) {
        const end = moment(response.data.data[0].attributes.end);
        const diff = moment.duration(end.diff(moment()));
        if (diff.valueOf() > 0) {
          const calculate = moment().add(diff).valueOf();
          dispatch(timerStart({
            timer: Number(calculate),
            pomo: response.data.data[0]
          }));
        } else {
          dispatch(timerStart({
            timer: Number(diff.valueOf()),
            pomo: response.data.data[0]
          }));
        }
      }
    } catch (error: any) {
      console.log("ERROR - Checking if exist a running pomo")
      console.log(error);
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!timer.active && token) {
      checkPomoRunning();
    }
  }, [checkPomoRunning, timer.active, token]);

  const quickReset = useCallback(async () => {
    const response = await axios(token).put(p.apiPomos + q.queryID(8), {
      data: {
        reset: true,
      }
    });
    console.log(response)
  }, [token]);

  return (
    <div className={classes.timer}>
      <IconButton
        className={classes.timerIcon}
        tooltip="Setting"
        size="small"
        onClick={quickReset}
        icon={<SettingOutlined />}
      />
      <Progress
        type="circle"
        percent={timer.timer >= 0 ? timer.percent : 100}
        format={formatHandler}
      />
      <ButtonSelector
        active={timer.active}
        onStart={() => onCountdownStart(type)}
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