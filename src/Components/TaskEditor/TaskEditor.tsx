import React from "react";
import moment from "moment";
import produce from "immer";

// Ant Design
import { Checkbox, Input, Modal, Form, DatePicker, InputNumber } from "antd"
// import { UserOutlined, LockOutlined } from '@ant-design/icons';


// Classes & Styles
import classes from "./TaskEditor.module.less";

// Types
type TaskEditorPropType = {
  data: TaskType;
  visible: boolean
  onOk: (value: any) => void;
  onCancel: () => void;
  id: number;

}

const TaskEditor = (props: TaskEditorPropType) => {
  const { data, visible, onOk, onCancel, id } = props;

  const [form] = Form.useForm();
  const initialValues = produce(data, (draft: TaskType) => {
    draft.remind = data.remind && moment(data.remind);
  });

  return (
    <Modal className={classes.modal} title={`Editing task - ${id}`} visible={visible} onOk={() => onOk(form)} onCancel={onCancel} >
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
          name="expectPomo"
          label="Number of pomos"
          tooltip="Number of Pomos expected to complete this task."
        >
          <InputNumber placeholder="0" />
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
  );
}

export default TaskEditor;