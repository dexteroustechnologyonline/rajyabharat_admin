import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CustomBreadcrumb = ({ name }) => {
  const navigate = useNavigate();
  return (
    <Breadcrumb className="breadcrum_main">
      <Breadcrumb.Item
        className="currsor_po"
        onClick={() => navigate("/dashboard")}
      >
        <HomeOutlined className="crumbIcons" />
        <span className="crumb">Dashboard</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span className="crumb">{name}</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
