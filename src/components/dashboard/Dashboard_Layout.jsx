import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Affix } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import DashBoard_Header from "./DashBoard_Header";
import Dashboard_Footer from "./Dashboard_Footer";
import DashboardMenu from "./DashboardMenu";
import { authActions } from "../../redux/Authentication/AuthSlice";

const Dashboard_Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menubar_Status, setMenubar_Status] = useState(false);

  const get_menu_status = (value) => {
    setMenubar_Status(!menubar_Status);
    dispatch(authActions.setmenubar(value));
  };
  const onClose = () => {};

  return (
    <>
      <DashBoard_Header
        menubar_Status={menubar_Status}
        get_menu_status={get_menu_status}
      />
      <div className="registation_container">
        <div
          className={
            menubar_Status === true
              ? "registation_menu_bar_close"
              : "registation_menu_bar"
          }
        >
          <div
            style={{
              width: "100%",
            }}
          >
            {/* <Affix offsetTop={7}> </Affix> */}
            {/* <div className="toglebar">
              {menubar_Status === true ? (
                <>
                  <IoIosArrowDropright
                    className="icon_tobler currsor_po"
                    onClick={() => setMenubar_Status(!menubar_Status)}
                  />
                </>
              ) : (
                <>
                  <IoIosArrowDropleft
                    className="icon_tobler currsor_po"
                    onClick={() => setMenubar_Status(!menubar_Status)}
                  />
                </>
              )}
            </div> */}
            <DashboardMenu menubar_Status={menubar_Status} onClose={onClose} />
          </div>
        </div>

        <div
          className={
            menubar_Status === true
              ? "registation_component_space_close"
              : "registation_component_space"
          }
        >
          <Outlet />
        </div>
      </div>
      <Dashboard_Footer />
    </>
  );
};

export default Dashboard_Layout;
