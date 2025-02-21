import React, { useState, useLayoutEffect, useEffect } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import axios from "axios";
import {
  adminLoginBypassword,
  authActions,
} from "../redux/Authentication/AuthSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");

  const [visiable, setVisiable] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [buttonPress, setbuttonPress] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setVisiable((show) => !show);

  useEffect(() => {
    if (buttonPress === true) {
      if (email === "") {
        setemailError("Required");
      } else {
        setemailError("");
      }
      if (password === "") {
        setpasswordError("Required");
      } else {
        setpasswordError("");
      }
    }
  }, [buttonPress, email, password]);

  const loginPress = async (e) => {
    e.preventDefault();
    setbuttonPress(true);
    setbuttonLoading(true);
    setemailError("");
    if (email !== "" && password !== "") {
      const formData = {
        email: String(email),
        password: String(password),
      };

      const userDetails = await dispatch(adminLoginBypassword(formData));
      if (userDetails.payload.success === true) {
        dispatch(
          authActions.signin({
            ...userDetails.payload.admin,
            isAuth: true,
          })
        );
        navigate("/admin");
      } else {
        setemailError("please enter valid data");
        setpasswordError("please enter valid data");
        setbuttonLoading(false);
      }
    } else {
      setbuttonLoading(false);
    }
  };

  return (
    <>
      <div className="maincontainer_log">
        <div className="imagecontainer">
          <img src="./assets/img/hero/navratri.jpg" alt="" />
        </div>
        <div className="loginbox">
          <div className="login_div_cont">
            <div className="log_main">
              <span className="login_tobler_name">
                {/* <img src="/assets/img/logo/f1visalogo8.svg" alt="" /> */}
              </span>
              {/* <h5>LOG IN</h5> */}

              <div className="margin_top">
                <TextField
                  label="Username"
                  className="textfield"
                  type="text"
                  id="text"
                  style={{ width: "100%" }}
                  error={emailError !== "" ? true : false}
                  helperText={emailError}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  autocomplete="off"
                  size="small"
                />
              </div>
              <div className="margin_top">
                <TextField
                  style={{ width: "100%" }}
                  type={visiable ? "text" : "password"}
                  label="Password"
                  id="outlined-start-adornment"
                  error={passwordError !== "" ? true : false}
                  helperText={passwordError}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                  autocomplete="off"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={handleClickShowPassword}
                        className="currsor_po"
                      >
                        {visiable ? <VisibilityOff /> : <Visibility />}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="margin_top">
                <Link>
                  <span className="forget_pass">Forget Password?</span>
                </Link>
              </div>
              <div className="margin_top">
                <Button
                  type="primary"
                  onClick={(e) => loginPress(e)}
                  className="log_btn"
                  //   icon={<PoweroffOutlined />}
                  loading={buttonLoading}
                >
                  PROCEED
                </Button>
              </div>
              {/* <div className="margin_top">
                <span className="righr_logs">Powered by </span>
                <Link>
                  <span className="forget_pass">F1VISA.online</span>
                </Link>
                <span className="righr_logs">. All rights reserved. </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
