import React from "react";

// Ant Design
import { FormInstance, Form, Input, Button } from "antd";

// Classes & Styles
import classes from "./RegisterTab.module.less";

type RegisterTabTypes = {
  form: FormInstance<any>;
  onSubmit: (values: any) => void;
}

const RegisterTab = (props: RegisterTabTypes) => {
  const { form, onSubmit } = props;
  return (
    <div className={classes.container}>
      <Form
        form={form}
        onFinish={onSubmit}
        scrollToFirstError
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input your username.', whitespace: true }]}
        >
          <Input placeholder="Your username" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input
            placeholder="Your email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div className={classes.buttons}>
          <Form.Item className={classes.button} >
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              shape="round"
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item className={classes.button}>
            <Button
              type="ghost" danger
              htmlType="reset"
              size="large"
              shape="round"
            >
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

export default RegisterTab;
/**
     username: 'Strapi user',
    email: 'user@strapi.io',
    password: 'strapiPassword',
 */