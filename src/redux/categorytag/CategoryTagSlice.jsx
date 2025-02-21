import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.REACT_APP_BASE_URL;

const initialState = {
  categoryTagtotal: localStorage.getItem("categoryTagtotal")
    ? JSON.parse(localStorage.getItem("categoryTagtotal"))
    : [],
  catTagthumb: "",
  isCatTagthumbLoading: true,
  iscategoryTagLoading: true,
  deletecategoryTagLoading: true,
  checkSlugurl: true,
};

export const categoryTagPost = createAsyncThunk(
  "categoryTag/categoryTagPost",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/categorytag/new`;
      const resp = await axios.post(url, formData, config);
      console.log(resp.data);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("categoryTag Not create");
    }
  }
);

export const validatesubcatSlugUrl = createAsyncThunk(
  "categoryTag/validatesubcatSlugUrl",
  async (slugurl, thunkAPI) => {
    let resp = {
      success: false,
      message: "new categoryTag",
    };
    try {
      const url = `${Baseurl}/api/v1/categorytag/cattagslugurl/${slugurl}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const getCategoryTag = createAsyncThunk(
  "categoryTag/getCategoryTag",
  async (thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/categorytag/all`;
      const resp = await axios(url);
      return resp.data.categorytags;
    } catch (error) {
      return thunkAPI.rejectWithValue("404 Not Found");
    }
  }
);

export const categoryTagUpdate = createAsyncThunk(
  "categoryTag/categoryTagUpdate",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/categorytag/updatecattag/${formData.cattagid}`;
      const resp = await axios.put(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("categoryTag Not create");
    }
  }
);

export const categoryTagThumbnail = createAsyncThunk(
  "categoryTag/categoryTagThumbnail",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/categorytag/thumbnail`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("categoryTag Thumbnail Not create");
    }
  }
);

export const categoryTagDelete = createAsyncThunk(
  "categoryTag/categoryTagDelete",
  async (id, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/categorytag/cattagdelete/${id}`;
      const resp = await axios.delete(url, id, config);
      const myreturn = {
        success: resp.data.success,
        id: id,
      };
      return myreturn;
    } catch (error) {
      return thunkAPI.rejectWithValue("categorytag Not create");
    }
  }
);

const CategoryTagSlice = createSlice({
  name: "categoryTag",
  initialState,
  reducers: {
    updateCatTagThumbnail(state, action) {
      state.catTagthumb = action.payload;
      state.isCatTagthumbLoading = false;
    },
    resetCategoryTagImage(state) {
      state.catTagthumb = "";
      state.isCatTagthumbLoading = true;
    },
    categoryTagDeletes(state, action) {
      state.categoryTagtotal = state.categoryTagtotal.filter(
        (categoryTag) => categoryTag._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoryTagPost.pending, (state) => {
        state.iscategoryTagLoading = true;
      })
      .addCase(categoryTagPost.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.categoryTagtotal = [
            ...state.categoryTagtotal,
            action.payload.categorytag,
          ];
          localStorage.setItem(
            "categoryTagtotal",
            JSON.stringify(state.categoryTagtotal)
          );
        }
        state.iscategoryTagLoading = false;
      })
      .addCase(categoryTagPost.rejected, (state) => {
        state.iscategoryTagLoading = true;
      });
    builder
      .addCase(getCategoryTag.pending, (state) => {
        state.iscategoryTagLoading = true;
      })
      .addCase(getCategoryTag.fulfilled, (state, action) => {
        state.categoryTagtotal = action.payload;

        localStorage.setItem(
          "categoryTagtotal",
          JSON.stringify(state.categoryTagtotal)
        );
        state.iscategoryTagLoading = false;
      })
      .addCase(getCategoryTag.rejected, (state) => {
        state.iscategoryTagLoading = true;
      });
    builder
      .addCase(categoryTagUpdate.pending, (state) => {
        state.iscategoryTagLoading = true;
      })
      .addCase(categoryTagUpdate.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.categoryTagtotal = state.categoryTagtotal.filter(
            (categorytag) => categorytag._id !== action.payload.categorytag._id
          );
          state.categoryTagtotal = [
            ...state.categoryTagtotal,
            action.payload.categorytag,
          ];

          localStorage.setItem(
            "categoryTagtotal",
            JSON.stringify(state.categoryTagtotal)
          );
        }
        state.iscategoryTagLoading = false;
      })
      .addCase(categoryTagUpdate.rejected, (state) => {
        state.iscategoryTagLoading = true;
      });
    builder
      .addCase(categoryTagThumbnail.pending, (state) => {
        state.isCatTagthumbLoading = true;
      })
      .addCase(categoryTagThumbnail.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.catTagthumb = action.payload.thumbnails;
        }
        state.isCatTagthumbLoading = false;
      })
      .addCase(categoryTagThumbnail.rejected, (state) => {
        state.isCatTagthumbLoading = true;
      });
    builder
      .addCase(categoryTagDelete.pending, (state) => {
        state.deletecategoryTagLoading = true;
      })
      .addCase(categoryTagDelete.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.categoryTagtotal = state.categoryTagtotal.filter(
            (categoryTag) => categoryTag._id !== action.payload.id
          );

          localStorage.setItem(
            "categoryTagtotal",
            JSON.stringify(state.categoryTagtotal)
          );
        }
        state.deletecategoryTagLoading = false;
      })
      .addCase(categoryTagDelete.rejected, (state) => {
        state.deletecategoryTagLoading = true;
      });
  },
});

export const {
  updateCatTagThumbnail,
  resetCategoryTagImage,
  categoryTagDeletes,
} = CategoryTagSlice.actions;
export default CategoryTagSlice.reducer;
