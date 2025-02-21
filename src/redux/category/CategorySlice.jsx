import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import axios from "axios";
const Baseurl = process.env.REACT_APP_BASE_URL;

const initialState = {
  allCategorys: localStorage.getItem("allCategorys")
    ? JSON.parse(localStorage.getItem("allCategorys")).sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1
      )
    : [],
  catthumb: "",
  isCatthumbLoading: true,
  categoryLoading: true,
  deleteCatLoading: true,
  checkSlugurl: true,
};

export const categoryPost = createAsyncThunk(
  "category/categorypost",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/category/new`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("category Not create");
    }
  }
);

export const validateSlugUrl = createAsyncThunk(
  "category/validateSlugUrl",
  async (slugurl, thunkAPI) => {
    let resp = {
      success: false,
      message: "new category",
    };
    try {
      const url = `${Baseurl}/api/v1/category/catslugurl/${slugurl}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/category/all`;
      const resp = await axios(url);
      return resp.data.categories;
    } catch (error) {
      return thunkAPI.rejectWithValue("404 Not Found");
    }
  }
);

export const categoryUpdate = createAsyncThunk(
  "category/categoryUpdate",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/category/catupdate/${formData.catid}`;
      const resp = await axios.put(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("category Not create");
    }
  }
);

export const categoryThumbnail = createAsyncThunk(
  "category/categoryThumbnail",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/category/thumbnail`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("category Thumbnail Not create");
    }
  }
);

export const categoryDelete = createAsyncThunk(
  "category/categoryDelete",
  async (id, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/category/catdelete/${id}`;
      const resp = await axios.delete(url, id, config);
      const myreturn = {
        success: resp.data.success,
        id: id,
      };
      return myreturn;
    } catch (error) {
      return thunkAPI.rejectWithValue("category Not create");
    }
  }
);

const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateCatThumbnail(state, action) {
      state.catthumb = action.payload;
      state.isCatthumbLoading = false;
    },
    resetCategoryImage(state) {
      state.catthumb = "";
      state.isCatthumbLoading = true;
    },
    deleteCategory(state, action) {
      state.allCategorys = state.allCategorys.filter(
        (category) => category._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoryPost.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(categoryPost.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allCategorys = [
            ...state.allCategorys,
            action.payload.category,
          ].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          localStorage.setItem(
            "allCategorys",
            JSON.stringify(state.allCategorys)
          );
        }
        state.categoryLoading = false;
        state.checkSlugurl = false;
      })
      .addCase(categoryPost.rejected, (state) => {
        state.categoryLoading = true;
      });
    builder
      .addCase(getCategory.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.allCategorys = action.payload.sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        );

        localStorage.setItem(
          "allCategorys",
          JSON.stringify(state.allCategorys)
        );
        state.categoryLoading = false;
      })
      .addCase(getCategory.rejected, (state) => {
        state.categoryLoading = true;
      });
    builder
      .addCase(categoryUpdate.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(categoryUpdate.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allCategorys = state.allCategorys.filter(
            (category) => category._id !== action.payload.category._id
          );
          state.allCategorys = [
            ...state.allCategorys,
            action.payload.category,
          ].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          localStorage.setItem(
            "allCategorys",
            JSON.stringify(state.allCategorys)
          );
        }

        state.categoryLoading = false;
      })
      .addCase(categoryUpdate.rejected, (state) => {
        state.categoryLoading = true;
      });
    builder
      .addCase(categoryThumbnail.pending, (state) => {
        state.isCatthumbLoading = true;
      })
      .addCase(categoryThumbnail.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.catthumb = action.payload.thumbnails;
        }
        state.isCatthumbLoading = false;
      })
      .addCase(categoryThumbnail.rejected, (state) => {
        state.isCatthumbLoading = true;
      });
    builder
      .addCase(categoryDelete.pending, (state) => {
        state.deleteCatLoading = true;
      })
      .addCase(categoryDelete.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allCategorys = state.allCategorys.filter(
            (category) => category._id !== action.payload.id
          );

          localStorage.setItem(
            "allCategorys",
            JSON.stringify(state.allCategorys)
          );
        }
        state.deleteCatLoading = false;
      })
      .addCase(categoryDelete.rejected, (state) => {
        state.deleteCatLoading = true;
      });
  },
});

export const { resetCategoryImage, updateCatThumbnail, deleteCategory } =
  CategorySlice.actions;
export default CategorySlice.reducer;
