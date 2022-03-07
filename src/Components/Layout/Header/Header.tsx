import React from "react";


// React-Router
import { Link } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Ant Design components
import { Layout } from "antd";

// Custom Component
import CompactCountdown from "@/Components/CompactCountdown/CompactCountdown";
import AvatarMenu from "@/Components/Layout/AvatarMenu/AvatarMenu";

// class & Styles
import classes from "./Header.module.less";

// Desconstructor
const { Header } = Layout;

type HeaderComponentType = {
  logout: () => void;
}

const HeaderComponent = (props: HeaderComponentType) => {
  const { logout } = props;
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Header className={classes.header}>

      <div className={classes.logo}>
        <Link to="/">
          <img className={classes.logoText}
            src="/logo.png"
            alt="Logo"
          />
        </Link>
      </div>

      <AvatarMenu logout={logout} user={user} />
      <CompactCountdown />
    </Header>
  );
}

export default HeaderComponent;
