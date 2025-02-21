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
  categoryTagPost,
  categoryTagThumbnail,
  categoryTagUpdate,
  resetCategoryTagImage,
  updateCatTagThumbnail,
  validatesubcatSlugUrl,
} from "../../../redux/categorytag/CategoryTagSlice";

const UpdateCategoryTag = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { allCategorys } = useSelector((store) => store.category);

  const { catTagthumb, isCatTagthumbLoading, categoryTagtotal } = useSelector(
    (store) => store.categoryTag
  );

  const [messageApi, contextHolder] = message.useMessage();
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnPress, setbtnPress] = useState(false);

  const [categroy, setCategroy] = useState("");
  const [categroyId, setCategroyId] = useState("");
  const [checkslugUrl, setCheckSlugUrl] = useState("");
  const [categoryTag, setCategoryTag] = useState("");

  const [cattagId, setCattagId] = useState("");
  const [subcategoriesFilteried, setsubcategoriesFilteried] = useState([]);

  useEffect(() => {
    const cattagUrl = params.cattagurl;

    if (categoryTagtotal.length > 0) {
      const updateCattag = categoryTagtotal.find(
        (cattag) => cattag.slugUrl === cattagUrl
      );

      if (updateCattag) {
        setCattagId(updateCattag._id);
        const subCategoryfilter = categoryTagtotal.filter(
          (category) => category._id !== updateCattag._id
        );
        setsubcategoriesFilteried(subCategoryfilter);
        setCategoryTag(updateCattag.name);
        setCheckSlugUrl(updateCattag.slugUrl);
        setCategroyId(updateCattag.categoryId);
        setCategroy(updateCattag.category);
        dispatch(updateCatTagThumbnail(updateCattag.thumbnail));
      }
    }
  }, [params.cattagurl, categoryTagtotal]);

  useEffect(() => {
    if (btnPress) {
      if (categoryTag === "") {
        setCheckSlugUrl("");
      }
    }
  }, [btnPress, categoryTag]);

  const verifyslugurl = async (e) => {
    const value = e;
    setCategoryTag(value);
    let slug = value
      .trim()
      .toLowerCase()
      .replace(" ", "-")
      .replace(/[.*+&?^ $@#%^!'/{}()|[\]\\]/g, "-")
      .replace("---", "-")
      .replace("----", "-")
      .replace("--", "-");
    if (slug != "") {
      const slugverify = subcategoriesFilteried.find(
        (categorytag) => categorytag.slugUrl === slug
      );
      if (slugverify) {
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
          dispatch(categoryTagThumbnail({ thumbnail: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setbtnPress(true);
    if (catTagthumb !== "" && checkslugUrl !== "" && categroy !== "") {
      const formData = {
        name: categoryTag,
        slugUrl: checkslugUrl,
        thumbnail: catTagthumb,
        category: categroy,
        categoryId: categroyId,
        cattagid: cattagId,
      };
      const data = await dispatch(categoryTagUpdate(formData));

      if (data.payload.success) {
        messageApi.open({
          type: "success",
          content: "Category-Tag created successfully",
        });
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
            <span>Update Category Tag</span>
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
                id="select"
                label="Please Select category"
                select
                className="input_style"
                error={categroyId === "" && btnPress ? true : false}
                helperText={
                  categroyId === "" && btnPress ? "Please Select category" : ""
                }
                value={categroyId}
                onChange={(e) => {
                  const selected = allCategorys.find(
                    (cat) => cat._id === e.target.value
                  );
                  setCategroyId(e.target.value);
                  setCategroy(selected?.name);
                }}
                size="small"
              >
                {allCategorys &&
                  allCategorys.map((data, index) => (
                    <MenuItem key={index} value={data._id}>
                      {data.name}
                    </MenuItem>
                  ))}
              </TextField>
            </div>
            <div className="dn_input_box">
              <TextField
                label="Category Tag Name"
                type="text"
                id="text"
                className="input_style"
                error={checkslugUrl === "" && btnPress ? true : false}
                helperText={
                  checkslugUrl === "" && btnPress
                    ? "Please enter category tag name"
                    : ""
                }
                value={categoryTag}
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
                <h6>Category Tag Image</h6>

                <input
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  onChange={thumbnailChange}
                  style={
                    catTagthumb === "" && btnPress
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
                {catTagthumb === "" && btnPress && (
                  <h6>
                    <span style={{ color: "tomato" }}>
                      Please uploade image
                    </span>
                  </h6>
                )}

                {!isCatTagthumbLoading && (
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
                      <img src={catTagthumb} width="100%" alt="img" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="dn_input_box"></div>
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
                  "Update"
                )}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCategoryTag;
