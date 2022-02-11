// AntDesign Components & icons
import { Typography } from "antd";

// Redux
import { useSelector } from "react-redux";

// Custom components
import PomoController from "@/Components/PomoController/PomoController";
import TaskListComponent from "@/Components/TaskList/TaskList";
import TimeLineComponent from "@/Components/TimeLineComponent/TimeLineComponent";

// Classes & Styles
import classes from "./Clock.module.less";

const { Title } = Typography;


const ClockPage = () => {

  const { user, task, pomo } = useSelector((state: RootState) => state);
  //  user, task, pomo
  return (
    <div className={classes.main}>
      <Title level={2}>
        Clock/Working Page
      </Title>
      <div className={classes.container}>
        <PomoController className={classes.small} user={user} task={task} />
        <div className={classes.big}>
          <TaskListComponent user={user} task={task} />
        </div>
        <TimeLineComponent className={classes.full} pomo={pomo} />
      </div >
    </div >
  );
}

export default ClockPage;