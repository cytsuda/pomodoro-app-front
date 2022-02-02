import React from "react";
import clsx from "clsx";

// AntDesign
import { Button } from "antd";

// Classes & Styles
import classes from "./Countdown.module.less";
type Props = {
  status: CountdownStatusType;
  onStart: () => void;
  onFinish: () => void;
}

const CountdownBtn = ({ status, onStart, onFinish }: Props) => {
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
      fn = () => { console.log("STOP") }
      break;
    default:
      classname = classes.btnError;
      fn = () => { console.log("Yes") }
      break;
  }

  return (
    <Button
      className={clsx(classes.timerBtn, classname)}
      shape="round" size="large"
      danger={status === "running"}
      type={status !== "running" ? "primary" : "ghost"}
      onClick={fn}
    >
      {text}
    </Button>
  );
}

export default CountdownBtn;