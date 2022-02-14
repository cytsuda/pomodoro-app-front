import React from "react";

// React-Router
import { Link } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Ant Design components
import { Menu, Avatar, Dropdown, Typography, Layout } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';

// Custom Component
import CompactCountdown from "@/Components/CompactCountdown/CompactCountdown";

// class & Styles
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
      <Link to="/profile">
        Profile
      </Link>
    </Menu.Item>
    <Menu.Item key="2" icon={<DashboardOutlined />}>
      <Link to="/preferences">
        Preferences
      </Link>
    </Menu.Item>
    <Menu.Item key="3" icon={<SettingOutlined />}>
      <Link to="/setting">
        Settings
      </Link>
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

      <CompactCountdown />
    </Header>
  );
}

export default HeaderComponent;
