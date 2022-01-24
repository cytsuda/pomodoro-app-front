import React, { useState, useRef } from "react";
import clsx from "clsx";

// Redux
import { useSelector } from "react-redux";

// Ant Design
import { Typography, Button, Input } from "antd";
import { SyncOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./TaskList.module.less";

// Custom Components
import TaskItem from "@/Components/TaskItem/TaskItem";

interface TaskListTypes {
  onNewTask: (value: string) => void;
  refreshHandler: () => void;
  tasks?: TasksType;
}

// Desconstructor
const { Title } = Typography

const TaskListComponent = (props: TaskListTypes) => {
  const { onNewTask, refreshHandler, tasks } = props;

  const [taskTitle, setTaskTitle] = useState('');
  const [focus, setFocus] = useState(false);

  const task = useSelector((state: RootState) => state.task)

  const inputRef = useRef<Input>(null);
  const handleTaskTitle = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    setTaskTitle(target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log("Send task title to add");
      onNewTask(taskTitle);
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
      onNewTask(taskTitle);
      setTaskTitle("");
      setFocus(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  return (
    <div className={classes.container} >
      <div className={classes.top}>
        <Title level={5}>
          List of tasks {tasks && "- " + tasks.data.length + " tasks"}
        </Title>
        <div className={classes.refresh}>
          <Button shape="circle" icon={<SyncOutlined spin={task.loading} />} onClick={refreshHandler} />
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