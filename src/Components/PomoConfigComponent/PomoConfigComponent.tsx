import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";

// Redux
import { useSelector } from "react-redux";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController"

// AntDesign
import { Typography, InputNumber, Divider, Button, Form, Skeleton } from "antd";
import {
  EditOutlined
} from '@ant-design/icons';

// Classes & Styles
import classes from "./PomoConfigComponent.module.less"

// Desconstructor
const { Title } = Typography;


const initialVal = {
  id: "0",
  longBreakDuration: "15",
  pomoBeforeLongBreak: 4,
  shortBreakDuration: 5,
  workDuration: 25
}
const PomoConfigComponent = () => {
  const { pomoConfig, token } = useSelector((state: RootState) => state.user);
  const [edit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  // setFields


  const handleSave = useCallback(async (e) => {
    console.log("HandleSave")
    setEdit(false);
    // TODO - add feedback when something is success / fail on change
    try {
      const res = await axios(token).put(p.apiUserConfig + q.queryID(e.id), {
        data: {
          pomoConfig: {
            workDuration: e.workDuration,
            shortBreakDuration: e.shortBreakDuration,
            longBreakDuration: e.longBreakDuration,
            pomoBeforeLongBreak: e.pomoBeforeLongBreak,
          }
        }
      });
      console.log(res)
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        console.log(error)
      }
    }

    // pomoConfig.id
  }, [token]);

  useEffect(() => {
    if (pomoConfig.id !== 0 && token) {
      form.setFieldsValue(pomoConfig);
    }
  }, [form, pomoConfig, token]);

  if (pomoConfig.id === 0) {
    return <div>LOADING...</div>
  }
  return (
    <Form
      className={classes.info}
      name="pomo_config_form"
      initialValues={initialVal}
      form={form}
      onFinish={handleSave}
    >
      <div className={classes.infoCtrl}>
        <Title level={4}>Pomo</Title>
        <div className={classes.infoCtrlBtn}>
          <Button
            className={clsx(classes.infoCtrlBtnInner, edit && classes.active)}
            type="primary" shape="round" htmlType="submit"
          >
            Save
          </Button>
        </div>
        <EditOutlined
          onClick={() => setEdit(prev => !prev)}
          className={clsx(classes.infoCtrlEdit, edit && classes.active)}
        />
      </div>

      <div className={classes.box}>
        <Form.Item name="id" className={classes.hidden}>
          <InputNumber
            min={0}
            className={clsx(classes.numberInput, !edit && classes.numberLabel)}
            disabled
          />
        </Form.Item>

        <div className={clsx(classes.control, classes.row)}>
          <Typography className={classes.label}>
            FOCUS DURATION
          </Typography>

          {pomoConfig.id !== 0 ? (
            <Form.Item name="workDuration" className={classes.number}>
              <InputNumber
                min={0}
                className={clsx(classes.numberInput, !edit && classes.numberLabel)}
                disabled={!edit}
              />
            </Form.Item>
          ) : (
            <Skeleton.Input style={{ width: 50 }} active={true} size="small" />
          )}
        </div>
        <Divider className={classes.divider} />

        <div className={clsx(classes.control, classes.row)}>
          <Typography className={classes.label}>
            SHORT BREAK DURATION
          </Typography>
          {pomoConfig.id !== 0 ? (
            <Form.Item name="shortBreakDuration" className={classes.number}>
              <InputNumber
                min={0}
                className={clsx(classes.numberInput, !edit && classes.numberLabel)}
                disabled={!edit}
              />
            </Form.Item>
          ) : (
            <Skeleton.Input style={{ width: 50 }} active={true} size="small" />
          )}
        </div>
        <Divider className={classes.divider} />

        <div className={clsx(classes.control, classes.row)}>
          <Typography className={classes.label}>
            LONG BREAK DURATION
          </Typography>
          {pomoConfig.id !== 0 ? (
            <Form.Item name="longBreakDuration" className={classes.number}>
              <InputNumber
                min={0}
                className={clsx(classes.numberInput, !edit && classes.numberLabel)}
                disabled={!edit}
              />
            </Form.Item>
          ) : (
            <Skeleton.Input style={{ width: 50 }} active={true} size="small" />
          )}
        </div>
        <Divider className={classes.divider} />

        <div className={clsx(classes.control, classes.row)}>
          <Typography className={classes.label}>
            TAKE A LONG BREAK AT
          </Typography>
          {pomoConfig.id !== 0 ? (
            <Form.Item name="pomoBeforeLongBreak" className={classes.number} >
              <InputNumber
                min={0}
                className={clsx(classes.numberInput, !edit && classes.numberLabel)}
                disabled={!edit}
              />
            </Form.Item>
          ) : (
            <Skeleton.Input style={{ width: 50 }} active={true} size="small" />
          )}
        </div>


      </div>
    </Form >
  );
}

export default PomoConfigComponent;