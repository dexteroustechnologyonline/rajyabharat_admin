import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import {
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { PiPaperPlaneRight } from "react-icons/pi";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, message } from "antd";
import {
  newsImageUpload,
  newsPost,
  newsUpdate,
  resetNewsImage,
  updateNewsiconImages,
  updateNewsImages,
  updateNewsSliderImages,
  updateNewsThumbImages,
  validateSlugUrl,
} from "../../redux/news/NewsSlice";

const UpdateNews = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const maxChars = 400;
  const {
    newsSlider,
    isnewsSliderLoading,
    newsthumb,
    newsicon,
    totalAdminNews,
  } = useSelector((store) => store.newsAdmin);

  const { isAuth, name, loginData } = useSelector((store) => store.auth);
  const { subcategorytotal } = useSelector((store) => store.subCategory);
  const { categoryTagtotal } = useSelector((store) => store.categoryTag);
  const { universalTags } = useSelector((store) => store.universaltag);
  const { allCategorys } = useSelector((store) => store.category);

  const [messageApi, contextHolder] = message.useMessage();
  const [savebtnLoading, setsavebtnLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnPress, setbtnPress] = useState(false);

  const [categroy, setCategroy] = useState("");
  const [categroyId, setCategroyId] = useState("");
  const [subCategroyId, setSubCategroyId] = useState("");
  const [subcategroy, setSubCategroy] = useState("");

  const [newsContent, setNewsContent] = useState("");
  const [newsShortName, setNewsShortName] = useState("");
  const [checkslugUrl, setCheckSlugUrl] = useState("");

  const [universalTagss, setUniversalTags] = useState([]);
  const [categoryTag, setCategorytag] = useState([]);

  const [filtersSubcategroy, setfiltersSubCategroy] = useState([]);
  const [filterCategroyTag, setfilterCategroyTag] = useState([]);

  const [newsId, setNewsId] = useState("");
  const [newsCurr, setNewsCurr] = useState("");
  const [filterNews, setfilterNews] = useState([]);

  useEffect(() => {
    const subcatbycat = subcategorytotal.filter(
      (cat) => cat.categoryId === categroyId
    );
    setfiltersSubCategroy(subcatbycat);
    const cattagbycat = categoryTagtotal.filter(
      (cat) => cat.categoryId === categroyId
    );
    setfilterCategroyTag(cattagbycat);
  }, [categroyId]);

  useEffect(() => {
    const newsUrl = params.newsurl;
    if (totalAdminNews.length > 0) {
      const updateNews = totalAdminNews.find(
        (news) => news.slugUrl === newsUrl
      );
      if (updateNews) {
        setNewsId(updateNews._id);
        setNewsCurr(updateNews);
        const newsFilter = totalAdminNews.filter(
          (news) => news._id !== updateNews._id
        );
        setfilterNews(newsFilter);
        setNewsContent(updateNews.newsContent);
        setNewsShortName(updateNews.newsTitle);
        setCheckSlugUrl(updateNews.slugUrl);
        setCategroy(updateNews.category);
        setCategroyId(updateNews.categoryId);
        setSubCategroyId(updateNews.subCategoryId);
        setSubCategroy(updateNews.subCategory);
        dispatch(updateNewsImages(updateNews.slider));
        dispatch(updateNewsThumbImages(updateNews.thumbnail));
        dispatch(updateNewsiconImages(updateNews.icon));
        setUniversalTags([updateNews.universatTag]);
        setCategorytag([updateNews.categoryTag]);
      }
    }
  }, [totalAdminNews]);

  useEffect(() => {
    if (btnPress) {
      if (newsShortName === "") {
        setCheckSlugUrl("");
      }
    }
  }, [btnPress, newsShortName]);

  const selectCategoryTag = (event) => {
    const value = event.target.value;
    setCategorytag(typeof value === "string" ? value.split(",") : value);
  };
  const selectUniversalTag = (event) => {
    const value = event.target.value;
    setUniversalTags(typeof value === "string" ? value.split(",") : value);
  };

  const imageRemoveClick = (e, imagename, indexnumber) => {
    let imagearray = newsSlider;
    imagearray = imagearray.filter((image) => image !== imagename);
    dispatch(updateNewsSliderImages(imagearray));
  };

  const verifyslugurl = async (e) => {
    const value = e;
    setNewsShortName(value);
    let slug = value
      .trim()
      .toLowerCase()
      .replace(" ", "-")
      .replace(/[.*+&?^ $@#%^!'/{}()|[\]\\]/g, "-")
      .replace("---", "-")
      .replace("----", "-")
      .replace("--", "-");
    if (slug != "") {
      const slugverify = filterNews.filter(
        (newsslug) => newsslug.slugUrl === slug
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
          dispatch(newsImageUpload({ slider: reader.result }));
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
      newsShortName !== "" &&
      newsContent !== "" &&
      checkslugUrl !== "" &&
      subcategroy !== "" &&
      // !isnewsSliderLoading &&
      categroy !== ""
    ) {
      const formData = {
        newsTitle: newsShortName,
        slugUrl: checkslugUrl,
        newsContent: newsContent,
        newsMainContent: "news",
        category: categroy,
        categoryId: categroyId,
        subCategory: subcategroy,
        subCategoryId: subCategroyId,
        newsVideoYouTubeLink: "",
        newsVideoTwitterLink: "",
        sliderShow: false,
        newsAprovelStatus: true,
        slider: newsSlider,
        thumbnail: newsthumb,
        icon: newsicon,
        // categoryTag: categoryTag,
        // universatTag: universalTagss,
        reporterId: loginData._id,
        reporterName: loginData.firstname + " " + loginData.lastname,
        email: loginData.email,
        mobile: loginData.mobile,
        reporterId: newsCurr._id,
        reporterName: newsCurr.reporterName,
        email: newsCurr.email,
        mobile: newsCurr.mobile,
        newsAprovelStatus: true,
        newsAprovelText: "published",
        newsid: newsId,
      };
      const data = await dispatch(newsUpdate(formData));

      if (data.payload.success) {
        messageApi.open({
          type: "success",
          content: "News updated successfully",
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
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setsavebtnLoading(true);
    setbtnPress(true);
    if (
      newsShortName !== "" &&
      newsContent !== "" &&
      checkslugUrl !== "" &&
      subcategroy !== "" &&
      // !isnewsSliderLoading &&
      categroy !== ""
    ) {
      const formData = {
        newsTitle: newsShortName,
        slugUrl: checkslugUrl,
        newsContent: newsContent,
        newsMainContent: "news",
        category: categroy,
        categoryId: categroyId,
        subCategory: subcategroy,
        subCategoryId: subCategroyId,
        newsVideoYouTubeLink: "",
        newsVideoTwitterLink: "",
        sliderShow: false,
        newsAprovelStatus: true,
        slider: newsSlider,
        thumbnail: newsthumb,
        icon: newsicon,
        // categoryTag: categoryTag,
        // universatTag: universalTagss,
        reporterId: loginData._id,
        reporterName: loginData.firstname + " " + loginData.lastname,
        email: loginData.email,
        mobile: loginData.mobile,
        reporterId: newsCurr._id,
        reporterName: newsCurr.reporterName,
        email: newsCurr.email,
        mobile: newsCurr.mobile,
        newsAprovelText: "saved",
        newsAprovelStatus: false,
        newsid: newsId,
      };
      const data = await dispatch(newsUpdate(formData));

      if (data.payload.success) {
        messageApi.open({
          type: "success",
          content: "News saved successfully",
        });

        setsavebtnLoading(false);
        setbtnPress(false);
      } else {
        setsavebtnLoading(false);
      }
    } else {
      setsavebtnLoading(false);
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
            <span>Update News</span>
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
                label="Select category"
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
                id="select"
                label="Select subcategroy"
                select
                className="input_style"
                error={subCategroyId === "" && btnPress ? true : false}
                helperText={
                  subCategroyId === "" && btnPress
                    ? "Please Select subcategroy"
                    : ""
                }
                value={subCategroyId}
                onChange={(e) => {
                  const selected = filtersSubcategroy.find(
                    (subcat) => subcat._id === e.target.value
                  );
                  setSubCategroyId(e.target.value);
                  setSubCategroy(selected?.name);
                }}
                size="small"
              >
                {filtersSubcategroy &&
                  filtersSubcategroy.map((data, index) => (
                    <MenuItem key={index} value={data._id}>
                      {data.name}
                    </MenuItem>
                  ))}
              </TextField>
            </div>
            <div className="dn_input_box">
              <TextField
                label="News Title"
                type="text"
                id="text"
                className="input_style"
                error={checkslugUrl === "" && btnPress ? true : false}
                helperText={
                  checkslugUrl === "" && btnPress
                    ? "Please enter News Title"
                    : ""
                }
                value={newsShortName}
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
              <TextField
                label="News Content"
                multiline
                rows={4} // Adjust rows as needed
                variant="outlined"
                id="text"
                className="input_style"
                error={newsContent === "" && btnPress}
                helperText={
                  newsContent === "" && btnPress
                    ? "Please enter News Content"
                    : ""
                }
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                autoComplete="off"
                size="small"
                inputProps={{ maxLength: maxChars }} // Optional max length
                fullWidth
              />
              <div className="">
                <h6>
                  {newsContent.length} / {maxChars}
                </h6>
              </div>
            </div>
            <div className="dn_input_box">
              <div className="input_style">
                <h6>News Image</h6>

                <input
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  onChange={thumbnailChange}
                  multiple
                  style={
                    newsSlider.length === 0 && btnPress
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
                  height should be 850px * 565px
                </h6>
                {newsSlider.length === 0 && btnPress && (
                  <h6>
                    <span style={{ color: "tomato" }}>
                      Please uploade image
                    </span>
                  </h6>
                )}

                {!isnewsSliderLoading && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {newsSlider.map((image, index) => (
                      <div
                        style={{
                          position: "relative",
                          height: "100px",
                          width: "150px",
                          margin: "5px",
                        }}
                      >
                        <img src={image} height="100%" alt="img" />
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
            </div>
            <div className="dn_input_box"></div>

            <div className="dn_input_box">
              <FormControl
                fullWidth
                size="small"
                // error={categoryTag.length === 0 && btnPress}
              >
                <InputLabel id="demo-simple-select-label">
                  Select Category Tag
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  multiple
                  value={categoryTag}
                  onChange={selectCategoryTag}
                  renderValue={(selected) =>
                    filterCategroyTag
                      .filter((option) => selected.includes(option.name))
                      .map((option) => option.name)
                      .join(", ")
                  }
                >
                  {filterCategroyTag.map((data) => (
                    <MenuItem key={data._id} value={data.name}>
                      <Checkbox checked={categoryTag.includes(data.name)} />
                      <ListItemText primary={data.name} />
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>
                  {categoryTag.length === 0 && btnPress
                    ? "Please Select category tag"
                    : ""}
                </FormHelperText> */}
              </FormControl>
            </div>
            <div className="dn_input_box">
              <FormControl
                fullWidth
                size="small"
                // error={universalTagss.length === 0 && btnPress}
              >
                <InputLabel id="demo-simple-select-label">
                  Select Universal Tag
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  multiple
                  value={universalTagss}
                  onChange={selectUniversalTag}
                  renderValue={(selected) =>
                    universalTags
                      .filter((option) => selected.includes(option.name))
                      .map((option) => option.name)
                      .join(", ")
                  }
                >
                  {universalTags.map((data) => (
                    <MenuItem key={data._id} value={data.name}>
                      <Checkbox checked={universalTagss.includes(data.name)} />
                      <ListItemText primary={data.name} />
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>
                  {universalTagss.length === 0 && btnPress
                    ? "Please Select universal tag"
                    : ""}
                </FormHelperText> */}
              </FormControl>
            </div>
            <div className="dn_input_box"></div>
            <div
              className="button_container"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2vh",
              }}
            >
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={(e) => handleSaveSubmit(e)}
                disabled={savebtnLoading}
              >
                {savebtnLoading ? (
                  <>
                    LOading
                    <LoadingIndicator size={24} />
                  </>
                ) : (
                  "Save"
                )}
              </LoadingButton>
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

export default UpdateNews;
