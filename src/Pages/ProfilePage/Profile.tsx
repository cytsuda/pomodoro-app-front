import React, { useState } from "react";
import clsx from "clsx";

// Redux & Reducer
import { useSelector } from 'react-redux';

// import { getUser, setPomoConfig } from "@/Redux/userReducer";

// AntDesign
import { Row, Col, Typography, Input } from "antd";
import { EditOutlined } from '@ant-design/icons';

// Custom Components
import PomoConfigComponent from "@/Components/PomoConfigComponent/PomoConfigComponent";
import GoalsConfigComponent from "@/Components/GoalsConfigComponent/GoalsConfigComponent";
import PreferenceConfigComponent from "@/Components/PreferenceConfigComponent/PreferenceConfigComponent";

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
  return (
    <div>
      <Row gutter={[32, 32]}>

        <Col xs={{ span: 24 }}>
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
        <Col xs={{ span: 24 }} md={{ span: 12 }} xxl={{ span: 8 }}>
          <PomoConfigComponent />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} xxl={{ span: 8 }}>
          <GoalsConfigComponent />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} xxl={{ span: 8 }}>
          <PreferenceConfigComponent />
        </Col>

      </Row>
    </div>
  );
}

export default ProfilePage;