import React, { useState } from "react";

// Ant Design
import { Typography, Button } from "antd";

// Classes & Styles
import classes from "./TaskList.module.less";

// Custom Components
import TaskItem from "@/Components/TaskItem/TaskItem";

interface TaskListTypes {

}

// Desconstructor
const { Title } = Typography

const TaskListComponent = (props: TaskListTypes) => {
  return (
    <div className={classes.container} >
      <div className={classes.top}>
        <Title level={5}>
          TaskList component
        </Title>
        <div >
          <Button type="primary">New Task</Button>
        </div>
      </div>
      <div className={classes.content}>
        <TaskItem />
        <TaskItem />
        <TaskItem />
        <TaskItem />
      </div>
    </div>
  )
}

export default TaskListComponent