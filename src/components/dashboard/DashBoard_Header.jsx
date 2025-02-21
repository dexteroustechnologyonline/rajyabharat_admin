import React, { useEffect, useState } from "react";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { LuTimer } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, Popconfirm, Drawer, Radio, Space } from "antd";
import moment from "moment/moment";
import { authActions } from "../../redux/Authentication/AuthSlice";
import DashboardMenu from "./DashboardMenu";

const DashBoard_Header = ({ menubar_Status, get_menu_status }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginData, isAuth } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [popopen, setpopOpen] = useState(false);
  useEffect(() => {
    if (isAuth === false) {
      navigate("/login");
    }
  }, [isAuth]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setTimeout(() => {
      setpopOpen(false);
    }, 2000);
  };
  const handleCancel = () => {
    setpopOpen(false);
  };

  return (
    <>
      <div className="dashboard_header_container">
        <div
          // className={
          //   menubar_Status === true ? "closeheader_dash" : "openheader_dash"
          // }
          className="openheader_dash"
        >
          {/* <img src="/assets/img/logo/f1visalogo8.svg" alt="" /> */}
        </div>
        <div
          // className={
          //   menubar_Status === true
          //     ? "close_body_header_dash"
          //     : "open_body_header_dash"
          // }
          className="open_body_header_dash"
        >
          <div className="body_heare_left">
            <span>
              {menubar_Status === true ? (
                <>
                  <IoIosArrowDropright
                    className="icon_tobler currsor_po"
                    onClick={() => get_menu_status(true)}
                  />
                </>
              ) : (
                <>
                  <IoIosArrowDropleft
                    className="icon_tobler currsor_po"
                    onClick={() => get_menu_status(false)}
                  />
                </>
              )}
            </span>
            {/* <span className="icon_tobler_name ">
              <img src="/assets/img/logo/f1visalogo8.svg" alt="" />
            </span> */}
          </div>
          <div className="body_heare_right">
            <span className="username_hed">
              <FaRegUser className="mx-1" />
              {loginData?.firstname} {loginData?.lastname}
            </span>
            <span
              className="username_hed currsor_po"
              onClick={() => {
                dispatch(authActions.signout());
                navigate("/");
                setpopOpen(true);
              }}
            >
              <FaPowerOff className="mx-1" />
              Logout
            </span>

            <span
              className="username_hed_mobile currsor_po"
              onClick={() => showDrawer()}
            >
              <HiOutlineMenuAlt3 className="mx-0" />
            </span>
          </div>
        </div>
        <Drawer
          // title="Drawer with extra actions"
          placement="right"
          // width={500}
          size="378px"
          onClose={onClose}
          open={open}
          extra={<Space></Space>}
        >
          <DashboardMenu onClose={onClose} />
        </Drawer>
      </div>
    </>
  );
};

export default DashBoard_Header;
