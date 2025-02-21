import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.REACT_APP_BASE_URL;

const initialState = {
  universalTags: localStorage.getItem("universalTags")
    ? JSON.parse(localStorage.getItem("universalTags")).sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1
      )
    : [],
  uniTagthumb: "",
  isUniTagthumbLoading: true,
  universalTagLoading: true,
  deleteUniTagLoading: true,
  checkSlugurl: true,
};

export const validateSlugUrl = createAsyncThunk(
  "universaltag/validateSlugUrl",
  async (slugurl, thunkAPI) => {
    let resp = {
      success: false,
      message: "new universaltag",
    };
    try {
      const url = `${Baseurl}/api/v1/universaltag/univtagslugurl/${slugurl}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const universaltagPost = createAsyncThunk(
  "universaltag/universaltagPost",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/universaltag/new`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("universaltag Not create");
    }
  }
);

export const getUniversalTag = createAsyncThunk(
  "universaltag/getUniversalTag",
  async (thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/universaltag/all`;
      const resp = await axios(url);
      return resp.data.universaltags;
    } catch (error) {
      return thunkAPI.rejectWithValue("404 Not Found");
    }
  }
);

export const universaltagUpdate = createAsyncThunk(
  "universaltag/universaltagUpdate",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/universaltag/updateunitag/${formData.uitagid}`;
      const resp = await axios.put(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("universaltag Not create");
    }
  }
);

export const universalTagThumbnail = createAsyncThunk(
  "universaltag/universalTagThumbnail",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/universaltag/thumbnail`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("universaltag Thumbnail Not create");
    }
  }
);

export const uniTagDelete = createAsyncThunk(
  "universaltag/uniTagDelete",
  async (id, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/universaltag/unitagdelete/${id}`;
      const resp = await axios.delete(url, id, config);
      const myreturn = {
        success: resp.data.success,
        id: id,
      };
      return myreturn;
    } catch (error) {
      return thunkAPI.rejectWithValue("universaltag Not create");
    }
  }
);

const UniversalTagSlice = createSlice({
  name: "universaltag",
  initialState,
  reducers: {
    updateUniTagThumbnail(state, action) {
      state.uniTagthumb = action.payload;
      state.isUniTagthumbLoading = false;
    },
    resetUniTagImage(state) {
      state.uniTagthumb = "";
      state.isUniTagthumbLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(universaltagPost.pending, (state) => {
        state.universalTagLoading = true;
      })
      .addCase(universaltagPost.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.universalTags = [
            ...state.universalTags,
            action.payload.universaltag,
          ].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          localStorage.setItem(
            "universalTags",
            JSON.stringify(state.universalTags)
          );
        }

        state.universalTagLoading = false;
        state.checkSlugurl = false;
      })
      .addCase(universaltagPost.rejected, (state) => {
        state.universalTagLoading = true;
      });
    builder
      .addCase(getUniversalTag.pending, (state) => {
        state.universalTagLoading = true;
      })
      .addCase(getUniversalTag.fulfilled, (state, action) => {
        state.universalTags = action.payload.sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        );

        localStorage.setItem(
          "universalTags",
          JSON.stringify(state.universalTags)
        );
        state.universalTagLoading = false;
      })
      .addCase(getUniversalTag.rejected, (state) => {
        state.universalTagLoading = true;
      });
    builder
      .addCase(universaltagUpdate.pending, (state) => {
        state.universalTagLoading = true;
      })
      .addCase(universaltagUpdate.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.universalTags = state.universalTags.filter(
            (unitag) => unitag._id !== action.payload.universaltag._id
          );
          state.universalTags = [
            ...state.universalTags,
            action.payload.universaltag,
          ].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          localStorage.setItem(
            "universalTags",
            JSON.stringify(state.universalTags)
          );
        }

        state.universalTagLoading = false;
      })
      .addCase(universaltagUpdate.rejected, (state) => {
        state.universalTagLoading = true;
      });
    builder
      .addCase(universalTagThumbnail.pending, (state) => {
        state.isUniTagthumbLoading = true;
      })
      .addCase(universalTagThumbnail.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.uniTagthumb = action.payload.thumbnails;
        }
        state.isUniTagthumbLoading = false;
      })
      .addCase(universalTagThumbnail.rejected, (state) => {
        state.isUniTagthumbLoading = true;
      });
    builder
      .addCase(uniTagDelete.pending, (state) => {
        state.deleteUniTagLoading = true;
      })
      .addCase(uniTagDelete.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.universalTags = state.universalTags
            .filter((unitag) => unitag._id !== action.payload.id)
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

          localStorage.setItem(
            "universalTags",
            JSON.stringify(state.universalTags)
          );
        }
        state.deleteUniTagLoading = false;
      })
      .addCase(uniTagDelete.rejected, (state) => {
        state.deleteUniTagLoading = true;
      });
  },
});

export const { resetUniTagImage, updateUniTagThumbnail } =
  UniversalTagSlice.actions;
export default UniversalTagSlice.reducer;
