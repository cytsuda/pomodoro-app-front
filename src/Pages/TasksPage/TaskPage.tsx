import React from "react";

// Redux & Reducer
import { useSelector } from 'react-redux';

// AntDesign
import { Row, Col } from "antd";

// Classes & Styles
import classes from "./TaskPage.module.less";

// Custom Components
import TaskListComponent from "@/Components/TaskList/TaskList";
import TaskFormComponent from "@/Components/TaskFormComponent/TaskFormComponent"

const TaskPage = () => {
  const { user, task } = useSelector((state: RootState) => state);

  return (
    <Row gutter={[32, 32]}>
      <Col span={8}>
        <div className={classes.col}>
          <TaskFormComponent
            editable={true}
            display
          />
        </div>
      </Col>
      <Col span={16} >
        <TaskListComponent
          task={task}
          user={user}
        />
      </Col>
    </Row >
  );
}

export default TaskPage;
