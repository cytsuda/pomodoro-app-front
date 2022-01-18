import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

// Custom Components
import HeaderComponent from "@/Components/Layout/Header/Header";
import FooterComponent from "@/Components/Layout/Footer/Footer";

import classes from "./Layout.module.less";

// Desconstructor
const { Content, Sider } = Layout;

const LayoutPage = () => {
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <Layout className={classes.main}>
      <HeaderComponent />
      <Layout >
        <Sider
          className={classes.sider}
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