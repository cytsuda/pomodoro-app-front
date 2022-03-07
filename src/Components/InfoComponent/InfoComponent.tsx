import React from "react";

// Ant Design
import { Card, Progress, Typography, Tooltip, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';

// Classes & Styles
import classes from "./InfoComponent.module.less";

// Desconstructor
const { Title, Text } = Typography;

// Type
type ObjProps = {
  done: number;
  goal: number;
}
type Props = {
  day: ObjProps;
  week: ObjProps;
  month: ObjProps;
}

interface CardInfoType extends ObjProps {
  title: string;
  text: string;
}

const CardInfo = ({ done, goal, title, text }: CardInfoType) => {
  return (
    <Card>
      <div className={classes.card}>
        <div className={classes.cardInfo}>
          <Title level={4}>{title}</Title>
          <Text className={classes.cardInfoText} type="secondary">{text}</Text>
          <div className={classes.cardInfoValues}>
            <Text type="success">{done} &nbsp;</Text>
            <Text type="secondary">of {goal}</Text>
          </div>
        </div>
        <Progress
          type="dashboard"
          percent={done / goal * 100}
          format={(percent) => `${percent?.toFixed(1)}%`}
        />
      </div>
    </Card>
  );
};


const InfoComponent = ({ day, week, month }: Props) => {

  return (
    <div>
      <Title level={4}>Goals progress
        <Tooltip title="This is the progress of this month, week and day.">
          <Text className={classes.icon} type="secondary">
            <InfoCircleOutlined />
          </Text>
        </Tooltip>
      </Title>
      <Row gutter={[16, 16]} >
        <Col xs={24} sm={12} lg={8}>
          <CardInfo
            title="Today"
            text="Total pomos done today"
            done={day.done}
            goal={day.goal}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <CardInfo
            title="Week"
            text="Total pomos this week"
            done={week.done}
            goal={week.goal}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <CardInfo
            title="Month"
            text="Total pomos done month"
            done={month.done}
            goal={month.goal}
          />
        </Col>
      </Row>
    </div>
  );

}

export default InfoComponent;