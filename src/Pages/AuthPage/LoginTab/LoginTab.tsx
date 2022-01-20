import React from "react";

// Ant Design
import { FormInstance, Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./LoginTab.module.less";

type LoginTabTypes = {
  form: FormInstance<any>;
  onSubmit: (values: any) => void;
}

const LoginTab = (props: LoginTabTypes) => {
  const { form, onSubmit } = props;
  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onSubmit} >
        <Form.Item name="identifier" rules={[{ required: true, message: 'Please input your username.', whitespace: true }]}>
          <Input
            prefix={<UserOutlined className={classes.icon} />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className={classes.icon} />}
            placeholder="Password" />
        </Form.Item>
        <Form.Item>
          {/* TODO - make remember me work */}
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className={classes.forgot} href="/">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginTab;