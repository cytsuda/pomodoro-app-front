import React, { ReactElement } from "react";

// AntD
import { Button, Tooltip } from "antd";
import { WarningOutlined } from '@ant-design/icons';

// Classes
import classes from "./IconButton.module.less";

const IconButton = (props: IconButtonTypes) => {
  const { tooltip, type, size, icon, onClick, className } = props;
  return (
    <Tooltip className={className} title={tooltip}>
      <Button type={type} shape="circle" ghost size={size} onClick={onClick}>
        {icon}
      </Button>
    </Tooltip>
  );
}

export default IconButton;

interface IconButtonTypes {
  tooltip: string;
  type?: "dashed" | "default" | "text" | "ghost" | "link" | "primary"
  size: "small" | "middle" | "large",
  icon: ReactElement,
  className: string,
  onClick?: (event: React.MouseEvent) => void,
}

IconButton.defaultProps = {
  size: "middle",
  tooltip: "No tooltip",
  icon: <WarningOutlined />
}