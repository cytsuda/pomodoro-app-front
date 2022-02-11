import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setPomoConfig } from "@/Redux/userReducer";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController"

// AntDesign
import { Typography, InputNumber, Divider, Button, Form, Skeleton, notification } from "antd";
import {
  EditOutlined
} from '@ant-design/icons';

// Classes & Styles
import classes from "./PomoConfigComponent.module.less"

// Desconstructor
const { Title } = Typography;

type MsgProps = {
  message: string;
  description: string;
  type: "success" | "info" | "warning" | "error";
}
type Props = {
  onClose?: () => void;
}
const PomoConfigComponent = ({ onClose }: Props) => {
  const { userConfig, token } = useSelector((state: RootState) => state.user);
  const [edit, setEdit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { pomoConfig } = userConfig;
  const [form] = Form.useForm();

  // ------------------------------------------

  const openNotification = ({ message, description, type }: MsgProps) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  }

  // ------------------------------------------


  const handleSave = useCallback(async (e) => {
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
      if (res) {
        openNotification({
          type: 'success',
          message: "PomoConfig saved successfully.",
          description: ""
        });
      }
      const { data: result } = await axios(token).get(p.apiUserConfig);
      if (result.data) {
        const { id, attributes } = result.data;
        const controlValues = {
          id: id,
          pomoConfig: attributes.pomoConfig,
          goalsConfig: attributes.goalsConfig,
        }
        dispatch(setPomoConfig(controlValues));
        if (onClose) {
          onClose();
        }
      }
      /**
        state.userConfig.pomoConfig = action.payload.pomoConfig;
        state.userConfig.goalsConfig = action.payload.goalsConfig;
        state.userConfig.id = action.payload.id;
       */
      setEdit(false);
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: ${error.message}`
        });
      } else {
        openNotification({
          type: 'error',
          message: "An error has occurred",
          description: `Error: unknown error.`
        });
      }
    }

    // pomoConfig.id
  }, [dispatch, onClose, token]);

  useEffect(() => {
    if (pomoConfig.id !== "0" && token) {
      form.setFieldsValue({ ...pomoConfig, id: userConfig.id });
    }
  }, [form, pomoConfig, token, userConfig.id]);

  if (pomoConfig.id === "0") {
    return <div>LOADING...</div>
  }
  return (
    <Form
      className={classes.info}
      name="pomo_config_form"
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