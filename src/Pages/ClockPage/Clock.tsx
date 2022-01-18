import React, { useCallback, useState } from "react";
import moment from "moment";
import produce from "immer";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { changeWork } from "@/Redux/timerReducer"

// AntDesign Components & icons
import { Typography, Row, Col, Card, Timeline } from "antd";

// Custom components
import TimerComponent from "@/Components/TimerComponent/TimerComponent";
import TaskListComponent from "@/Components/TaskList/TaskList";

// Classes & Styles
import classes from "./Clock.module.less";

const { Title } = Typography;

const getTimeDuration = (value: number) => {
  return value * 1000;
}

const ClockPage = () => {
  const timer = useSelector((state: RootState) => state.timer);
  const [countdown, setCountdow] = useState<TimerType>({
    active: false,
    percent: 0,
    timer: 0
  });

  const statisticValue = moment(getTimeDuration(timer.workDuration)).format("mm:ss");


  const countdownChangeHandler = useCallback((value: number | string | undefined) => {
    if (value !== undefined) {
      const workDuration = getTimeDuration(timer.workDuration);
      const newValue = typeof value === 'string' ? Number(value) / workDuration : value / workDuration;
      setCountdow(produce(draft => {
        draft.percent = Math.round((1 - newValue) * 100);
      }));
    }
  }, []);


  const countdownStartHandler = useCallback(() => {
    setCountdow(
      produce((draft) => {
        draft.active = true;
        draft.timer = Date.now() + getTimeDuration(timer.workDuration);
      })
    );
  }, []);

  const countdownStopHandler = useCallback(() => {
    setCountdow(produce((draft) => {
      draft.active = false;
      draft.timer = 0;
      draft.percent = 0;
    }))
  }, []);

  return (
    <div className={classes.main}>
      <Title level={2}>
        Clock/Working Page
      </Title>
      <Row gutter={[32, 32]} align="stretch">
        <Col span={6} >
          <TimerComponent
            defaultValue={statisticValue}
            countdown={countdown}
            onStart={countdownStartHandler}
            onStop={countdownStopHandler}
            countOnChange={countdownChangeHandler}
          />
        </Col>
        <Col span={18} >
          <TaskListComponent />
        </Col>
        <Col span={6} >
          <Card title="Complete tasks and when">
            <Timeline mode="left">
              <Timeline.Item>
                <p>12/12/12 22:03:02</p>
                <p>Solve initial network problems 1</p>
                <p>Solve initial network problems 2</p>
              </Timeline.Item>
              <Timeline.Item color='red'>Solve initial network problems</Timeline.Item>
              <Timeline.Item>Technical testing</Timeline.Item>
              <Timeline.Item>Network problems being solved</Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

    </div >
  );
}

export default ClockPage;