import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.REACT_APP_BASE_URL;

const initialState = {
  totalAdminNews: localStorage.getItem("totalAdminNews")
    ? JSON.parse(localStorage.getItem("totalAdminNews")).sort((a, b) =>
        b.createdAt > a.createdAt ? 1 : -1
      )
    : [],
  unCancelledNews: localStorage.getItem("totalAdminNews")
    ? JSON.parse(localStorage.getItem("totalAdminNews")).filter(
        (news) => news.newsAprovelText !== "cancelled"
      )
    : [],
  canceldNews: localStorage.getItem("totalAdminNews")
    ? JSON.parse(localStorage.getItem("totalAdminNews")).filter(
        (news) => news.newsAprovelText === "cancelled"
      )
    : [],
  savedNews: localStorage.getItem("totalAdminNews")
    ? JSON.parse(localStorage.getItem("totalAdminNews")).filter(
        (news) => news.newsAprovelText === "saved"
      )
    : [],
  publishedNews: localStorage.getItem("unCancelledNews")
    ? JSON.parse(localStorage.getItem("unCancelledNews")).filter(
        (news) => news.newsAprovelStatus === true
      )
    : [],
  unPublishedNews: localStorage.getItem("unCancelledNews")
    ? JSON.parse(localStorage.getItem("unCancelledNews")).filter(
        (news) =>
          news.newsAprovelStatus === false && news.newsAprovelText === "Pending"
      )
    : [],

  newsSlider: [],
  newsthumb: "",
  newsicon: "",

  isnewsSliderLoading: true,
  isNewsthumbLoading: true,
  isnewsiconLoading: true,

  newsAdminLoading: true,
  deleteNewsLoading: true,
  checkSlugurl: true,
};

export const getNewsAdmin = createAsyncThunk(
  "newsAdmin/getNewsAdmin",
  async (thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/news/all`;
      const resp = await axios(url);
      return resp.data.news;
    } catch (error) {
      return thunkAPI.rejectWithValue("404 Not Found");
    }
  }
);

export const newsPost = createAsyncThunk(
  "news/newsPost",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/news/new`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("news Not create");
    }
  }
);

export const validateSlugUrl = createAsyncThunk(
  "news/validateSlugUrl",
  async (slugurl, thunkAPI) => {
    let resp = {
      success: false,
      message: "new news",
    };
    try {
      const url = `${Baseurl}/api/v1/news/newsslugurl/${slugurl}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const newsUpdate = createAsyncThunk(
  "newsAdmin/newsUpdate",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/news/newsupdate/${formData.newsid}`;
      const resp = await axios.put(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("news Not create");
    }
  }
);

export const newsDelete = createAsyncThunk(
  "news/newsDelete",
  async (id, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/news/newsdelete/${id}`;
      const resp = await axios.delete(url, id, config);
      const myreturn = {
        success: resp.data.success,
        id: id,
      };
      return myreturn;
    } catch (error) {
      return thunkAPI.rejectWithValue("news Not create");
    }
  }
);

export const newsImageUpload = createAsyncThunk(
  "news/newsImageUpload",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/news/newsimage`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("news Not create");
    }
  }
);

