import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { PiPaperPlaneRight } from "react-icons/pi";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, message } from "antd";
import {
  categoryPost,
  resetCategoryImage,
} from "../../redux/category/CategorySlice";
import {
  removeImages,
  reporterRegister,
  updateKycImages,
  UploadkycDocumentImage,
  validateReporterEmail,
  validateReporterKYcDocument,
  validateReporterMobile,
} from "../../redux/reporter/ReporterSlice";

const UpdateReporter = () => {
  const dispatch = useDispatch();

  const { catthumb, isCatthumbLoading } = useSelector(
    (store) => store.category
  );

  const {
    reporterKycImage,
    isreporterKycImageLoading,
    reporterImage,
    reporterIamgeLoading,
  } = useSelector((store) => store.reporter);

  const [messageApi, contextHolder] = message.useMessage();
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnPress, setbtnPress] = useState(false);

  const [categroy, setCategroy] = useState("");
  const [checkslugUrl, setCheckSlugUrl] = useState("");

  const [fiesrname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [uniqueemail, setUniqueEmail] = useState("");
  const [errormassageEmail, setErrormassageEmail] = useState("");

  const [mobile, setMobile] = useState("");
  const [errormassageMobile, setErrormassageMobile] = useState("");
  const [comformphoneNo, setComformphoneNo] = useState("");

  const [distict, setDestict] = useState("");
  const [mandal, setmandal] = useState("");

  const [kycDocument, setKycDocument] = useState("");
  const [uniqekycDocument, setUniqekycDocument] = useState("");
  const [kycDocumentError, setKycDocumentError] = useState("");

  useEffect(() => {
    if (btnPress) {
      if (uniqueemail === "") {
        setErrormassageEmail("please enter correct Email format");
      }
      if (comformphoneNo === "") {
        setErrormassageMobile("Please enter valid number");
      }
      if (uniqekycDocument === "") {
        setKycDocumentError("Please enter valid 12 digit aadhar number");
      }
    }
  }, [btnPress, uniqueemail, comformphoneNo, uniqekycDocument]);

  const verifyemail = async (e) => {
    const value = e;
    setEmail(value);
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (value.length > 0) {
      if (value.match(mailformat)) {
        if (value != "") {
          let responce = await dispatch(validateReporterEmail(value));
          if (responce.payload.success) {
            setErrormassageEmail("Email already exist");
          } else {
            setUniqueEmail(value);
            setErrormassageEmail("");
          }
        }
      } else {
        setErrormassageEmail("please enter correct Email format");
      }
    } else {
      setErrormassageEmail("please enter correct Email format");
    }
  };

  const verifyPhoneNumber = async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);
    if (value.length === 10) {
      let responce = await dispatch(validateReporterMobile(value));

      if (responce.payload.success) {
        setErrormassageMobile("Number already exist");
        setComformphoneNo("");
      } else {
        setComformphoneNo(value);
        setErrormassageMobile("");
      }
    } else {
      setErrormassageMobile("Please enter valid number");
    }
  };

  const kycDocumentChange = async (e) => {
    const value = e.target.value.toUpperCase().trim();
    setKycDocument(value);
    if (value.length === 12) {
      let responce = await dispatch(validateReporterKYcDocument(value));

      if (responce.payload.success) {
        setKycDocumentError("Aadhar number already exist");
        setUniqekycDocument("");
      } else {
        setUniqekycDocument(value);
        setKycDocumentError("");
      }
    } else {
      setKycDocumentError("Please enter valid 12 digit aadhar number");
    }
  };

  const imageRemoveClick = (e, imagename, indexnumber) => {
    let imagearray = reporterKycImage;
    imagearray = imagearray.filter((image) => image !== imagename);
    dispatch(updateKycImages(imagearray));
  };

  const thumbnailChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          dispatch(UploadkycDocumentImage({ kycdocumentImage: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setbtnPress(true);
    if (
      uniqueemail != "" &&
      comformphoneNo != "" &&
      // uniqekycDocument !== "" &&
      fiesrname !== "" &&
      // reporterKycImage.length !== 0 &&
      lastname !== ""
    ) {
      const formData = {
        firstname: fiesrname,
        lastname: lastname,
        email: uniqueemail,
        mobile: comformphoneNo,
        password: comformphoneNo,
        // kycdocument: uniqekycDocument,
        // kycdocumentImage: reporterKycImage,
        kycdocument: "",
        kycdocumentImage: [],
        district: distict,
        mandal: mandal,
        avatar: "",
        reporterStatus: "2",
        reporterStatusText: "Approved",
      };
      const data = await dispatch(reporterRegister(formData));

      if (data.payload.success) {
        messageApi.open({
          type: "success",
          content: "Reporter created successfully",
        });
        setFirstName("");
        setLastName("");
        setEmail("");
        setUniqueEmail("");
        setMobile("");
        setComformphoneNo("");
        setKycDocument("");
        setUniqekycDocument("");
        setErrormassageEmail("");
        setErrormassageMobile("");
        setKycDocumentError("");
        setDestict("");
        setmandal("");
        dispatch(removeImages());
        setbtnLoading(false);
        setbtnPress(false);
      } else {
        setbtnLoading(false);
      }
    } else {
      setbtnLoading(false);
    }
  };

  const LoadingButton = styled(Button)(({ theme }) => ({
    position: "relative",
  }));

  const LoadingIndicator = styled(CircularProgress)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  }));

  return (
    <>
      {contextHolder}
      <div className="main_fragnent_container p-2">
        <div className="profile_container_header">
          <div className="profile_co_header_left">
            <span>Update Reporter</span>
            <span
              style={{
                visibility: "hidden",
              }}
            >
              Student
            </span>
          </div>
          <div className="profile_co_header_right"></div>
        </div>
        <div className="main_recha_container">
          <div className="inputs_container">
            <div className="dn_input_box">
              <TextField
                label="First Name"
                type="text"
                id="text"
                className="input_style"
                error={fiesrname === "" && btnPress ? true : false}
                helperText={
                  fiesrname === "" && btnPress ? "Please enter First Name" : ""
                }
                value={fiesrname}
                onChange={(e) =>
                  setFirstName(
                    e.target.value.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )
                  )
                }
                autocomplete="off"
                size="small"
              />
            </div>
            <div className="dn_input_box">
              <TextField
                label="Last Name"
                type="text"
                id="text"
                className="input_style"
                error={lastname === "" && btnPress ? true : false}
                helperText={
                  lastname === "" && btnPress ? "Please enter Last Name" : ""
                }
                value={lastname}
                onChange={(e) =>
                  setLastName(
                    e.target.value.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )
                  )
                }
                autocomplete="off"
                size="small"
              />
            </div>
            <div className="dn_input_box">
              <TextField
                label="Email"
                type="text"
                id="text"
                className="input_style"
                error={errormassageEmail === "" ? false : true}
                helperText={errormassageEmail}
                value={email}
                onChange={(e) => verifyemail(e.target.value.toLowerCase())}
                autocomplete="off"
                size="small"
              />
            </div>
            <div className="dn_input_box">
              <TextField
                label="Mobile"
                type="text"
                id="text"
                className="input_style"
                error={errormassageMobile === "" ? false : true}
                helperText={errormassageMobile}
                value={mobile}
                onChange={(e) => verifyPhoneNumber(e)}
                autocomplete="off"
                size="small"
                inputProps={{
                  minLength: 10,
                  maxLength: 10,
                }}
              />
            </div>
            <div className="dn_input_box">
              <TextField
                label="District"
                type="text"
                id="text"
                className="input_style"
                error={distict === "" && btnPress ? true : false}
                helperText={
                  distict === "" && btnPress ? "Please enter District" : ""
                }
                value={distict}
                onChange={(e) =>
                  setDestict(
                    e.target.value.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )
                  )
                }
                autocomplete="off"
                size="small"
              />
            </div>
            <div className="dn_input_box">
              <TextField
                label="Mandal"
                type="text"
                id="text"
                className="input_style"
                error={mandal === "" && btnPress ? true : false}
                helperText={
                  mandal === "" && btnPress ? "Please enter Mandal" : ""
                }
                value={mandal}
                onChange={(e) =>
                  setmandal(
                    e.target.value.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )
                  )
                }
                autocomplete="off"
                size="small"
              />
            </div>
            {/* <div className="dn_input_box">
              <TextField
                label="KYC Document (Aadhar)"
                type="text"
                id="text"
                className="input_style"
                error={kycDocumentError === "" ? false : true}
                helperText={kycDocumentError}
                value={kycDocument}
                onChange={(e) => kycDocumentChange(e)}
                autocomplete="off"
                size="small"
                inputProps={{
                  minLength: 12,
                  maxLength: 12,
                }}
              />
            </div> */}
            {/* <div className="dn_input_box"></div> */}
            {/* <div className="dn_input_box">
              <div className="input_style">
                <h6>KYC Document Image (Aadhar)</h6>

                <input
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  multiple
                  onChange={thumbnailChange}
                  style={
                    reporterKycImage.length === 0 && btnPress
                      ? {
                          border: "1px solid red",
                          width: "100%",
                          background: "#ffe6e6",
                          cursor: "pointer",
                        }
                      : {
                          cursor: "pointer",
                        }
                  }
                />

                {reporterKycImage.length === 0 && btnPress && (
                  <h6>
                    <span style={{ color: "tomato" }}>
                      Please uploade image
                    </span>
                  </h6>
                )}

                {!isreporterKycImageLoading && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {reporterKycImage.map((image, index) => (
                      <div
                        style={{
                          position: "relative",
                          height: "100px",
                          width: "150px",
                          margin: "5px",
                        }}
                      >
                        <img
                          src={image}
                          height="100%"
                          style={{
                            height: "100px",
                            width: "150px",
                            margin: "5px",
                          }}
                          alt="img"
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 3,
                          }}
                          onClick={(e) => imageRemoveClick(e, image, index)}
                        >
                          <h6
                            style={{
                              fontWeight: "bold",
                              color: "red",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                          >
                            X
                          </h6>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> */}
            {/* <div className="dn_input_box"></div> */}
            <div className="button_container">
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={(e) => handlesubmit(e)}
                disabled={btnLoading}
              >
                {btnLoading ? (
                  <>
                    LOading
                    <LoadingIndicator size={24} />
                  </>
                ) : (
                  "Submit"
                )}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateReporter;
