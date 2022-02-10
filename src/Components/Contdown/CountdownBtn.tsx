import React from "react";
import clsx from "clsx";

// AntDesign
import { Button } from "antd";

// Classes & Styles
import classes from "./Countdown.module.less";
type Props = {
  status: CountdownStatusType;
  className: string;
  disabled: boolean;
  onStart: () => void;
  onFinish: () => void;
  onStop: () => void;
}

const CountdownBtn = ({ status, className, disabled, onStart, onFinish, onStop }: Props) => {
  let text = "error";
  let classname = "";
  let fn = () => { };
  switch (status) {
    case "waiting":
      text = "Start";
      classname = classes.btnStart;
      fn = () => onStart()
      break;
    case "finish":
      text = "Finish"
      classname = classes.btnFinish;
      fn = () => onFinish();
      break;
    case "running":
      text = "Stop"
      classname = classes.btnStop;
      fn = () => onStop();
      break;
    default:
      classname = classes.btnError;
      fn = () => { console.log("Yes") }
      break;
  }

  return (
    <Button
      className={clsx(classes.timerBtn, classname, className)}
      shape="round" size="large"
      danger={status === "running"}
      type={status !== "running" ? "primary" : "ghost"}
      disabled={disabled}
      onClick={fn}
    >
      {text}
    </Button>
  );
}

export default CountdownBtn;