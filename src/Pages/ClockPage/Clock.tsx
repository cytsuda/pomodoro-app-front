import { useCallback, useState, useEffect } from "react";
import moment from "moment";
import produce from "immer";

import axios, { path } from "@/Utils/apiController"

// Redux
import { useSelector, useDispatch } from 'react-redux';
// import { changeWork } from "@/Redux/timerReducer"
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer"

// AntDesign Components & icons
import { Typography, Row, Col, Card, Timeline, Button } from "antd";

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
  const user = useSelector((state: RootState) => state.user);
  const tasks = useSelector((state: RootState) => state.task);

  const dispatch = useDispatch();

  const [countdown, setCountdow] = useState<TimerType>({
    active: false,
    percent: 0,
    timer: 0
  });


  const statisticValue = moment(getTimeDuration(timer.workDuration)).format("mm:ss");


  const countdownChangeHandler = useCallback((value: number | string | undefined) => {
    console.log("[ClockPage] - countdownChangeHandler - callback");
    // Add timer.workDuration on the dependence of callback 
    if (value !== undefined) {
      const workDuration = getTimeDuration(timer.workDuration);
      const newValue = typeof value === 'string' ? Number(value) / workDuration : value / workDuration;
      setCountdow(produce(draft => {
        draft.percent = Math.round((1 - newValue) * 100);
      }));
    }
  }, [timer.workDuration]);


  const countdownStartHandler = useCallback(() => {
    console.log("[ClockPage] - countdownStartHandler - callback");
    // Add timer.workDuration on the dependence of callback
    setCountdow(
      produce((draft) => {
        draft.active = true;
        draft.timer = Date.now() + getTimeDuration(timer.workDuration);
      })
    );
  }, [timer.workDuration]);

  const countdownStopHandler = useCallback(() => {
    setCountdow(produce((draft) => {
      draft.active = false;
      draft.timer = 0;
      draft.percent = 0;
    }))
  }, []);

  const createNewTaskHandler = async (value: string) => {
    dispatch(loadingTask());
    try {
      console.log("trying to push")
      console.log(value)
      const response = await axios(user.token).post(path.newTask, {
        data: { title: value }
      });
      console.log("SUCCESS");
      console.log(response);
      const res = await axios(user.token).get(path.getTasks);
      dispatch(getTasks(res.data.data));
    } catch (error) {
      console.log("FAIL");
      console.log(error);
      dispatch(failTask());
    }
  };

  const getAllTask = useCallback(async () => {
    dispatch(loadingTask());
    console.log("getAllTask")
    try {
      const res = await axios(user.token).get(path.getTasks);
      dispatch(getTasks(res.data.data));

    } catch (error) {
      console.error("[GET ALL TASK] - Fail");
      console.log(error);
      dispatch(failTask());
    }
  }, [dispatch, user.token]);

  useEffect(() => {
    if (user && user.token) {
      getAllTask();
    }
  }, [getAllTask, user]);

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
          <TaskListComponent
            refreshHandler={getAllTask}
            onNewTask={createNewTaskHandler}
            tasks={tasks}
          />
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