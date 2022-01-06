import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";

// AntDesign Components & icons
import { Typography, Button, InputNumber, Space, Progress, Statistic } from "antd";
import { ClockCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';


import classes from "./Clock.module.less";

const { Title } = Typography;
const { Countdown } = Statistic;

const getTimeDuration = (value: number) => {
  return value * 1000;
}

type ActiveType = {
  active: boolean,
  timer: number | string | undefined
}
const ClockPage = () => {

  const [percent, setPercent] = useState<number>(0)
  const [duration, setDuration] = useState<number>(20);
  const [active, setActive] = useState<ActiveType>({
    active: false,
    timer: 0
  });

  const countdownChange = (e: number | string | undefined) => {
    if (e !== undefined) {
      const value = typeof e === "string" ? Number(e) / getTimeDuration(duration) : e / getTimeDuration(duration);
      setPercent(Math.round((1 - value) * 100));
    }
  }

  return (
    <div className={classes.main}>
      <Title level={2}>
        Clock Page
      </Title>
      <div className={classes.container}>

        <Progress
          style={{ margin: "12px auto" }}
          type="circle"
          percent={percent}
          format={() => active.active ? (
            <Countdown
              value={active.active ? active.timer : 0}
              onChange={countdownChange}
              format={"mm:ss"}
            />
          ) : (
            <Statistic value={moment(getTimeDuration(duration)).format("mm:ss")} />
          )}
        />

        {active.active ? (
          <Button
            type="primary"
            danger
            onClick={() => setActive(prev => ({
              timer: 0,
              active: false,
            }))}
          >
            Stop
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => setActive(prev => ({
              timer: Date.now() + getTimeDuration(duration),
              active: true,
            }))}
          >
            Start
          </Button>

        )}
        <div className={classes.box}>
          <Button
            type="primary"
            shape="circle"
            onClick={() => console.log("sub")}
            icon={<MinusOutlined />}
          />
          <span className={classes.boxNumber}>
            duration
          </span>
          <Button
            type="primary"
            shape="circle"
            onClick={() => console.log("add")}
            icon={<PlusOutlined />}
          />
        </div>

      </div>
    </div >
  );
}

export default ClockPage;