import React, { useState } from "react";
import clsx from "clsx";

// Redux & Reducer
import { useSelector } from 'react-redux';

// import { getUser, setPomoConfig } from "@/Redux/userReducer";

// AntDesign
import { Row, Col, Avatar, Typography, Input, InputNumber, Divider } from "antd";
import { UserOutlined, EditOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

// Custom Components
import PomoConfigComponent from "@/Components/PomoConfigComponent/PomoConfigComponent";

// Classes and Styles
import classes from "./Profile.module.less";


// Desconstructor
const { Text, Title } = Typography


type EditingType = "PROFILE" | "POMO" | "PREFERENCE" | "GOAL" | undefined;

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [editing, setEditing] = useState<EditingType>(undefined);

  if (!user) {
    return (
      <div>
        Loading
      </div>
    )
  }
  const daily = 8;
  return (
    <div>
      <Row gutter={[32, 24]}>
        <Col span={6}>
          <div className={classes.img}>
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<UserOutlined />}
            />
          </div>
        </Col>
        <Col span={18}>
          <div className={classes.info}>
            <div className={classes.infoCtrl}>
              <Title level={4}>Profile Info</Title>
              <EditOutlined
                className={clsx(classes.infoCtrlEdit, editing && classes.active)}
                onClick={() => setEditing(prev => prev === "PROFILE" ? undefined : "PROFILE")}
              />
            </div>
            <div className={classes.box}>
              <div className={clsx(classes.control, classes.col)}>
                <Typography className={classes.label}>
                  USERNAME
                </Typography>
                {editing === "PROFILE" ? (
                  <Input className={clsx(classes.input, editing && classes.active)} name="username" value={user.username} />
                ) : (
                  <Text className={classes.field}>{user.username}</Text>
                )}
              </div>
              <div className={clsx(classes.control, classes.col)}>
                <Typography className={classes.label}>
                  EMAIL
                </Typography>
                {editing === "PROFILE" ? (
                  <Input className={clsx(classes.input, editing && classes.active)} name="email" value={user.email} />
                ) : (
                  <Text className={classes.field}>{user.email}</Text>
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <PomoConfigComponent />

        </Col>
        <Col span={8}>
          <div className={classes.info}>
            <div className={classes.infoCtrl}>
              <Title level={4}>Goals</Title>
              <EditOutlined
                className={clsx(classes.infoCtrlEdit, editing && classes.active)}
                onClick={() => setEditing(prev => prev === "POMO" ? undefined : "POMO")}
              />
            </div>
            <div className={classes.box}>
              <div className={clsx(classes.control, classes.row)}>
                <Typography className={classes.label}>
                  DAILY POMOS
                </Typography>
                <div className={classes.number}>
                  {editing === "POMO" ? (
                    <>
                      <MinusCircleOutlined className={clsx(classes.numberIcon, classes.left)} />
                      <InputNumber className={classes.numberInput} min={1} keyboard={true} defaultValue={daily} />
                      <PlusCircleOutlined className={clsx(classes.numberIcon, classes.right)} />
                    </>
                  ) : (
                    <InputNumber className={clsx(classes.numberInput, classes.numberLabel)} disabled defaultValue={daily} />
                  )}
                </div>
              </div>
              <Divider className={classes.dividerNumber} />
              <div className={clsx(classes.control, classes.row)}>
                <Typography className={classes.label}>
                  WEEKLY POMOS
                </Typography>
                <div className={classes.number}>
                  {editing === "POMO" ? (
                    <>
                      <MinusCircleOutlined className={clsx(classes.numberIcon, classes.left)} />
                      <InputNumber className={classes.numberInput} min={1} keyboard={true} defaultValue={daily * 5} />
                      <PlusCircleOutlined className={clsx(classes.numberIcon, classes.right)} />
                    </>
                  ) : (
                    <InputNumber className={clsx(classes.numberInput, classes.numberLabel)} disabled defaultValue={daily * 5} />
                  )}
                </div>
              </div>
              <Divider className={classes.dividerNumber} />
              <div className={clsx(classes.control, classes.row)}>
                <Typography className={classes.label}>
                  MONTHY POMOS
                </Typography>
                <div className={classes.number}>
                  {editing === "POMO" ? (
                    <>
                      <MinusCircleOutlined className={clsx(classes.numberIcon, classes.left)} />
                      <InputNumber className={classes.numberInput} min={1} keyboard={true} defaultValue={daily * 5 * 4} />
                      <PlusCircleOutlined className={clsx(classes.numberIcon, classes.right)} />
                    </>
                  ) : (
                    <InputNumber className={clsx(classes.numberInput, classes.numberLabel)} disabled defaultValue={daily * 5} />
                  )}
                </div>
              </div>

            </div>
          </div>
        </Col>

      </Row>
    </div>
  );
}

export default ProfilePage;