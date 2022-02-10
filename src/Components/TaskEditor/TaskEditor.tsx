import { useState } from "react";
import moment from "moment";
import produce from "immer";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer";

// Ant Design
import {
  Checkbox,
  Input,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Tooltip,
  Button,
  notification
} from "antd"
import {
  EditFilled
} from '@ant-design/icons';


// Classes & Styles
import classes from "./TaskEditor.module.less";

// Types
type TaskEditorPropType = {
  data: TaskType;
  id: number;

}

const TaskEditor = (props: TaskEditorPropType) => {
  const { data, id } = props;

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  const initialValues = produce(data, (draft: TaskType) => {
    draft.remind = data.remind && moment(data.remind);
  });

  // ------------------------------------------

  const openNotification = ({ message, description, type }: MsgProps) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  }

  // ------------------------------------------

  const handleOk = async (value: any) => {
    dispatch(loadingTask());
    const form = value.getFieldsValue();
    const updateTask = {
      title: form.title || data.title,
      complete: form.complete,
      expectPomo: form.expectPomo,
      note: form.note,
      remind: form.remind ? form.remind.toISOString() : null
    }
    try {
      await axios(token).put(p.apiTasks + q.queryID(id), {
        data: { ...updateTask }
      });
      const res = await axios(token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
      dispatch(getTasks(res.data.data));
      setOpen(false);

      openNotification({
        type: updateTask.complete ? 'success' : "info",
        message: `Task successfully updated ${updateTask.complete ? 'and completed' : ""}`,
        description: ``
      });

    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
      dispatch(failTask());
      setOpen(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(initialValues);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Edit">
        <Button
          shape="circle"
          icon={<EditFilled />}
          size="small"
          onClick={() => setOpen(true)}
        />
      </Tooltip>
      <Modal
        className={classes.modal}
        title={`Editing task - ${id}`}
        visible={open}
        onOk={() => handleOk(form)}
        onCancel={handleCancel}
      >
        <Form
          className={classes.form}
          name={`edit_task_${id}`}
          form={form}
          initialValues={initialValues}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="complete"
            valuePropName="checked"
            wrapperCol={{ offset: 6, span: 18 }}
          >
            <Checkbox >Task complete</Checkbox>
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            tooltip="Short text to describe the task itself ."
            rules={[{ required: true, message: 'Please input your name for your task.' }]}
          >
            <Input placeholder="What to do?" />
          </Form.Item>
          <Form.Item
            name="note"
            label="Notes"
            tooltip="Space to write notes or observations about the task."
            rules={[{ message: 'Please input your Username!' }]}
          >
            <Input.TextArea rows={6} placeholder="Notes, Comments & Observations" style={{ resize: 'none' }} />
          </Form.Item>

          <Form.Item
            label="Number of pomos"
            tooltip="Number of Pomos expected to complete this task."
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              name="expectPomo"
              rules={[{ required: true }]}
              style={{ display: 'inline-block' }}
            >
              <InputNumber placeholder="Input birth year" />
            </Form.Item>
            <Tooltip title="Worked done">
              <Form.Item
                name="workedPomo"
                style={{ display: 'inline-block', margin: '0 8px' }}
              >
                <InputNumber placeholder="0" disabled />
              </Form.Item>
            </Tooltip>
          </Form.Item>

          <Form.Item
            name="remind"
            label="Remind"
            tooltip="Date and Time to remind about the task."
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal >
    </>
  );
}

export default TaskEditor;