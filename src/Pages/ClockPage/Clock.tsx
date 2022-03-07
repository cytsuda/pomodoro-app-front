// AntDesign Components & icons
import { Typography, Row, Col } from "antd";

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
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <PomoController user={user} task={task} />
        </Col>
        <Col xs={24} md={18}>
          <TaskListComponent user={user} task={task} />
        </Col>
      </Row>
      <TimeLineComponent pomo={pomo} />
    </div >
  );
}

export default ClockPage;