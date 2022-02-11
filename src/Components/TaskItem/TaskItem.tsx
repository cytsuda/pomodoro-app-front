import { useCallback } from "react";
import clsx from "clsx";
import moment from "moment";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer";

// AntDesign
import { Checkbox, Button, Tooltip, Popconfirm, notification } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { DeleteFilled } from '@ant-design/icons';

// Custom Components
import TaskEditor from "@/Components/TaskEditor/TaskEditor";

// Classes & Styles
import classes from "./TaskItem.module.less";

type TaskItemPropType = {
  data: TaskType;
  id: number;
  disabled?: boolean;
}

const TaskItem = ({ data, id, disabled = false }: TaskItemPropType) => {

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  // ------------------------------------------

  const openNotification = ({ message, description, type }: MsgProps) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  }

  // ------------------------------------------

  const handleDelete = async () => {
    dispatch(loadingTask());
    try {
      await axios(user.token).delete(p.apiTasks + q.queryID(id));
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
      openNotification({
        type: 'success',
        message: "Tasks successfully deleted",
        description: ``
      });
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        dispatch(failTask());
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        dispatch(failTask());
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }
  }

  // TODO - when pomo is finish intermediate need to be false
  const handleComplete = useCallback(async (e: CheckboxChangeEvent) => {
    dispatch(loadingTask());
    let updateData = {
      complete: e.target.checked,
      intermediate: false,
    }
    if (data.complete) {
      updateData = {
        intermediate: false,
        complete: false,
      }
    } else if (data.intermediate) {
      updateData = {
        intermediate: false,
        complete: true,
      }
    }
    try {
      await axios(user.token).put(p.apiTasks + q.queryID(id), {
        data: updateData
      });
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        console.log(err);
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }
  }, [data.complete, data.intermediate, dispatch, id, user.token]);

  const handleIntermediate = useCallback(async (dis: boolean) => {
    if (!dis) {
      dispatch(loadingTask());

      let updateData = {
        complete: false,
        intermediate: true,
      }
      if (data.intermediate) {
        updateData = {
          complete: false,
          intermediate: false,
        }
      } else if (data.complete) {
        updateData = {
          complete: false,
          intermediate: true,
        }
      }
      try {
        await axios(user.token).put(p.apiTasks + q.queryID(id), {
          data: updateData
        });
        const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
        dispatch(getTasks(res.data.data));
      } catch (err) {
        if (request.isAxiosError(err) && err.response) {
          const { data } = err.response;
          const { error } = data;
          openNotification({
            type: 'error',
            message: "An error has occurred",
            description: `Error: ${error.message}`
          });
        } else {
          console.log(err);
          openNotification({
            type: 'error',
            message: "An error has occurred",
            description: `Error: unknown error.`
          });
        }
      }

    } else {
      openNotification({
        type: 'warning',
        message: "Task is disable",
        description: ``
      });
    }
  }, [data.complete, data.intermediate, dispatch, id, user.token]);

  return (
    <div className={classes.container}>
      <div className={classes.todo} >
        <Checkbox disabled={disabled} checked={data.complete} indeterminate={data.intermediate} onChange={handleComplete} />
        <span
          className={clsx(
            classes.checkbox,
            (data.complete || data.intermediate) && !disabled && classes.checked,
            disabled && classes.disabled
          )}
          onClick={() => handleIntermediate(disabled)}
        >
          {data.title}
        </span>
        <div className={classes.end}>
          {(data.expectPomo && data.expectPomo > 0) ? (
            <Tooltip title="Expected pomos">
              <span className={clsx(classes.endPomos, disabled && classes.disabled)}>
                {data.workedPomo || 0} / {data.expectPomo || 0}
              </span>
            </Tooltip>
          ) : null}
          {disabled && (
            <>
              <TaskEditor id={id} data={data} editable={false} >
                <Tooltip title={`${moment(data.completeDate).format("DD/MM/YYYY")} at ${moment(data.completeDate).format("HH:mm")}`}>
                  <Button
                    className={classes.endText}
                    type="text"
                    size="small"
                  >
                    Task finish
                  </Button>
                </Tooltip>
              </TaskEditor>
            </>
          )}
        </div>
      </div>
      {
        !disabled && (
          <div className={classes.icons} >
            <TaskEditor id={id} data={data} editable={true} />
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this task?"
                onConfirm={handleDelete}
              >
                <Button
                  shape="circle"
                  icon={<DeleteFilled />}
                  size="small"
                />
              </Popconfirm>
            </Tooltip>
          </div>
        )
      }
    </div >
  );
}

export default TaskItem