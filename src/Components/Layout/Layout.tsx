import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";

// Axios
import request from "axios";
import axios, { path as p } from "@/Utils/apiController";

// React router
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
// Ant Desing
import { Layout, Menu, Grid } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  ReadOutlined
  // ClockCircleOutlined,
} from '@ant-design/icons';

// Reducer
import { useDispatch } from 'react-redux';
import { getUser, setPomoConfig } from "@/Redux/userReducer";

// Cookie
import { useCookies } from 'react-cookie';


// Custom Components
import HeaderComponent from "@/Components/Layout/Header/Header";
import MobileHeader from "@/Components/Layout/MobileHeader/MobileHeader"
import FooterComponent from "@/Components/Layout/Footer/Footer";
import MobileFooter from "@/Components/Layout/MobileFooter/MobileFooter";
import openNotification from "@/Components/Notification/Notification";

// Utils

// Classes & Styles
import classes from "./Layout.module.less";

// Desconstructor
const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const LayoutPage = () => {
  const [cookie, , removeCookie] = useCookies();
  const location = useLocation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();

  console.log(screens);

  const [collapse, setCollapse] = useState<boolean>(false);


  const loadUserHandler = useCallback(async (token: string) => {
    // TODO - create a first step configuration data
    const response = await axios(token).get(p.apiMe);
    dispatch(getUser({
      token: token,
      user: response.data
    }));
    try {
      // res: {id, attributes}
      const { data: res } = await axios(token).get(p.apiUserConfig);
      const { attributes, id } = res.data[0];

      if (attributes) {
        dispatch(setPomoConfig({
          id: id,
          pomoConfig: attributes.pomoConfig,
          goalsConfig: attributes.goalsConfig,
          preferenceConfig: attributes.preferenceConfig,
        }));
      }
      if (!res.data) {
        openNotification({
          type: 'error',
          message: "Problem with pomo config",
          description: ``
        });
      }
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
    }
  }, [dispatch]);

  useEffect(() => {
    if (cookie.token) {
      loadUserHandler(cookie.token);
    }
  }, [cookie.token, loadUserHandler]);


  if (!cookie.token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return (
    <Layout className={classes.main}>
      {screens.xl ? (
        <HeaderComponent logout={() => removeCookie("token", { path: "/" })} />
      ) : (
        <MobileHeader logout={() => removeCookie("token", { path: "/" })} />
      )}
      <Layout >
        {screens.xl && (
          <Sider
            collapsed={collapse}
            collapsible
            onCollapse={() => setCollapse(prev => !prev)}
            breakpoint="lg"
          >
            <Menu
              className={classes.menu}
              theme="light"
              defaultSelectedKeys={[location.pathname]}
              mode="inline"
            >
              <Menu.Item key="/"
                icon={<HomeOutlined />}
              >
                <NavLink to="/">
                  Home
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/task"
                icon={<ProjectOutlined />}
              >
                <NavLink to="/task">
                  Task
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/history"
                icon={<ReadOutlined />}
              >
                <NavLink to="/history">
                  History
                </NavLink>
              </Menu.Item>
              {process.env.NODE_ENV === "development" && (
                <>
                  <Menu.Divider style={{ marginTop: "auto" }} />
                  <Menu.Item key="4" icon={<ProjectOutlined />} >
                    <a href="https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html">
                      Strapi Docs
                    </a>
                  </Menu.Item>
                  <Menu.Item key="6" icon={<ProjectOutlined />} >
                    <a href="https://ant.design/components/overview/?theme=dark">
                      Ant Design docs
                    </a>
                  </Menu.Item>
                  <Menu.Item key="7" icon={<ProjectOutlined />} >
                    <a href="https://www.npmjs.com/package/react-cookie">
                      React cookie
                    </a>
                  </Menu.Item>
                  <Menu.Item key="8" icon={<ProjectOutlined />} >
                    <a href="https://redux-toolkit.js.org/tutorials/overview">
                      Redux Toolkit
                    </a>
                  </Menu.Item>
                  <Menu.Item key="9" icon={<ProjectOutlined />} >
                    <a href="https://reactrouter.com/">
                      React router
                    </a>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </Sider>
        )}
        <Layout >
          <Content
            className={
              clsx(
                classes.content,
                screens.xl ? classes.desk : classes.mob,
              )}
          >
            <Outlet />
          </Content>
          {screens.xl ? (
            <FooterComponent />
          ) : (

            <MobileFooter />
          )}
        </Layout>
      </Layout>
    </Layout >
  );
}

export default LayoutPage;