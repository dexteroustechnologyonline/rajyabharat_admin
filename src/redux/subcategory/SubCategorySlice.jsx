import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import axios from "axios";
const Baseurl = process.env.REACT_APP_BASE_URL;

const initialState = {
  subcategorytotal: localStorage.getItem("subcategorytotal")
    ? JSON.parse(localStorage.getItem("subcategorytotal")).sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1
      )
    : [],
  subCatthumb: "",
  isSubCatthumbLoading: true,
  isSubCatLoading: true,
  deleteSubCatLoading: true,
  checkSlugurl: true,
};

export const subCategoryPost = createAsyncThunk(
  "subCategory/subCategoryPost",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/subcategory/new`;
      const resp = await axios.post(url, formData, config);
      console.log(resp.data);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Sub Category Not create");
    }
  }
);

export const getSubCategory = createAsyncThunk(
  "subCategory/getSubCategory",
  async (thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/subcategory/all`;
      const resp = await axios(url);
      return resp.data.subcategories;
    } catch (error) {
      return thunkAPI.rejectWithValue("404 Not Found");
    }
  }
);

export const validatesubcatSlugUrl = createAsyncThunk(
  "subcategory/validatesubcatSlugUrl",
  async (slugurl, thunkAPI) => {
    let resp = {
      success: false,
      message: "new subcategory",
    };
    try {
      const url = `${Baseurl}/api/v1/subcategory/slugurl/${slugurl}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const subCategoryUpdate = createAsyncThunk(
  "subCategory/subCategoryUpdate",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/subcategory/subcatupdate/${formData.subcatid}`;
      const resp = await axios.put(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("subcategory Not create");
    }
  }
);

export const subCategoryThumbnail = createAsyncThunk(
  "subCategory/subCategoryThumbnail",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/subcategory/thumbnail`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("subcategory Thumbnail Not create");
    }
  }
);

export const subcategoryDelete = createAsyncThunk(
  "subCategory/subcategoryDelete",
  async (id, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/subcategory/subcatdelete/${id}`;
      const resp = await axios.delete(url, id, config);
      const myreturn = {
        success: resp.data.success,
        id: id,
      };
      return myreturn;
    } catch (error) {
      return thunkAPI.rejectWithValue("subcategory Not create");
    }
  }
);

const SubCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    updateSubCatThumbnail(state, action) {
      state.subCatthumb = action.payload;
      state.isSubCatthumbLoading = false;
    },
    resetSubCategoryImage(state) {
      state.subCatthumb = "";
      state.isSubCatthumbLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subCategoryPost.pending, (state) => {
        state.isSubCatLoading = true;
      })
      .addCase(subCategoryPost.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.subcategorytotal = [
            ...state.subcategorytotal,
            action.payload.subcategory,
          ].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          localStorage.setItem(
            "subcategorytotal",
            JSON.stringify(state.subcategorytotal)
          );
        }
        state.isSubCatLoading = false;
      })
      .addCase(subCategoryPost.rejected, (state) => {
        state.isSubCatLoading = true;
      });
    builder
      .addCase(getSubCategory.pending, (state) => {
        state.isSubCatLoading = true;
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.subcategorytotal = action.payload.sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        );

        localStorage.setItem(
          "subcategorytotal",
          JSON.stringify(state.subcategorytotal)
        );
        state.isSubCatLoading = false;
      })
      .addCase(getSubCategory.rejected, (state) => {
        state.isSubCatLoading = true;
      });
    builder
      .addCase(subCategoryUpdate.pending, (state) => {
        state.isSubCatLoading = true;
      })
      .addCase(subCategoryUpdate.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.subcategorytotal = state.subcategorytotal.filter(
            (subcategory) => subcategory._id !== action.payload.subcategory._id
          );
          state.subcategorytotal = [
            ...state.subcategorytotal,
            action.payload.subcategory,
          ].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

          localStorage.setItem(
            "subcategorytotal",
            JSON.stringify(state.subcategorytotal)
          );
        }
        state.isSubCatLoading = false;
      })
      .addCase(subCategoryUpdate.rejected, (state) => {
        state.isSubCatLoading = true;
      });
    builder
      .addCase(subCategoryThumbnail.pending, (state) => {
        state.isSubCatthumbLoading = true;
      })
      .addCase(subCategoryThumbnail.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.subCatthumb = action.payload.thumbnails;
        }
        state.isSubCatthumbLoading = false;
      })
      .addCase(subCategoryThumbnail.rejected, (state) => {
        state.isSubCatthumbLoading = true;
      });
    builder
      .addCase(subcategoryDelete.pending, (state) => {
        state.deleteSubCatLoading = true;
      })
      .addCase(subcategoryDelete.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.subcategorytotal = state.subcategorytotal
            .filter((subcategory) => subcategory._id !== action.payload.id)
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

          localStorage.setItem(
            "subcategorytotal",
            JSON.stringify(state.subcategorytotal)
          );
        }
        state.deleteSubCatLoading = false;
      })
      .addCase(subcategoryDelete.rejected, (state) => {
        state.deleteSubCatLoading = true;
      });
  },
});

export const { updateSubCatThumbnail, resetSubCategoryImage } =
  SubCategorySlice.actions;
export default SubCategorySlice.reducer;
