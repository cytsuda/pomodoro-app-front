import React from "react";

// antdesign components
import { Menu, Avatar, Dropdown, Typography, Layout } from "antd";
import { UserOutlined } from '@ant-design/icons';

// class
import classes from "./Header.module.less";

// Desconstructor
const { Text } = Typography;
const { Header } = Layout;

type HeaderComponentType = {
  logout: () => void;
}

const HeaderComponent = (props: HeaderComponentType) => {
  const { logout } = props;
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
    <Menu.Item onClick={logout}>
      Logout
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