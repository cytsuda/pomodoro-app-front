import React, { useState } from "react";
import clsx from "clsx";

// AntDesign
import { Checkbox, Button, Tooltip } from "antd"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./TaskItem.module.less";


const TaskItem = () => {

  const [select, setSelect] = useState(false);
  const checked = false;

  return (
    <div className={clsx(classes.container, select && classes.active)}>
      <div className={classes.todo} onClick={() => setSelect(prev => !prev)}>
        <Checkbox checked={checked}>
          <span className={clsx(classes.checkbox, checked && classes.checked)}>Todo item from a list</span>
        </Checkbox>
        <Tooltip title="Expected pomos">
          <div className={classes.pomos}>
            3 / 4
          </div>
        </Tooltip>
      </div>
      <div className={classes.icons}>
        <div className={classes.iconsInner}>
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              size="small"
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

    </div >
  );
}

export default TaskItem