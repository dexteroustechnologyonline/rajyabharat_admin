import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
const Baseurl = process.env.REACT_APP_BASE_URL
const initialState = {
  isAuth: JSON.parse(localStorage.getItem("loginData"))?.isAuth
    ? JSON.parse(localStorage.getItem("loginData")).isAuth
    : false,
  name: JSON.parse(localStorage.getItem("loginData"))?.name
    ? JSON.parse(localStorage.getItem("loginData")).name
    : "",
  email: JSON.parse(localStorage.getItem("loginData"))?.email
    ? JSON.parse(localStorage.getItem("loginData")).email
    : "",
  loginData: localStorage.getItem("loginData")
    ? JSON.parse(localStorage.getItem("loginData"))
    : "",

  mainNavbar: localStorage.getItem("mainNavbar")
    ? JSON.parse(localStorage.getItem("mainNavbar"))
    : "Dashboard",
  subNavbar: localStorage.getItem("subNavbar")
    ? JSON.parse(localStorage.getItem("subNavbar"))
    : "",
  listNavbar: localStorage.getItem("listNavbar")
    ? JSON.parse(localStorage.getItem("listNavbar"))
    : "",

  totalAdmins: [],
  adminLoading: true,
  isAuthLoading: true,
  fullscreen: false,
  menubar: true,
};

export const adminPost = createAsyncThunk(
  "admin/adminpost",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: {
          "content-type": "application/json",
        },
      };
      const url = `${Baseurl}/api/v1/admin/register`;
      const resp = await axios.post(url, formData, config);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Blog not able to upload");
    }
  }
);

export const adminLoginBypassword = createAsyncThunk(
  "admin/adminLogin",
  async (formData, thunkAPI) => {
    let resp = {
      success: false,
      message: "user not registered",
    };
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/admin/loginwithpassword`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const valiadteNumber = createAsyncThunk(
  "auth/valiadteNumber",
  async (number, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/admin/mobile/${number}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);
export const valiadteEmail = createAsyncThunk(
  "auth/valiadteEmail",
  async (number, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/admin/email/${number}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);
export const getAllAdmins = createAsyncThunk(
  "auth/getAllAdmins",
  async (number, thunkAPI) => {
    try {
      const url = `${Baseurl}/api/v1/admin/all`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);
export const updateAdmin = createAsyncThunk(
  "auth/updateAdmin",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: {
          "content-type": "application/json",
        },
      };
      const url = `${Baseurl}/api/v1/admin/updateadmin/${formData._id}`;
      const resp = await axios.put(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("auth not able to update");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setmainNavbar(state, action) {
      state.mainNavbar = action.payload;
      localStorage.setItem("mainNavbar", JSON.stringify(state.mainNavbar));
    },
    setsubNavbar(state, action) {
      state.subNavbar = action.payload;
      localStorage.setItem("subNavbar", JSON.stringify(state.subNavbar));
    },
    setlistNavbar(state, action) {
      state.listNavbar = action.payload;
      localStorage.setItem("listNavbar", JSON.stringify(state.listNavbar));
    },
    signin(state, action) {
      state.isAuth = action.payload.isAuth;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.loginData = action.payload;
      localStorage.setItem("loginData", JSON.stringify(state.loginData));
    },
    signout(state, action) {
      localStorage.removeItem("loginData");
      state.isAuth = false;
    },
    setFullScreen(state, action) {
      state.fullscreen = action.payload;
    },
    setmenubar(state, action) {
      state.menubar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdmins.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.totalAdmins = action.payload.admins
        }
        state.adminLoading = false;
      })
      .addCase(getAllAdmins.rejected, (state) => {
        state.adminLoading = true;
      })
      .addCase(adminPost.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(adminPost.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.totalAdmins = [action.payload.admin, ...state.totalAdmins];
        }
        state.adminLoading = false;
      })
      .addCase(adminPost.rejected, (state) => {
        state.adminLoading = true;
      })

      .addCase(updateAdmin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.totalAdmins = state.totalAdmins.filter(
            (admin) => admin._id !== action.payload.admin._id
          );
          state.totalAdmins = [action.payload.admin, ...state.totalAdmins];
        }
        state.adminLoading = false;
      })
      .addCase(updateAdmin.rejected, (state) => {
        state.adminLoading = true;
      })
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
