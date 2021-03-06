import { useState } from "react";

// Router
import { Navigate } from "react-router-dom";

// Redux
import { useDispatch } from 'react-redux';
import { startLogin } from "@/Redux/userReducer";

// Cookie
import { useCookies } from 'react-cookie';

// Ant Design
import { Card, Form } from "antd";

// Axios
import request from "axios";
import axios, { path as p } from "@/Utils/apiController";

// Custom component
import LoginTab from "./LoginTab/LoginTab";
import RegisterTab from "./RegisterTab/RegisterTab";
import openNotification from "@/Components/Notification/Notification";

// Classes & Styles
import classes from "./AuthPage.module.less";

const tabList = [
  {
    key: "login",
    tab: "Login"
  }, {
    key: "register",
    tab: "Register"
  }
]

interface ContentType {
  [key: string]: JSX.Element
}

type LoginType = {
  identifier: string;
  password: string;
  remember: boolean;
}

type TabType = {
  tab: string;
  loading: boolean;
}

const LoginPage = () => {
  const [tab, setTab] = useState<TabType>({ tab: "login", loading: false });
  const [cookie, setCookie, removeCookies] = useCookies();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onLoginSubmit = async (value: LoginType) => {
    setTab(prev => ({ ...prev, loading: true }));
    try {
      const res = await axios().post(p.apiLogin, {
        identifier: value.identifier,
        password: value.password
      });
      const { jwt, user } = res.data;
      dispatch(startLogin({
        token: jwt,
        user: user
      }));
      setCookie("token", jwt, { path: "/", secure: true });
      if (value.remember) {
        setCookie("login", { identifier: value.identifier, remember: true }, { path: "/", secure: true });
      } else {
        removeCookies("login", { path: "/", secure: true });
      }
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
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
    }
    setTab(prev => ({ ...prev, loading: false }));
  }

  const onRegisterSubmit = async (value: any) => {
    setTab(prev => ({ ...prev, loading: true }));
    try {
      const res = await axios().post(p.apiRegister, {
        username: value.username,
        email: value.email,
        password: value.password,
      });
      const { jwt, user } = res.data
      dispatch(startLogin({
        token: jwt,
        user: user
      }));
      setCookie("token", jwt, { path: "/", secure: true });
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
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
    }
    setTab(prev => ({ ...prev, loading: false }));
  }

  const content: ContentType = {
    login: <LoginTab form={form} onSubmit={onLoginSubmit} loading={tab.loading} />,
    register: <RegisterTab form={form} onSubmit={onRegisterSubmit} loading={tab.loading} />
  }


  if (cookie.token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={classes.container}>
      <Card className={classes.card}
        tabList={tabList}
        activeTabKey={tab.tab}
        onTabChange={(key: string) => {
          setTab(prev => ({ ...prev, tab: key }))
        }}
      >
        {content[tab.tab]}
      </Card>
    </div >
  );
}

export default LoginPage;
