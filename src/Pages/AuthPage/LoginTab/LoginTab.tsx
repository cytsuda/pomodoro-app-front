import { useEffect } from "react";

// Cookies
import { useCookies } from "react-cookie";

// Ant Design
import { FormInstance, Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, SyncOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./LoginTab.module.less";

type LoginTabTypes = {
  loading: boolean;
  form: FormInstance<any>;
  onSubmit: (values: any) => void;
}


const LoginTab = (props: LoginTabTypes) => {
  const { form, onSubmit, loading } = props;
  const [cookies] = useCookies();
  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      onSubmit(form);
    }
  }

  useEffect(() => {
    if (cookies.login) {
      form.setFieldsValue({
        identifier: cookies.login.identifier,
        remember: true
      });
    }
  }, [cookies.login, form]);

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onSubmit} >
        <Form.Item name="identifier" rules={[{ required: true, message: 'Please input your username.', whitespace: true }]}>
          <Input
            prefix={<UserOutlined className={classes.icon} />}
            placeholder="Username"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className={classes.icon} />}
            onKeyDown={onKeyDown}
            placeholder="Password"
            disabled={loading}
          />
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
          <Button type="primary" htmlType="submit" disabled={loading}>{loading ? <SyncOutlined /> : "Submit"}</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginTab;