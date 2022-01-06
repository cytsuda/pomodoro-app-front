import React from "react";
import moment from "moment";
import clsx from "clsx";

// AntD
import { Card, Statistic, Typography, Tag } from "antd";
import {
  EditOutlined,
  ExportOutlined,
  WarningOutlined, CheckCircleOutlined
} from '@ant-design/icons';

import classes from "./ProjectCardComponent.module.less";

const { Title } = Typography

const ProjectCardComponent = (props: PropsType) => {
  const {
    attributes: project,
    id
  } = props;
  console.log(project.users);
  return (
    <Card title={<Title level={3}>{project.Title}</Title>} actions={[
      <ExportOutlined />,
      <EditOutlined onClick={() => console.log("Edit: " + id)} />,
    ]}>

      <Card.Grid className={clsx(classes.grid, classes.gridHalf)} >
        <Statistic title="Open tasks" value={project.tasks.data.filter((item: any) => {
          return item.attributes.Finished === false
        }).length} prefix={<WarningOutlined />} />
      </Card.Grid>
      <Card.Grid className={clsx(classes.grid, classes.gridHalf)}  >
        <Statistic title="Finish tasks" value={project.tasks.data.filter((item: any) => {
          return item.attributes.Finished === true
        }).length} prefix={<CheckCircleOutlined />} />
      </Card.Grid>

      <Card.Grid className={clsx(classes.grid, classes.gridTags)} hoverable={false} >
        <p className={classes.gridTitle}>Users</p>
        {project.users.data.length > 0 ? project.users.data.map((item: any) => (
          <Tag key={item.id} color="magenta">{item.attributes.username}</Tag>
        )) : (
          <Tag color="red">No user set</Tag>
        )}
      </Card.Grid>
    </Card>
  );
}

export default ProjectCardComponent;

type PropsType = {
  id: string,
  attributes: {
    Title: string,
    Description: string,
    createdAt: Date,
    publishedAt: Date,
    updatedAt: Date,
    tasks: {
      data: [{
        id: string,
        attributes: {
          Finished: boolean,
        }
      }]
    },
    users: {
      data: [{
        id: string,
        attributes: {
          blocked: boolean,
          confirmed: boolean,
          createdAt: Date,
          email: string,
          provider: string,
          updatedAt: Date,
          username: string,
        }
      }]
    }
  }
}