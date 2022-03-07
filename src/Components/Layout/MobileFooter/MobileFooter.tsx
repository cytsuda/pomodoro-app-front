import React from "react";
import clsx from "clsx";

// Router
import { useLocation, NavLink } from "react-router-dom";

// AntDesign
import { Layout, Grid, Menu } from "antd";
import { HomeOutlined, ProjectOutlined, ReadOutlined } from '@ant-design/icons';

// Custom Component

// Class & Styles
import classes from "./MobileFooter.module.less";

// Deconstructors
const { Footer } = Layout;
const { useBreakpoint } = Grid;


const MobileFooter = () => {
  const screens = useBreakpoint();
  const location = useLocation();
  return (
    <Footer className={
      clsx(classes.footer, screens.xs)
    }>
      <Menu
        className={classes.menu}
        theme="light"
        defaultSelectedKeys={[location.pathname]}
        mode="horizontal"
      >
        <Menu.Item key="/task"
          icon={<ProjectOutlined />}
        >
          <NavLink to="/task">
            Task
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/"
          icon={<HomeOutlined />}
        >
          <NavLink to="/">
            Home
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/history"
          icon={<ReadOutlined />}
        >
          <NavLink to="/history">
            History
          </NavLink>
        </Menu.Item>

      </Menu>
    </Footer>
  );
}

export default MobileFooter;