const NewsAdminSlice = createSlice({
  name: "newsAdmin",
  initialState,
  reducers: {
    resetNewsImage(state) {
      state.newsSlider = [];
      state.newsthumb = "";
      state.newsicon = "";
      state.isnewsSliderLoading = true;
      state.isNewsthumbLoading = true;
      state.isnewsiconLoading = true;
    },
    updateNewsImages(state, action) {
      state.newsSlider = action.payload;
      state.newsthumb = action.payload;
      state.newsicon = action.payload;
      state.isnewsSliderLoading = false;
      state.isNewsthumbLoading = false;
      state.isnewsiconLoading = false;
    },
    updateNewsThumbImages(state, action) {
      state.newsthumb = action.payload;
      state.isNewsthumbLoading = false;
    },
    updateNewsiconImages(state, action) {
      state.newsicon = action.payload;
      state.isnewsiconLoading = false;
    },
    updateNewsSliderImages(state, action) {
      state.newsSlider = action.payload;
      state.isnewsSliderLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newsPost.pending, (state) => {
        state.newsAdminLoading = true;
      })
      .addCase(newsPost.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.totalAdminNews = [
            ...state.totalAdminNews,
            action.payload.news,
          ].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

          state.unCancelledNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText !== "cancelled"
          );
          state.canceldNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText === "cancelled"
          );
          state.savedNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText === "saved"
          );

          state.publishedNews = state.unCancelledNews.filter(
            (news) => news.newsAprovelStatus === true
          );
          state.unPublishedNews = state.unCancelledNews.filter(
            (news) =>
              news.newsAprovelStatus === false &&
              news.newsAprovelText === "Pending"
          );

          localStorage.setItem(
            "totalAdminNews",
            JSON.stringify(state.totalAdminNews)
          );
        }

        state.newsAdminLoading = false;
        state.checkSlugurl = false;
      })
      .addCase(newsPost.rejected, (state) => {
        state.newsAdminLoading = true;
      });
    builder
      .addCase(getNewsAdmin.pending, (state) => {
        state.newsAdminLoading = true;
      })
      .addCase(getNewsAdmin.fulfilled, (state, action) => {
        state.totalAdminNews = action.payload.sort((a, b) =>
          b.createdAt > a.createdAt ? 1 : -1
        );
        state.unCancelledNews = state.totalAdminNews.filter(
          (news) => news.newsAprovelText !== "cancelled"
        );
        state.canceldNews = state.totalAdminNews.filter(
          (news) => news.newsAprovelText === "cancelled"
        );
        state.savedNews = state.totalAdminNews.filter(
          (news) => news.newsAprovelText === "saved"
        );

        state.publishedNews = state.unCancelledNews.filter(
          (news) => news.newsAprovelStatus === true
        );
        state.unPublishedNews = state.unCancelledNews.filter(
          (news) =>
            news.newsAprovelStatus === false &&
            news.newsAprovelText === "Pending"
        );

        localStorage.setItem(
          "totalAdminNews",
          JSON.stringify(state.totalAdminNews)
        );
        state.newsAdminLoading = false;
      })
      .addCase(getNewsAdmin.rejected, (state) => {
        state.newsAdminLoading = true;
      });
    builder
      .addCase(newsUpdate.pending, (state) => {
        state.newsAdminLoading = true;
      })
      .addCase(newsUpdate.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.totalAdminNews = state.totalAdminNews.filter(
            (news) => news._id !== action.payload.news._id
          );
          state.totalAdminNews = [
            ...state.totalAdminNews,
            action.payload.news,
          ].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

          state.unCancelledNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText !== "cancelled"
          );
          state.canceldNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText === "cancelled"
          );
          state.savedNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText === "saved"
          );

          state.publishedNews = state.unCancelledNews.filter(
            (news) => news.newsAprovelStatus === true
          );
          state.unPublishedNews = state.unCancelledNews.filter(
            (news) =>
              news.newsAprovelStatus === false &&
              news.newsAprovelText === "Pending"
          );

          localStorage.setItem(
            "totalAdminNews",
            JSON.stringify(state.totalAdminNews)
          );
        }

        state.newsAdminLoading = false;
      })
      .addCase(newsUpdate.rejected, (state) => {
        state.newsAdminLoading = true;
      });
    builder
      .addCase(newsDelete.pending, (state) => {
        state.deleteNewsLoading = true;
      })
      .addCase(newsDelete.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.totalAdminNews = state.totalAdminNews
            .filter((news) => news._id !== action.payload.id)
            .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
          state.unCancelledNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText !== "cancelled"
          );
          state.canceldNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText === "cancelled"
          );
          state.savedNews = state.totalAdminNews.filter(
            (news) => news.newsAprovelText === "saved"
          );

          state.publishedNews = state.unCancelledNews.filter(
            (news) => news.newsAprovelStatus === true
          );
          state.unPublishedNews = state.unCancelledNews.filter(
            (news) =>
              news.newsAprovelStatus === false &&
              news.newsAprovelText === "Pending"
          );

          localStorage.setItem(
            "totalAdminNews",
            JSON.stringify(state.totalAdminNews)
          );
        }
        state.deleteNewsLoading = false;
      })
      .addCase(newsDelete.rejected, (state) => {
        state.deleteNewsLoading = true;
      });
    builder
      .addCase(newsImageUpload.pending, (state) => {
        state.isnewsSliderLoading = true;
      })
      .addCase(newsImageUpload.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.newsSlider = [...state.newsSlider, action.payload.sliders];
          state.newsthumb = action.payload.thumbnails;
          state.newsicon = action.payload.icons;
        }
        state.isnewsSliderLoading = false;
        state.isNewsthumbLoading = false;
        state.isnewsiconLoading = false;
      })
      .addCase(newsImageUpload.rejected, (state) => {
        state.isnewsSliderLoading = true;
      });
  },

});

export const {
  resetNewsImage,
  updateNewsImages,
  updateNewsThumbImages,
  updateNewsiconImages,
  updateNewsSliderImages,
} = NewsAdminSlice.actions;
export default NewsAdminSlice.reducer;
