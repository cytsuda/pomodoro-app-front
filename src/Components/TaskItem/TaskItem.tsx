import clsx from "clsx";
import axios, { path } from "@/Utils/apiController";

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

  const handleDelete = async () => {
    dispatch(loadingTask());
    try {
      await axios(user.token).delete(path.updateTask + id);
      const res = await axios(user.token).get(path.getTasks);
      dispatch(getTasks(res.data.data));
    } catch (error) {
      console.error("[Quick Delete] Error");
      console.log(error);
      dispatch(failTask());
    }
  }

  const handleCheck = async (e: CheckboxChangeEvent) => {
    dispatch(loadingTask());
    try {
      await axios(user.token).put(path.updateTask + id, {
        data: { complete: e.target.checked }
      });
      const res = await axios(user.token).get(path.getTasks);
      dispatch(getTasks(res.data.data));
    } catch (error) {
      console.error("[Quick Delete] Error");
      console.log(error);
      dispatch(failTask());
    }
  }


  return (
    <div className={classes.container}>
      <div className={classes.todo} >
        <Checkbox checked={data.complete} onChange={handleCheck}>
          <span className={clsx(classes.checkbox, data.complete && classes.checked)}>{data.title}</span>
        </Checkbox>

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