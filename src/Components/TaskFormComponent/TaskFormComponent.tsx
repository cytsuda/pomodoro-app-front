import React from "react";
import produce from "immer";
import moment from "moment";


// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks, loadingTask, failTask } from "@/Redux/taskReducer";

// Ant Design
import {
  Divider,
  Form,
  Alert,
  Checkbox,
  Input,
  InputNumber,
  DatePicker,
  Tooltip,
  Button,
  Grid,
  notification
} from "antd";

// Classes & Styles
import classes from "./TaskFormComponent.module.less";

const { useBreakpoint } = Grid;

type Props = {
  editable: boolean;
  id?: number;
  data?: TaskType;
  display?: boolean;
  onClose?: () => void;
}
const TaskComponent = ({ editable, data, id, onClose, display }: Props) => {
  const [form] = Form.useForm();

  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  let initialValues = {}
  if (data) {
    initialValues = produce(data, (draft: TaskType) => {
      draft.remind = data.remind && moment(data.remind);
      draft.updatedAt = data.updatedAt && moment(data.updatedAt);
      draft.createdAt = data.createdAt && moment(data.createdAt);
      draft.completeDate = data.completeDate && moment(data.completeDate);
    });
  }

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

    let updateTask = {
      title: form.title || (data && data.title) || "no title provide.",
      complete: form.complete || false,
      expectPomo: form.expectPomo,
      note: form.note,
      remind: form.remind ? form.remind.toISOString() : null
    }

    try {
      if (id) {
        await axios(token).put(p.apiTasks + q.queryID(id), {
          data: { ...updateTask }
        });
        const res = await axios(token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);
        dispatch(getTasks(res.data.data));
        if (onClose) {
          onClose();
        }

        openNotification({
          type: updateTask.complete ? 'success' : "info",
          message: `Task successfully updated ${updateTask.complete ? 'and completed' : ""}`,
          description: ``
        });

      } else {
        const { data: res } = await axios(token).post(p.apiTasks, {
          data: updateTask
        });
        console.log(res.data);
        openNotification({
          type: 'success',
          message: `Task successfully created: "${res.data.attributes.title}"`,
          description: ``
        });
        if (res.data.id) {
          const { data: res } = await axios(token).get(p.apiTasks + "?" + q.queryPopulateSubTasks);

          dispatch(getTasks(res.data));
        } else {
          openNotification({
            type: 'error',
            message: "An error has occurred",
            description: `Error: unknown error. Task creation error.`
          });
        }
      }
      value.resetFields();

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
      dispatch(failTask());
      if (onClose) {
        onClose();
      }
      value.resetFields();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    if (onClose) {
      onClose()
    }
  };

  return (
    <Form
      name={`edit_task_${id}`}
      form={form}
      initialValues={initialValues}
      labelCol={id ? { span: 6 } : {}}
      wrapperCol={id ? { span: 18 } : {}}
      layout={id ? "horizontal" : "vertical"}
    >
      {!editable && (
        <Alert
          className={classes.alert}
          message="This task is complete and archived."
          description="You cannot fully edit this task, you can only add or edit the notes."
          type="warning"
          showIcon
        />
      )}
      {id && (
        <Form.Item
          name="complete"
          valuePropName="checked"
          wrapperCol={screens.sm ? { offset: 6, span: 18 } : { span: 24 }}
        >
          <Checkbox disabled={!editable}>Task complete</Checkbox>
        </Form.Item>
      )}
      <Form.Item
        name="title"
        label="Title"
        tooltip="Short text to describe the task itself ."
        rules={[{ required: true, message: 'Please input your name for your task.' }]}
      >
        <Input placeholder="What to do?" disabled={!editable} />
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
          <InputNumber placeholder="Number" disabled={!editable} />
        </Form.Item>
        {id && (
          <Tooltip title="Worked done">
            <Form.Item
              name="workedPomo"
              style={{ display: 'inline-block', margin: '0 8px' }}
            >
              <InputNumber placeholder="0" disabled />
            </Form.Item>
          </Tooltip>
        )}
      </Form.Item>



      {!editable && data && data.complete && (
        <>
          <Divider />
          <div className={classes.date}>
            <Form.Item
              className={classes.dateItem}
              name="createdAt"
              label="Created At"
              tooltip="Date this task was created."
            >
              <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" disabled />
            </Form.Item>
            <Form.Item
              className={classes.dateItem}
              name="completeDate"
              label="Completed At"
              tooltip="Date this task was completed."
            >
              <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" disabled />
            </Form.Item>
            <Form.Item
              className={classes.dateItem}
              name="updatedAt"
              label="Updated At"
              tooltip="Last time this task was updated"
            >
              <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" disabled />
            </Form.Item>
          </div>
        </>
      )}
      {(!display || !id) && (
        <>
          <Divider />
          <div className={classes.buttons}>
            <Button
              size="large"
              danger
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={() => handleOk(form)}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}

export default TaskComponent;