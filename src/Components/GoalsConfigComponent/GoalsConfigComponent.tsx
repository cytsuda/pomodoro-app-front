import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import produce from "immer";

// Redux
import { useSelector } from "react-redux";

// Axios
import request from "axios";
import axios, { path as p, query as q } from "@/Utils/apiController"

// AntDesign
import { Typography, InputNumber, Divider, Button, Form, Skeleton, notification } from "antd";
import { EditOutlined, SyncOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./GoalsConfigComponent.module.less"

// Desconstructor
const { Title } = Typography;

type MsgProps = {
  message: string;
  description: string;
  type: "success" | "info" | "warning" | "error";
}

const GoalsConfigComponent = () => {
  const { userConfig, token } = useSelector((state: RootState) => state.user);
  const [edit, setEdit] = useState<boolean>(false);
  const { goalsConfig } = userConfig;
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
    // TODO - add feedback when something is success / fail on change
    try {
      const res = await axios(token).put(p.apiUserConfig + q.queryID(e.id), {
        data: {
          goalsConfig: {
            daily: e.daily,
            weekly: e.weekly,
            monthly: e.monthly,
          },
        }
      });
      if (res) {
        openNotification({
          message: "Goals is successfully updated ",
          description: "",
          type: "success"
        });
      }
      setEdit(false);
    } catch (err) {
      if (request.isAxiosError(err) && err.response) {
        const { data } = err.response;
        const { error } = data;
        openNotification({
          message: "An error has occurred.",
          description: `Error: ${error.message}`,
          type: "error"
        });
      }
    }

  }, [token]);

  const onRefresh = (value: "weekly" | "monthly") => {
    const daily = form.getFieldValue("daily");
    const weekly = form.getFieldValue("weekly");
    const monthly = form.getFieldValue("monthly");
    const old = {
      daily,
      weekly,
      monthly,
    }
    const newValues = produce(old, (draft: GoalsConfigType) => {
      draft.daily = daily;
      if (value === "weekly") {
        draft.weekly = 5 * daily;
      }
      if (value === "monthly") {
        draft.monthly = 5 * 4 * daily;
      }
    });
    form.setFieldsValue(newValues);
  }
  useEffect(() => {
    if (userConfig.id !== "0" && token) {
      form.setFieldsValue({ ...goalsConfig, id: userConfig.id });
    }
  }, [form, userConfig, token, goalsConfig]);

  if (userConfig.id === "0") {
    return <div>LOADING...</div>
  }
  return (
    <Form
      className={classes.info}
      name="goals_config_form"
      form={form}
      onFinish={handleSave}
    >
      <div className={classes.infoCtrl}>
        <Title level={4}>Goal</Title>
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
            DAILY GOALS
          </Typography>
          {userConfig.id !== 0 ? (
            <Form.Item name="daily" className={classes.number}>
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
            WEEKLY GOALS
          </Typography>
          <SyncOutlined className={classes.labelIcon} onClick={() => onRefresh("weekly")} />
          {userConfig.id !== 0 ? (
            <Form.Item name="weekly" className={classes.number}>
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
            MONTHLY GOALS
          </Typography>
          <SyncOutlined className={classes.labelIcon} onClick={() => onRefresh("monthly")} />
          {userConfig.id !== 0 ? (
            <Form.Item name="monthly" className={classes.number}>
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

export default GoalsConfigComponent;