// AntDesign Components & icons
import { Typography } from "antd";

// Custom components
import PomoController from "@/Components/PomoController/PomoController";
import TaskListComponent from "@/Components/TaskList/TaskList";
import TimeLineComponent from "@/Components/TimeLineComponent/TimeLineComponent";

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
        <PomoController className={classes.small} />
        <div className={classes.big}>
          <TaskListComponent />
        </div>
        <TimeLineComponent className={classes.full} />
      </div >
    </div >
  );
}

export default ClockPage;