// React
import { useEffect, useCallback } from "react";
import clsx from "clsx";
import moment from "moment";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setPomos } from "@/Redux/pomosReducers"

// AntD
import { Card, Timeline, Button, Typography } from "antd"

// Custom Components
import CountdownComponent from "@/Components/Contdown/Countdown";
// Classes
import classes from "./PomoController.module.less";


// Deconstructors
const { Meta } = Card;
const { Text } = Typography;

interface Props {
  className: string;
}


const PomoController = ({ className }: Props) => {
  const dispatch = useDispatch();
  const pomo = useSelector((state: RootState) => state.pomo);
  const user = useSelector((state: RootState) => state.user);
  const { pomoConfig } = user.userConfig;
  const getAllPomos = useCallback(async () => {

    try {
      const response = await axios(user.token).get(p.apiPomos + "?" + q.queryFilterToday());
      // console.log('Get allPomo - TODAY ');
      // for now is 1, when i finish this need to be 2
      dispatch(setPomos({ pomos: response.data.data, total: response.data.meta.pagination.total }));

    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        console.log(error)
      }
    }
  }, [dispatch, user.token]);

  useEffect(() => {
    if (user.token) {
      getAllPomos();
    }
  }, [getAllPomos, user.token]);

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

  return (
    <>
      <Card
        className={clsx(className, classes.container)}
        cover={<CountdownComponent user={user} />}
      >
        {/* TODO - What should be displayed in cardTitle and Description?? */}
        <Meta
          title="Card title"
          description="This is the description"
        />
        <div className={classes.info}>
          <Text>Work Duration: {pomoConfig.workDuration}</Text>
          <Text>Short Break: {pomoConfig.shortBreakDuration}</Text>
          <Text>Long Break: {pomoConfig.longBreakDuration}</Text>
          <Text>Pomo Before Long Break: {pomoConfig.pomoBeforeLongBreak}</Text>
        </div>
        <Button onClick={getAllPomos}>POMOS</Button>
      </Card >
      {pomo && pomo.pomos.length > 0 && (
        <div className={clsx(className, classes.container)}>
          <Card title="Complete tasks and when">
            <Timeline mode="left">
              {sortFunction(pomo.pomos).map((item: PomoType) => (
                <Timeline.Item key={item.id} color={getColor(item.attributes.type)} >
                  <p>{moment(item.attributes.end).format("DD/MM/YY HH:mm:ss")} - {item.attributes.type}</p>
                  {(item.attributes.tasks && item.attributes.tasks.data.length > 0) && item.attributes.tasks.data.map((task: FetchedTaskType) => (
                    <p key={`task_` + task.id}>{task.attributes.title}</p>
                  ))}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </div>
      )}
    </>
  );
}

export default PomoController;
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