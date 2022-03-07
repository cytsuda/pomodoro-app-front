import { useState } from "react";

// Ant Design
import {
  Modal,
  Tooltip,
  Button, Grid
} from "antd"
import {
  EditFilled
} from '@ant-design/icons';


// Classes & Styles
import classes from "./ModalTaskEditor.module.less";

// Custom Component
import TaskComponent from "@/Components/TaskFormComponent/TaskFormComponent";

// Desconstructor
const { useBreakpoint } = Grid;

// Types
type TaskEditorPropType = {
  data: TaskType;
  id: number;
  editable: boolean;
  children?: JSX.Element;
}

const TaskEditor = ({ data, id, editable, children }: TaskEditorPropType) => {
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)}>
          {children}
        </span>
      ) : (
        <Tooltip title="Edit">
          <Button
            shape={!screens.sm ? "round" : "circle"}
            icon={<EditFilled />}
            size={!screens.sm ? "middle" : "small"}
            onClick={() => setOpen(true)}
          >
            {!screens.sm && "Edit"}
          </Button>
        </Tooltip>
      )}
      <Modal
        className={classes.modal}
        title={`Editing task`}
        visible={open}
        footer={null}
        centered
        onCancel={() => setOpen(false)}
      >
        <TaskComponent
          editable={editable}
          data={data}
          id={id}
          onClose={() => setOpen(false)}
        />
      </Modal >
    </>
  );
}
export default TaskEditor;