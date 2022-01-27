import React, { useState, useRef, useCallback, useEffect } from "react";
import clsx from "clsx";
// Axios
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer"

// Ant Design
import { Typography, Button, Input } from "antd";
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

  // Functions
  const handleTaskTitle = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    setTaskTitle(target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log("Send task title to add");
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
      console.log("Send task title to add");
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
      console.log("trying to push")
      console.log(text)
      const response = await axios(user.token).post(p.apiTasks, {
        data: { title: text }
      });
      console.log("SUCCESS");
      console.log(response);
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
    } catch (error) {
      console.log("FAIL");
      console.log(error);
      dispatch(failTask());
    }
  }

  const getAllTask = useCallback(async () => {
    dispatch(loadingTask());
    try {
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
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
    <div className={classes.container} >
      <div className={classes.top}>
        <Title level={5}>
          List of tasks {tasks && "- " + tasks.data.length + " tasks"}
        </Title>
        <div className={classes.refresh}>
          <Button shape="circle" icon={<SyncOutlined spin={tasks.loading} />} onClick={getAllTask} />
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
      <div className={classes.content}>
        {tasks && tasks.data.map((item: FetchedTaskType) => (
          <TaskItem id={item.id} data={item.attributes} key={item.id} />
        ))}
      </div>
    </div>
  )
}

export default TaskListComponent