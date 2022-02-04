import { useCallback } from "react";
import clsx from "clsx";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer";

// AntDesign
import { Checkbox, Button, Tooltip, Popconfirm } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { DeleteFilled } from '@ant-design/icons';

// Custom Components
import TaskEditor from "@/Components/TaskEditor/TaskEditor";

// Classes & Styles
import classes from "./TaskItem.module.less";

type TaskItemPropType = {
  data: TaskType;
  id: number;
}

const TaskItem = (props: TaskItemPropType) => {
  const { data, id } = props;
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const task = useSelector((state: RootState) => state.task)

  const handleDelete = async () => {
    dispatch(loadingTask());
    try {
      await axios(user.token).delete(p.apiTasks + q.queryID(id));
      const res = await axios(user.token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        console.log(error);
        dispatch(failTask());
      }
    }
  }

  // TODO - when pomo is finish intermediate need to be false
  const handleComplete = useCallback(async (e: CheckboxChangeEvent) => {
    if (!task.loading) {
      console.log("Handler Check");
      dispatch(loadingTask());
      const updateWorkedPomo = data.workedPomo ? data.workedPomo : 0;
      let updateData = {
        complete: e.target.checked,
        intermediate: false,
        workedPomo: updateWorkedPomo + 1,
      }
      if (data.complete) {
        updateData = {
          intermediate: false,
          complete: false,
          workedPomo: updateWorkedPomo - 1
        }
      } else if (data.intermediate) {
        updateData = {
          intermediate: false,
          complete: true,
          workedPomo: updateWorkedPomo
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
          console.log(error)
        }
      }
    } else {
      console.log("loading...")
    }
  }, [data.complete, data.intermediate, data.workedPomo, dispatch, id, task.loading, user.token]);

  const handleIntermediate = useCallback(async () => {
    if (!task.loading) {
      console.log("Handler Inter")
      dispatch(loadingTask());
      const updateWorkedPomo = data.workedPomo ? data.workedPomo : 0;

      let updateData = {
        complete: false,
        intermediate: true,
        workedPomo: updateWorkedPomo + 1,
      }
      if (data.intermediate) {
        updateData = {
          complete: false,
          intermediate: false,
          workedPomo: updateWorkedPomo - 1
        }
      } else if (data.complete) {
        updateData = {
          complete: false,
          intermediate: true,
          workedPomo: updateWorkedPomo
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
          console.log(error)
        }
      }

    } else {
      console.log("loading...")
    }
  }, [data.complete, data.intermediate, data.workedPomo, dispatch, id, task.loading, user.token]);

  return (
    <div className={classes.container}>
      <div className={classes.todo} >
        <Checkbox checked={data.complete} indeterminate={data.intermediate} onChange={handleComplete} />
        <span className={clsx(classes.checkbox, (data.complete || data.intermediate) && classes.checked)} onClick={handleIntermediate}>
          {data.title}
        </span>

        {(data.expectPomo && data.expectPomo > 0) ? (
          <Tooltip title="Expected pomos">
            <div className={classes.pomos}>
              {data.workedPomo || 0} / {data.expectPomo || 0}
            </div>
          </Tooltip>
        ) : null}
      </div>
      <div className={classes.icons} >
        <TaskEditor id={id} data={data} />
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
    </div >
  );
}

export default TaskItem