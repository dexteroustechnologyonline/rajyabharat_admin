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
  resetSubCategoryImage,
  subCategoryPost,
  subCategoryThumbnail,
  subCategoryUpdate,
  updateSubCatThumbnail,
  validatesubcatSlugUrl,
} from "../../../redux/subcategory/SubCategorySlice";

const UpdateSubcategory = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { allCategorys } = useSelector((store) => store.category);
  const { subCatthumb, isSubCatthumbLoading, subcategorytotal } = useSelector(
    (store) => store.subCategory
  );

  const [messageApi, contextHolder] = message.useMessage();
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnPress, setbtnPress] = useState(false);

  const [categroy, setCategroy] = useState("");
  const [categroyId, setCategroyId] = useState("");
  const [checkslugUrl, setCheckSlugUrl] = useState("");
  const [subcategroy, setSubCategroy] = useState("");

  const [subCatId, setsubCatId] = useState("");
  const [subcategoriesFilteried, setsubcategoriesFilteried] = useState([]);

  useEffect(() => {
    const subcatUrl = params.subcatslugurl;

    if (subcategorytotal.length > 0) {
      const updateSubcat = subcategorytotal.find(
        (subcat) => subcat.slugUrl === subcatUrl
      );

      if (updateSubcat) {
        setsubCatId(updateSubcat._id);
        const subCategoryfilter = subcategorytotal.filter(
          (category) => category._id !== updateSubcat._id
        );
        setsubcategoriesFilteried(subCategoryfilter);
        setSubCategroy(updateSubcat.name);
        setCheckSlugUrl(updateSubcat.slugUrl);
        setCategroyId(updateSubcat.categoryId);
        setCategroy(updateSubcat.category);
        dispatch(updateSubCatThumbnail(updateSubcat.thumbnail));
      }
    }
  }, [allCategorys, subcategorytotal]);

  useEffect(() => {
    if (btnPress) {
      if (subcategroy === "") {
        setCheckSlugUrl("");
      }
    }
  }, [btnPress, subcategroy]);

  const verifyslugurl = async (e) => {
    const value = e;
    setSubCategroy(value);
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
        (subcategory) => subcategory.slugUrl === slug
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
          dispatch(subCategoryThumbnail({ thumbnail: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setbtnPress(true);
    if (subCatthumb !== "" && checkslugUrl !== "" && categroy !== "") {
      const formData = {
        name: categroy,
        slugUrl: checkslugUrl,
        thumbnail: subCatthumb,
        category: categroy,
        categoryId: categroyId,
        subcatid: subCatId,
      };
      const data = await dispatch(subCategoryUpdate(formData));

      if (data.payload.success) {
        messageApi.open({
          type: "success",
          content: "Sub-Category updated successfully",
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
            <span>Update Sub-Category</span>
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
                label="Sub-Category Name"
                type="text"
                id="text"
                className="input_style"
                error={checkslugUrl === "" && btnPress ? true : false}
                helperText={
                  checkslugUrl === "" && btnPress
                    ? "Please enter sub-category name"
                    : ""
                }
                value={subcategroy}
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
                <h6>Sub-Category Image</h6>

                <input
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  onChange={thumbnailChange}
                  style={
                    subCatthumb === "" && btnPress
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
                {subCatthumb === "" && btnPress && (
                  <h6>
                    <span style={{ color: "tomato" }}>
                      Please uploade image
                    </span>
                  </h6>
                )}

                {!isSubCatthumbLoading && (
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
                      <img src={subCatthumb} width="100%" alt="img" />
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
                  "update"
                )}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateSubcategory;
