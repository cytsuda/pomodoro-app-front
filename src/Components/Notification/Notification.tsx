import { notification } from "antd";

const openNotification = ({ message, description, type }: MsgProps) => {
  notification[type]({
    message: message,
    description: description,
    placement: "topLeft",
  });
}

export default openNotification;