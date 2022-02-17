import { useNavigate } from "react-router-dom"

// Ant Design
import { Result, Button } from "antd";

// Classes & Styles
import classes from "./NotFoundPage.module.less";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>Back</Button>
        }
      />
    </div>

  );
}

export default NotFoundPage;