import React, { useEffect, useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoPersonCircleOutline, IoReceiptSharp } from "react-icons/io5";
import { AiOutlineTeam } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegHandshake } from "react-icons/fa6";
import { LiaUniversitySolid } from "react-icons/lia";
import { RiMiniProgramLine } from "react-icons/ri";
import {
  MdAppRegistration,
  MdLockReset,
  MdOutlineManageAccounts,
  MdOutlinePayments,
  MdPassword,
  MdPayments,
} from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { FcMoneyTransfer } from "react-icons/fc";
import { CiCreditCard1 } from "react-icons/ci";
import { GiReceiveMoney } from "react-icons/gi";
import { FaHistory } from "react-icons/fa";
import { LuFilePlus2, LuHistory } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { PiStudentBold } from "react-icons/pi";
import { TbBrandBlogger, TbFileSettings } from "react-icons/tb";
import { CgWebsite } from "react-icons/cg";
import { GrBlog } from "react-icons/gr";
import { useLocation } from "react-router-dom";

const DashboardMenu = ({ menubar_Status, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [stateOpenKeys, setStateOpenKeys] = useState([]);

  const items = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
      routes: "/admin",
    },
    {
      key: "5",
      label: "Add-Edit",
      icon: <FaRegHandshake />,
      children: [
        {
          key: "6",
          label: "Category",
          icon: <LiaUniversitySolid />,
          children: [
            {
              key: "7",
              label: "Add category",
              routes: "/admin/add-category",
              icon: <MdOutlinePendingActions />,
            },
            {
              key: "9",
              label: "Search category",
              routes: "/admin/list-category",
              icon: <MdOutlinePendingActions />,
            },
          ],
        },
        {
          key: "10",
          label: "Sub Category",
          icon: <RiMiniProgramLine />,
          children: [
            {
              key: "33",
              label: "Add Sub-Category",
              routes: "/admin/add-sub-category",
              icon: <MdOutlinePendingActions />,
            },
            {
              key: "12",
              label: "Search Sub-Category",
              routes: "/admin/list-sub-category",
              icon: <MdOutlinePendingActions />,
            },
          ],
        },
        {
          key: "Universal_Tag",
          label: "Universal Tag",
          icon: <RiMiniProgramLine />,
          children: [
            {
              key: "Universal_Tag_1",
              label: "Add Universal Tag",
              routes: "/admin/add-universal-tag",
              icon: <MdOutlinePendingActions />,
            },
            {
              key: "Universal_Tag_2",
              label: "Search Universal Tag",
              routes: "/admin/list-universal-tag",
              icon: <MdOutlinePendingActions />,
            },
          ],
        },
        {
          key: "Category_Tag",
          label: "Category Tag",
          icon: <RiMiniProgramLine />,
          children: [
            {
              key: "Category_Tag_1",
              label: "Add Category Tag",
              routes: "/admin/add-category-tag",
              icon: <MdOutlinePendingActions />,
            },
            {
              key: "Category_Tag_2",
              label: "Search Category Tag",
              routes: "/admin/list-category-tag",
              icon: <MdOutlinePendingActions />,
            },
          ],
        },
      ],
    },
    {
      key: "13",
      label: "Reporters Management",
      icon: <TbFileSettings />,
      children: [
        {
          key: "141",
          label: "Add-Reporters",
          routes: "/admin/add-reporter",
          icon: <LuFilePlus2 />,
        },
        {
          key: "1521",
          label: "All Reporter",
          routes: "/admin/all-list-reporter",
          icon: <MdOutlinePendingActions />,
        },
        {
          key: "152",
          label: "Approved Reporters",
          routes: "/admin/approved-list-reporter",
          icon: <MdOutlinePendingActions />,
        },
        // {
        //   key: "151",
        //   label: "Senior-Reporter-List",
        //   routes: "/admin/senior-list-reporter",
        //   icon: <MdOutlinePendingActions />,
        // },
        {
          key: "1511",
          label: "Pending Reporters",
          routes: "/admin/not-approved-list-reporter",
          icon: <MdOutlinePendingActions />,
        },
        {
          key: "1512",
          label: "Blocked Reporters",
          routes: "/admin/blocked-list-reporter",
          icon: <MdOutlinePendingActions />,
        },
      ],
    },

    {
      key: "24",
      label: "News Management",
      icon: <FaRegHandshake />,
      children: [
        {
          key: "25",
          label: "Add News",
          routes: "/admin/add-news",
          icon: <MdAppRegistration />,
        },
        {
          key: "26",
          label: "Search News",
          routes: "/admin/list-news",
          icon: <MdOutlinePendingActions />,
        },
        {
          key: "261",
          label: "Unpublished News",
          routes: "/admin/unpublished-news",
          icon: <MdOutlinePendingActions />,
        },
        {
          key: "262",
          label: "Published News",
          routes: "/admin/published-news",
          icon: <MdOutlinePendingActions />,
        },
        {
          key: "263",
          label: "Cancelled News",
          routes: "/admin/cancelled-news",
          icon: <MdOutlinePendingActions />,
        },
        {
          key: "264",
          label: "Saved News",
          routes: "/admin/saved-news",
          icon: <MdOutlinePendingActions />,
        },
      ],
    },
    // {
    //   key: "27",
    //   label: "Adds",
    //   icon: <FaRegHandshake />,
    //   children: [
    //     {
    //       key: "28",
    //       label: "Add-Adds",
    //       routes: "/admin/add-adds",
    //       icon: <MdAppRegistration />,
    //     },
    //     {
    //       key: "29",
    //       label: "Add-List",
    //       routes: "/admin/list-adds",
    //       icon: <MdOutlinePendingActions />,
    //     },
    //   ],
    // },
  ];

  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(items);

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const navigationclick = (value) => {
    // console.log(value.item.props.routes, "value");
    const nav_link = value.item.props.routes;
    navigate(`${nav_link}`);
    onClose();
  };

  return (
    <>
      <div className="menu_main_container">
        <Menu
          mode="inline"
          expandIcon={menubar_Status === true ? null : ""}
          defaultSelectedKeys={["231"]}
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
          onClick={(e) => navigationclick(e)}
          items={items}
          inlineCollapsed={menubar_Status}
          style={{
            background: "#00324d",
          }}
        />
      </div>
    </>
  );
};

export default DashboardMenu;
