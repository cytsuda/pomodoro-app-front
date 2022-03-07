import React from "react";

// Redux
import { Link } from "react-router-dom"

// AntDesign
import { Menu, Dropdown, Avatar, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./AvatarMenu.module.less";

// Desconstructor
const { Text } = Typography;

type Props = {
  logout: () => void;
  user: UserType;
  mobile?: boolean
}
export default function AvatarMenu({
  logout, user, mobile = false
}: Props) {
  return (
    <div className={classes.control}>
      <Dropdown overlay={<Menu theme="light" mode="vertical" style={{
        lineHeight: "inherit"
      }}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/profile">
            Profile
          </Link>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Menu.Item>
      </Menu>
      } placement="bottomRight">
        <div className={classes.controlAvatar}>
          <Avatar icon={<UserOutlined />} size="small" />
          {!mobile && (
            <Text>{user ? user.username : "Loading"}</Text>
          )}
        </div>
      </Dropdown>
    </div>
  );
}

