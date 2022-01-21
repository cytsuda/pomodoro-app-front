// AntDesing
import { Layout } from "antd"
// Classes
import classes from "./Footer.module.less";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className={classes.footer}>
      PomoTrack ©2022 Created by cytsuda
    </Footer>
  );
}

export default FooterComponent;