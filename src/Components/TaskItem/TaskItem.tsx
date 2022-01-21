import { useState } from "react";
import clsx from "clsx";
import axios, { path } from "@/Utils/apiController";

// Redux
import { useSelector } from "react-redux";


// AntDesign
import { Checkbox, Button, Tooltip } from "antd"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
  const [select, setSelect] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (value: any) => {
    const form = value.getFieldsValue();
    const updateTask = {
      title: form.title || data.title,
      complete: form.complete,
      expectPomo: form.expectPomo,
      note: form.note,
      remind: form.remind ? form.remind.toISOString() : null

    }
    try {
      const response = await axios(user.token).put(path.updateTask + id, {
        data: { ...updateTask }
      });
      console.log(response);
      setIsModalVisible(false);
    } catch (error) {
      console.log("TaskItem Error");
      console.log(error);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={clsx(classes.container, select && classes.active)}>
      <div className={classes.todo} onClick={() => setSelect(prev => !prev)}>
        <Checkbox checked={data.complete}>
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
      <div className={classes.icons}>
        <div className={classes.iconsInner}>
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={showModal}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </div>
      </div>
      <TaskEditor id={id} data={data} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} />
    </div >
  );
}

export default TaskItem