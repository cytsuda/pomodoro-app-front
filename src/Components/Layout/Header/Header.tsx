import React from "react";

// antdesign components
import { Row, Menu, Avatar, Col, Dropdown, Typography, Divider, Layout } from "antd";
import { UserOutlined } from '@ant-design/icons';

// class
import classes from "./Header.module.less";

const { Text } = Typography;

const { Header } = Layout;

const HeaderComponent = () => {

  const AvatarMenu = <Menu
    theme="light"
    mode="horizontal"
    style={{ lineHeight: "inherit" }}

  >
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>

  return (
    <Header className={classes.header}>
      <div className={classes.logo}>
        <Text className={classes.logoText}>
          MyAPP
        </Text>
      </div>
      <div className={classes.control}>
        <Dropdown overlay={AvatarMenu} placement="bottomRight">
          <Avatar icon={<UserOutlined />} size="small" />
        </Dropdown>
      </div>
    </Header>
  );
}

export default HeaderComponent;
/*
      <Header className={classes.top}>
        <div className="logo" />
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
*/