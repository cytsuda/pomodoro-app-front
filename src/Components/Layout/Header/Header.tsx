import React from "react";

// Redux
import { useSelector } from "react-redux";

// Ant Design components
import { Menu, Avatar, Dropdown, Typography, Layout } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';

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
  const user = useSelector((state: RootState) => state.user.user);

  const AvatarMenu = <Menu
    theme="light"
    mode="vertical"
    style={{ lineHeight: "inherit" }}

  >
    <Menu.Item key="1" icon={<UserOutlined />}>
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        Profile
      </a>
    </Menu.Item>
    <Menu.Item key="2" icon={<DashboardOutlined />}>
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        Preferences
      </a>
    </Menu.Item>
    <Menu.Item key="3" icon={<SettingOutlined />}>
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        Settings
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
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
          <div className={classes.controlAvatar}>
            <Avatar icon={<UserOutlined />} size="small" />
            <Text>{user ? user.username : "Loading"}</Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}

export default HeaderComponent;
