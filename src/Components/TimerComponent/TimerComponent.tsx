// React

// Axios

// Redux
import { useSelector, } from "react-redux";
// import {  } from "@/Redux/timerReducer"

// AntD
import { Card } from "antd"

// Custom Components
import CountdownComponent from "@/Components/Contdown/Countdown";
// Classes
import classes from "./TimerComponent.module.less";


// Deconstructors
const { Meta } = Card;

// interface TimerComponentProps {
// }
const TimerComponent = () => {

  // const timer = useSelector((state: RootState) => state.timer);
  const user = useSelector((state: RootState) => state.user);

  let pomoConfig: PomoConfigType = {
    longBreakDuration: 15,
    shortBreakDuration: 5,
    workDuration: 25,
    pomoBeforeLongBreak: 4,
  }
  if (user.user) {
    pomoConfig = user.user.pomoConfig;
  }

  return (
    <Card
      className={classes.container}
      cover={<CountdownComponent user={user} type="work" />}
    >
      <Meta
        title="Card title"
        description="This is the description"
      />
      <>
        <p>Work Duration: {pomoConfig.workDuration}</p>
        <p>Short Break: {pomoConfig.shortBreakDuration}</p>
        <p>Long Break: {pomoConfig.longBreakDuration}</p>
        <p>Pomo Before Long Break: {pomoConfig.pomoBeforeLongBreak}</p>
      </>
    </Card >
  );
}

export default TimerComponent
