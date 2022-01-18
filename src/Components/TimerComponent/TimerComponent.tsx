import React from "react";

// AntD
import { Card, Progress, Statistic, Button } from "antd"
import { SettingOutlined } from '@ant-design/icons';

// Custom Components
import IconButton from "@/Components/IconButton/IconButton";

// Classes
import classes from "./TimerComponent.module.less";

// Deconstructors
const { Countdown } = Statistic;
const { Meta } = Card;

interface TimerComponentProps {
  defaultValue: string,
  countdown: TimerType,
  onStart: () => void,
  onStop: () => void,
  countOnChange: (v?: number | string) => void
}
const TimerComponent = (props: TimerComponentProps) => {
  const { defaultValue, countdown, onStart, onStop, countOnChange } = props;

  const formatHandler = () => {
    if (countdown.active) {
      return <Countdown
        value={countdown.active ? countdown.timer : 0}
        onChange={countOnChange}
        format={"mm:ss"}
      />
    }
    return defaultValue
  }

  const IconBtn = <IconButton
    className={classes.timerIcon}
    tooltip="Setting"
    size="small"
    onClick={() => console.log("Open modal to change settings")}
    icon={<SettingOutlined />}
  />
  return (
    <Card
      className={classes.container}
      cover={
        <div className={classes.timer}>
          {IconBtn}
          <Progress
            type="circle"
            percent={countdown.percent}
            format={formatHandler}
          />
          <ButtonSelector
            active={countdown.active}
            onStart={onStart}
            onStop={onStop}
          />
        </div>
      }
    >
      <Meta
        title="Card title"
        description="This is the description"
      />
    </Card >
  );
}

export default TimerComponent

const ButtonSelector = (props: { active: boolean, onStart: () => void, onStop: () => void }) => {
  const { active, onStart, onStop } = props;
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