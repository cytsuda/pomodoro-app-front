// AntDesign Components & icons
import { Typography, Card, Timeline } from "antd";

// Custom components
import TimerComponent from "@/Components/TimerComponent/TimerComponent";
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
        <div className={classes.small}>
          <TimerComponent />
        </div>

        <div className={classes.small}>
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
        </div>
        <div className={classes.big}>
          <TaskListComponent />
        </div>
      </div >
    </div >
  );
}

export default ClockPage;