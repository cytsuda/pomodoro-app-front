import React from "react";
import clsx from "clsx";
import moment from "moment";

// Redux
import { useSelector } from "react-redux";

// AntDesign
import { Card, Timeline } from "antd";
import { ClockCircleOutlined, HourglassOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./TimeLineComponent.module.less";

// Type
interface Props {
  className?: string;
}

const TimeLineComponent = ({ className }: Props) => {
  const { pomo } = useSelector((state: RootState) => state);

  const sortFunction = (array: any[]) => {
    const sortArray = array.slice().sort((a: any, b: any) => {
      if (a.id < b.id) {
        return 1;
      } else if (b.id < a.id) {
        return -1;
      } else {
        return 0;
      }
    })
    return sortArray;
  }
  if (pomo && pomo.pomos.length > 0) {
    return (
      <Card className={clsx(className, classes.card)} title={
        <div className={classes.cardTitle}>

          <span className={classes.cardTitleText} >
            History & Actives
          </span>
          <span className={classes.cardTitleDate}>
            {moment().format("DD/MM/YY")}
          </span>
        </div>
      }>
        <Timeline mode="left">
          {sortFunction(pomo.pomos).map((item: PomoType) => (
            <Timeline.Item
              key={item.id}
              color={getColor(item.attributes.type)}
              label={(
                <div className={classes.time}>
                  <span className={classes.timeStart}>{moment(item.attributes.start).format("HH:mm")}</span>
                  <span className={classes.timeEnd}>{moment(item.attributes.end).format("HH:mm")}</span>
                </div>
              )}
              dot={item.attributes.type === "work" ?
                <ClockCircleOutlined className={classes.iconWork} /> :
                <HourglassOutlined className={
                  clsx(item.attributes.type === "short_break" ? classes.iconShort : classes.iconLong)
                } />}
            >
              {item.attributes.type !== "work" ? (
                <p>{item.attributes.type === "short_break" ? "Short Break" : "Long Break"}</p>
              ) : (item.attributes.tasks && item.attributes.tasks.data.length > 0) ? item.attributes.tasks.data.map((task: FetchedTaskType) => (
                <p key={`task_` + task.id}>{task.attributes.title}</p>
              )) : (
                <p>No task associate.</p>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    );
  } else {
    return <></>
  }
}

export default TimeLineComponent;


const getColor = (type: string) => {
  switch (type) {
    case "work":
      return "red";
    case "short_break":
      return "cyan";
    case "long_break":
      return "blue";
    default:
      return "yellow"
  }
}