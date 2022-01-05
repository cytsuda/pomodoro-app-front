import React, { useState, useEffect, useCallback } from "react";
import moment, { Duration, Moment } from "moment";

// AntDesign Components & icons
import { Typography, Button, InputNumber, Space, Progress } from "antd";
import { ClockCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';


import classes from "./Clock.module.less";
import { NONAME } from "dns";

const { Title } = Typography;

type TimerType = {
  start: Moment,
  end: Moment,
}

const ClockPage = () => {
  const [timer, setTimer] = useState<TimerType>({ start: moment(), end: moment() });
  const [countdown, setCountdown] = useState<number>(0);
  const [duration, setDuration] = useState<number>(20);
  const [refreshRate, setRefreshRate] = useState<number>(500);
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    if (active && countdown > 0) {
      setTimeout(() => {
        setCountdown(timer.end.diff(moment(), "milliseconds"));
      }, refreshRate);
    }
    if (active && countdown <= 0) {
      setActive(false);
      alert("pomo finish")
    }
  }, [active, countdown, refreshRate]);

  const countdownStart = () => {
    setActive(true);
    const now = moment();
    const end = moment(now).add(duration, "seconds");
    setTimer({
      start: now,
      end: end
    });
    setCountdown(end.diff(moment(), "milliseconds"));
  }

  const durantionHandler = useCallback((type: "add" | "sub") => {
    if (type === "add") {
      setDuration(prev => prev + 1)
    } else {
      setDuration(prev => prev - 1)
    }
  }, [duration])

  const displayCountdown = (value: number) => {
    const minutes = Math.trunc(value / 60000);
    const seconds = Math.trunc((value - minutes * 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
  }

  const refreshRateChange = (value: number) => {
    setRefreshRate(value);
  }
  const progressHandler = (value: number) => {
    const difference = timer.end.diff(timer.start, "milliseconds");
    const progress = Math.floor(100 * (difference - countdown) / difference);
    return progress;
  }
  return (
    <div className={classes.main}>
      <Title level={2}>
        Clock Page
      </Title>
      <div className={classes.container}>

        <Progress style={{ margin: "12px auto" }}
          type="circle" percent={progressHandler(countdown)} format={() => active ? displayCountdown(countdown) : displayCountdown(duration * 60 * 1000)} />

        {active ? (
          <Button
            type="primary"
            danger
            onClick={() => setActive(false)}
          >
            Stop
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={countdownStart}
          >
            Start
          </Button>
        )}
        <div className={classes.box}>
          <Button
            type="primary"
            shape="circle"
            onClick={() => durantionHandler("sub")}
            icon={<MinusOutlined />}
          />
          <span className={classes.boxNumber}>
            {duration}
          </span>
          <Button
            type="primary"
            shape="circle"
            onClick={() => durantionHandler("add")}
            icon={<PlusOutlined />}
          />
        </div>

        <span>Refresh rate (milliseconds): {refreshRate}</span>
        <Space>
          <InputNumber
            addonBefore="Refresh Rate"
            min={100}
            max={1000}
            value={refreshRate}
            onChange={refreshRateChange}
          />
          <Button type="primary" danger onClick={() => setRefreshRate(500)}>
            Reset
          </Button>
        </Space>
      </div>
    </div >
  );
}

export default ClockPage;