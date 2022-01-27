// AntDesign Components & icons
import { Typography } from "antd";

// Custom components
import TimerComponent from "@/Components/PomoController/PomoController";
import TaskListComponent from "@/Components/TaskList/TaskList";

// Classes & Styles
import classes from "./Clock.module.less";

const { Title } = Typography;


const ClockPage = () => {

  return (
    <div className={classes.main}>
      <Title level={2}>
        Clock/Working Page
      </Title>
      <div className={classes.container}>
        <TimerComponent className={classes.small} />
        <div className={classes.big}>
          <TaskListComponent />
        </div>
      </div >
    </div >
  );
}

export default ClockPage;