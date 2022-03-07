import React from "react";
import clsx from "clsx";

// Redux
import { useSelector } from "react-redux";

// AntDesign
import { Layout, Grid } from "antd";

// Custom Component
import CompactCountdown from "@/Components/CompactCountdown/CompactCountdown";
import AvatarMenu from "@/Components/Layout/AvatarMenu/AvatarMenu";
// Class & Styles
import classes from "./MobileHeader.module.less";

// Deconstructors
const { Header } = Layout;
const { useBreakpoint } = Grid;

type Props = {
  logout: () => void;
}

const MobileHeader = ({ logout }: Props) => {
  const screens = useBreakpoint();
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Header className={
      clsx(classes.header, screens.xs && classes.small)
    }>
      <img className={classes.logo} src="./mini-logo.svg" alt="mini-logo" />
      <div>
        <CompactCountdown mobile />
      </div>
      <AvatarMenu user={user} logout={logout} mobile />
    </Header>
  );
}

export default MobileHeader;