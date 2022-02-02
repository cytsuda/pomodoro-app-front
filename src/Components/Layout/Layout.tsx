import { useEffect, useState, useCallback } from "react";
import axios, { path as p } from "@/Utils/apiController";
// Ant Desing
import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

// Reducer
import { useDispatch } from 'react-redux';
import { getUser, setPomoConfig } from "@/Redux/userReducer";

// Cookie
import { useCookies } from 'react-cookie';


// Custom Components
import HeaderComponent from "@/Components/Layout/Header/Header";
import FooterComponent from "@/Components/Layout/Footer/Footer";

// Classes & Styles
import classes from "./Layout.module.less";

// Desconstructor
const { Content, Sider } = Layout;

const LayoutPage = () => {
  const [cookie, , removeCookie] = useCookies();
  const location = useLocation();
  const dispatch = useDispatch();

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
      const { attributes } = res.data;
      if (attributes) {
        dispatch(setPomoConfig(attributes.pomoConfig));
      }
    } catch (error) {
      console.log("LoadUSerHandler - error");
      console.log(error)
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
      <HeaderComponent logout={() => removeCookie("token", { path: "/" })} />
      <Layout >
        <Sider
          collapsed={collapse}
          collapsible
          onCollapse={() => setCollapse(prev => !prev)}
        >
          <Menu className={classes.menu} theme="light" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />} >
              <Link to="/">
                Home
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<ClockCircleOutlined />} >
              <Link to="/clock">
                Clock
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ProjectOutlined />} >
              <Link to="/projects">
                Projects
              </Link>
            </Menu.Item>
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
          </Menu>
        </Sider>
        <Layout >
          <Content className={classes.content}>
            <Outlet />
          </Content>
          <FooterComponent />
        </Layout>
      </Layout>
    </Layout >
  );
}

export default LayoutPage;