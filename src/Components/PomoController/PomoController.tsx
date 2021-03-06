// React
import { useEffect, useCallback } from "react";
import clsx from "clsx";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useDispatch } from "react-redux";
import { setPomos } from "@/Redux/pomosReducers"

// AntD
import { Card, notification } from "antd";

// Custom Components
import CountdownComponent from "@/Components/Contdown/Countdown";
// Classes
import classes from "./PomoController.module.less";


// Deconstructors
const { Meta } = Card;

interface Props {
  className?: string;
  user: ControlType;
  task: TasksControlType;
}


const PomoController = ({ className, user, task }: Props) => {
  const dispatch = useDispatch();

  const getAllPomos = useCallback(async () => {
    try {
      const response = await axios(user.token).get(p.apiPomos + "?" + q.queryFilterToday());
      // for now is 1, when i finish this need to be 2
      dispatch(setPomos({ pomos: response.data.data, total: response.data.meta.pagination.total }));


    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}.`
        });
      } else {
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }
  }, [dispatch, user.token]);

  // ------------------------------------------

  const openNotification = ({ message, description, type }: MsgProps) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topLeft",
    });
  }

  // ------------------------------------------

  useEffect(() => {
    if (user.token) {
      getAllPomos();
    }
  }, [getAllPomos, user.token]);

  return (
    <Card
      className={clsx(className, classes.card)}
      cover={<CountdownComponent user={user} />}
      bordered={true}
    >
      {/* TODO - META > Title, if title is lengthy than the card tooltip should be used to show all the text */}
      <Meta
        title={
          <span
            className={classes.cardTitle}>
            {(task && task.data && task.data.filter((item: FetchedTaskType) => (!item.attributes.completeDate)).length > 0) ?
              task.data.filter((item: FetchedTaskType) => (!item.attributes.completeDate))[0].attributes.title
              : "No task is select"}
          </span>}
        description={
          (task && task.data && task.data.filter((item: FetchedTaskType) => (!item.attributes.completeDate)).length > 0) ?
            task.data.filter((item: FetchedTaskType) => (!item.attributes.completeDate))[0].attributes.note
            : null
        }
      />
    </Card >
  );
}

export default PomoController;
