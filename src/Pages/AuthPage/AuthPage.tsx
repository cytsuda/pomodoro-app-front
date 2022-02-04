import React, { useState } from "react";

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
import RegisterTab from "./RegisterTab/RegisterTab"

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

const LoginPage = () => {
  const [tab, setTab] = useState("login");
  const [cookie, setCookie] = useCookies();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onLoginSubmit = async (value: LoginType) => {
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
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { error } = err.response.data;
        console.log(error)
      }
    }
  }

  const onRegisterSubmit = async (value: any) => {
    console.log("Register submit");
    console.log(value);
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
        const { error } = err.response.data;
        console.log(error)
      }
    }
  }

  const content: ContentType = {
    login: <LoginTab form={form} onSubmit={onLoginSubmit} />,
    register: <RegisterTab form={form} onSubmit={onRegisterSubmit} />
  }

  if (cookie.token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={classes.container}>
      <Card className={classes.card} title="this is the login page"
        tabList={tabList}
        activeTabKey={tab}
        onTabChange={key => {
          setTab(key);
        }}
      >
        {content[tab]}
      </Card>
    </div>
  );
}

export default LoginPage;
/*
    identifier: 'user@strapi.io',
    password: 'strapiPassword',
*/