import React, { useEffect, useState } from "react";
import qs from "qs";

// AntDesign components & Icons
import { Typography, Row, Col, } from "antd";
// Axios
import axios from "@/Utils/apiController";

// CustomComponent
import ProjectCardComponent from "@/Components/ProjectCardComponent/ProjectCardComponent";

const { Title } = Typography;

const query = qs.stringify({
  populate: '*',
}, {
  encodeValuesOnly: true,
});

const ProjectPage = () => {
  const [data, setData] = useState<any>();
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios().get(`api/projects?${query}`,);
      setData(data.data);
    }
    getData();
  }, []);

  return (
    <>
      <Title level={2}>
        Projects page
      </Title>

      <Row gutter={[16, 16]} >
        {data && data.map((item: any) => {
          const { attributes, id } = item;
          console.log("projects")
          console.log(item.attributes)
          return (
            <Col span={6} key={id}  >
              <ProjectCardComponent attributes={attributes} id={id} />
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export default ProjectPage;