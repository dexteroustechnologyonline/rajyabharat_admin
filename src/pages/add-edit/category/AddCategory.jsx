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
  categoryThumbnail,
  validateSlugUrl,
  resetCategoryImage,
} from "../../../redux/category/CategorySlice";

const AddCategory = () => {
  const dispatch = useDispatch();

  const { catthumb, isCatthumbLoading } = useSelector(
    (store) => store.category
  );

  const [messageApi, contextHolder] = message.useMessage();
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnPress, setbtnPress] = useState(false);

  const [categroy, setCategroy] = useState("");
  const [checkslugUrl, setCheckSlugUrl] = useState("");

  useEffect(() => {
    if (btnPress) {
      if (categroy === "") {
        setCheckSlugUrl("");
      }
    }
  }, [btnPress, categroy]);

  const verifyslugurl = async (e) => {
    const value = e;
    setCategroy(value);
    let slug = value
      .trim()
      .toLowerCase()
      .replace(" ", "-")
      .replace(/[.*+&?^ $@#%^!'/{}()|[\]\\]/g, "-")
      .replace("---", "-")
      .replace("----", "-")
      .replace("--", "-");
    if (slug != "") {
      let responce = await dispatch(validateSlugUrl(slug));
      if (responce.payload.success) {
        setCheckSlugUrl("");
      } else {
        setCheckSlugUrl(slug);
      }
    }
  };

  const thumbnailChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          dispatch(categoryThumbnail({ thumbnail: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setbtnPress(true);
    if (catthumb !== "" && checkslugUrl !== "") {
      const formData = {
        name: categroy,
        slugUrl: checkslugUrl,
        thumbnail: catthumb,
      };
      const data = await dispatch(categoryPost(formData));

      if (data.payload.success) {
        messageApi.open({
          type: "success",
          content: "Category created successfully",
        });
        setCategroy("");
        setCheckSlugUrl("");
        await dispatch(resetCategoryImage());
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
            <span>Add Category</span>
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
                label="Category Name"
                type="text"
                id="text"
                className="input_style"
                error={checkslugUrl === "" && btnPress ? true : false}
                helperText={
                  checkslugUrl === "" && btnPress
                    ? "Please enter category name"
                    : ""
                }
                value={categroy}
                onChange={(e) =>
                  verifyslugurl(
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
              <div className="input_style">
                <h6>Category Image</h6>

                <input
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  onChange={thumbnailChange}
                  style={
                    catthumb === "" && btnPress
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
                <h6>
                  <span style={{ color: "tomato" }}>*</span>The image width and
                  height should be 400px * 400px
                </h6>
                {catthumb === "" && btnPress && (
                  <h6>
                    <span style={{ color: "tomato" }}>
                      Please uploade image
                    </span>
                  </h6>
                )}

                {!isCatthumbLoading && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100px",
                      }}
                    >
                      <img src={catthumb} width="100%" alt="img" />
                    </div>
                  </div>
                )}
              </div>
            </div>
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

export default AddCategory;
