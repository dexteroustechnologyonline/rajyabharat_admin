import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaAngleDoubleRight } from "react-icons/fa";
import { Skeleton } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const data = [
    { value: 5, label: "A" },
    { value: 10, label: "B" },
    { value: 15, label: "C" },
    { value: 20, label: "D" },
  ];

  const size = {
    width: 300,
    height: 250,
  };
  return (
    <>
      <div className="main_fragnent_container">
        <div className="dashboard_box">
          <div className="pai_box">
            <BarChart
              series={[
                { data: [3, 4], stack: "A", label: "Series A1" },
                { data: [4, 3], stack: "A", label: "Series A2" },
              ]}
              width={300}
              height={300}
            />
          </div>
          <div className="pai_box">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "series A" },
                    { id: 1, value: 15, label: "series B" },
                    { id: 2, value: 20, label: "series C" },
                  ],
                },
              ]}
              width={300}
              height={200}
            />
          </div>
          <div className="pai_box">
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.label} (${item.value})`,
                  arcLabelMinAngle: 45,
                  data,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              {...size}
            />
          </div>
          <div className="pai_box">
            <BarChart
              xAxis={[
                { scaleType: "band", data: ["group A", "group B", "group C"] },
              ]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              width={300}
              height={200}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
