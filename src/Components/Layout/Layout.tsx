import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import classes from "./Layout.module.less";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const LayoutPage = () => {
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <Layout className={classes.main}>
      <Sider
        collapsed={collapse}
        collapsible
        onCollapse={() => setCollapse(prev => !prev)}
      >
        <div className={classes.logo} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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
        <Header style={{ padding: 0 }} />
        <Content className={classes.content}>
          <Outlet />
        </Content>
        <Footer className={classes.footer}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default LayoutPage;