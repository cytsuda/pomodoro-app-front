import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import classes from "./Home.module.less";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


class HomePage extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <>
        <h1>Home page</h1>
        <p>yeap</p>
      </>
    );
  }
}

export default HomePage;