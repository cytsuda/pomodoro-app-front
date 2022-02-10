import React, { useState, useRef, useCallback, useEffect } from "react";
import clsx from "clsx";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer"

// Ant Design
import { Typography, Button, Input, Divider, notification } from "antd";
import { SyncOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./TaskList.module.less";

// Custom Components
import TaskItem from "@/Components/TaskItem/TaskItem";

// interface TaskListTypes {
// }

// Desconstructor
const { Title } = Typography

// Component
const TaskListComponent = () => {
  // Redux
  const tasks = useSelector((state: RootState) => state.task);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  // Local States - [ ] - possible change or remove 
  const [taskTitle, setTaskTitle] = useState('');
  const [focus, setFocus] = useState(false);
  // Ref
  const inputRef = useRef<Input>(null);

  // ------------------------------------------
  const openNotification = ({ message, description, type }: MsgProps) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  }

  // ------------------------------------------

  // Functions
  const handleTaskTitle = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    setTaskTitle(target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createNewTask(taskTitle);
      setTaskTitle("");
      setFocus(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  const handleNewTask = () => {
    if (!taskTitle && inputRef.current) {
      inputRef.current.focus();
    } else {
      createNewTask(taskTitle);
      setTaskTitle("");
      setFocus(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  const createNewTask = async (text: string) => {
    dispatch(loadingTask());
    try {
      await axios(user.token).post(p.apiTasks, {
        data: { title: text }
      });
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
      openNotification({
        type: 'success',
        message: "Task successfully created",
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
      dispatch(failTask());
    }
  }

  const getAllTask = useCallback(async (auto: boolean = false) => {
    dispatch(loadingTask());
    try {
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
      if (!auto) {
        openNotification({
          type: 'success',
          message: "All tasks successfully loaded ",
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
      dispatch(failTask());
    }
  }, [dispatch, user.token]);


  useEffect(() => {
    if (user && user.token) {
      getAllTask(true);
    }
  }, [getAllTask, user]);


  return (
    <div className={classes.container} >
      <div className={classes.top}>
        <Title level={5}>
          List of tasks {tasks && "- " + tasks.data.filter((item: FetchedTaskType) => !item.attributes.completeDate).length + " tasks"}
        </Title>
        <div className={classes.refresh}>
          <Button shape="circle" icon={<SyncOutlined spin={tasks.loading} />} onClick={() => getAllTask(false)} />
        </div>
        <div className={classes.task}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        >
          <Input
            ref={inputRef}
            value={taskTitle}
            className={clsx(classes.taskInput, focus && classes.focus)}
            placeholder="New task" onChange={handleTaskTitle}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="primary"
            className={classes.taskBtn}
            onClick={handleNewTask}
          >
            {!focus ? "New Task" : "Create"}
          </Button>
        </div>
      </div>
      <div>
        <div className={classes.content}>
          {tasks && tasks.data.filter((item: FetchedTaskType) => !item.attributes.completeDate).map((item: FetchedTaskType) => (
            <TaskItem id={item.id} data={item.attributes} key={item.id} />
          ))}
        </div>
        <Divider orientation="left">Complete Tasks</Divider>
        <div className={classes.content}>
          {tasks && tasks.data.filter((item: FetchedTaskType) => item.attributes.completeDate).map((item: FetchedTaskType) => (
            <TaskItem disabled id={item.id} data={item.attributes} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskListComponent