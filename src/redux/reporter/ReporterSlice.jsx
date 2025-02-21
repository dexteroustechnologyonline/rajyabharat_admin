import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.REACT_APP_BASE_URL;

const initialState = {
  reportersTotal: localStorage.getItem("reportersTotal")
    ? JSON.parse(localStorage.getItem("reportersTotal")).sort((a, b) =>
        b.createdAt > a.createdAt ? 1 : -1
      )
    : [],
  approvedReporters: localStorage.getItem("groceryordertotal")
    ? JSON.parse(localStorage.getItem("groceryordertotal")).filter(
        (reorter) => reorter.reporterStatusText === "Approved"
      )
    : [],
  notApprovedReporters: localStorage.getItem("groceryordertotal")
    ? JSON.parse(localStorage.getItem("groceryordertotal")).filter(
        (reorter) => reorter.reporterStatusText === "Not Approved"
      )
    : [],
  blockedReporters: localStorage.getItem("groceryordertotal")
    ? JSON.parse(localStorage.getItem("groceryordertotal")).filter(
        (reorter) => reorter.reporterStatusText === "Blocked"
      )
    : [],
  seniourReporterReporters: localStorage.getItem("groceryordertotal")
    ? JSON.parse(localStorage.getItem("groceryordertotal")).filter(
        (reorter) => reorter.reporterStatusText === "Sr.Reporter"
      )
    : [],

  reporterImage: [],
  reporterKycImage: [],
  isreporterKycImageLoading: true,
  reporterLoading: true,
  reporterIamgeLoading: true,
};

export const reporterRegister = createAsyncThunk(
  "reporter/reporterRegister",
  async (formData, thunkAPI) => {
    let resp = {
      success: false,
      message: "reporter not registered",
    };
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/reporter/register`;
      resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const validateReporterEmail = createAsyncThunk(
  "reporter/validateReporterEmail",
  async (email, thunkAPI) => {
    let resp = {
      success: false,
      message: "new email",
    };
    try {
      const url = `${Baseurl}/api/v1/reporter/email/${email}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);
export const validateReporterMobile = createAsyncThunk(
  "reporter/validateReporterMobile",
  async (mobile, thunkAPI) => {
    let resp = {
      success: false,
      message: "new email",
    };
    try {
      const url = `${Baseurl}/api/v1/reporter/mobile/${mobile}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);
export const validateReporterKYcDocument = createAsyncThunk(
  "reporter/validateReporterKYcDocument",
  async (kycdocument, thunkAPI) => {
    let resp = {
      success: false,
      message: "new kyc document",
    };
    try {
      const url = `${Baseurl}/api/v1/reporter/kycdocument/${kycdocument}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);
export const getReporterAll = createAsyncThunk(
  "reporter/getReporterAll",
  async (thunkAPI) => {
    let resp = {
      success: false,
      message: "new kyc document",
    };
    try {
      const url = `${Baseurl}/api/v1/reporter/reporterall`;
      const resp = await axios.get(url);
      return resp.data.repertories;
    } catch (error) {
      return error;
    }
  }
);

export const UploadkycDocumentImage = createAsyncThunk(
  "reporter/UploadkycDocumentImage",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/reporter/kycdocumentImage`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("kyc document Image Not create");
    }
  }
);
export const UploadAvatharImageImage = createAsyncThunk(
  "reporter/UploadAvatharImageImage",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      };

      const url = `${Baseurl}/api/v1/reporter/avatharImage`;
      const resp = await axios.post(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("kyc document Image Not create");
    }
  }
);

export const reporterUpdate = createAsyncThunk(
  "reporter/reporterUpdate",
  async (formData, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/reporter/reporterUpdate/${formData.reprterid}`;
      const resp = await axios.put(url, formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("category Not create");
    }
  }
);

export const reporterDelete = createAsyncThunk(
  "reporter/reporterDelete",
  async (id, thunkAPI) => {
    try {
      const config = {
        Headers: { "Content-Type": "application/json" },
      };
      const url = `${Baseurl}/api/v1/reporter/reporterDelete/${id}`;
      const resp = await axios.delete(url, id, config);
      const myreturn = {
        success: resp.data.success,
        id: id,
      };
      return myreturn;
    } catch (error) {
      return thunkAPI.rejectWithValue("reporter Not create");
    }
  }
);

const ReporterSlice = createSlice({
  name: "reporter",
  initialState,
  reducers: {
    updateKycImages(state, action) {
      state.reporterKycImage = action.payload;
      state.isreporterKycImageLoading = false;
    },
    removeImages(state, action) {
      state.reporterKycImage = [];
      state.reporterImage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reporterRegister.pending, (state) => {
        state.reporterLoading = true;
      })
      .addCase(reporterRegister.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.reportersTotal = [
            ...state.reportersTotal,
            action.payload.reporter,
          ].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
          state.approvedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Approved"
          );
          state.notApprovedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Not Approved"
          );
          state.blockedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Blocked"
          );
          state.seniourReporterReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Sr.Reporter"
          );
          localStorage.setItem(
            "reportersTotal",
            JSON.stringify(state.reportersTotal)
          );
        }

        state.reporterLoading = false;
      })
      .addCase(reporterRegister.rejected, (state) => {
        state.reporterLoading = true;
      });
    builder
      .addCase(getReporterAll.pending, (state) => {
        state.reporterLoading = true;
      })
      .addCase(getReporterAll.fulfilled, (state, action) => {
        state.reportersTotal = action.payload.sort((a, b) =>
          b.createdAt > a.createdAt ? 1 : -1
        );
        state.approvedReporters = state.reportersTotal.filter(
          (reorter) => reorter.reporterStatusText === "Approved"
        );

        state.notApprovedReporters = state.reportersTotal.filter(
          (reorter) => reorter.reporterStatusText === "Not Approved"
        );
        state.blockedReporters = state.reportersTotal.filter(
          (reorter) => reorter.reporterStatusText === "Blocked"
        );
        state.seniourReporterReporters = state.reportersTotal.filter(
          (reorter) => reorter.reporterStatusText === "Sr.Reporter"
        );
        localStorage.setItem(
          "reportersTotal",
          JSON.stringify(state.reportersTotal)
        );
        state.reporterLoading = false;
      })
      .addCase(getReporterAll.rejected, (state) => {
        state.reporterLoading = true;
      });
    builder
      .addCase(UploadkycDocumentImage.pending, (state) => {
        state.isreporterKycImageLoading = true;
      })
      .addCase(UploadkycDocumentImage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.reporterKycImage = [
            ...state.reporterKycImage,
            action.payload.kycdocumentImages,
          ];
        }
        state.isreporterKycImageLoading = false;
      })
      .addCase(UploadkycDocumentImage.rejected, (state) => {
        state.isreporterKycImageLoading = true;
      });
    builder
      .addCase(UploadAvatharImageImage.pending, (state) => {
        state.reporterIamgeLoading = true;
      })
      .addCase(UploadAvatharImageImage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.reporterImage = [
            ...state.reporterImage,
            action.payload.avatharImages,
          ];
        }
        state.reporterIamgeLoading = false;
      })
      .addCase(UploadAvatharImageImage.rejected, (state) => {
        state.reporterIamgeLoading = true;
      });
    builder
      .addCase(reporterUpdate.pending, (state) => {
        state.reporterLoading = true;
      })
      .addCase(reporterUpdate.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.reportersTotal = state.reportersTotal.filter(
            (reporter) => reporter._id !== action.payload.reporter._id
          );
          state.reportersTotal = [
            ...state.reportersTotal,
            action.payload.reporter,
          ].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

          state.approvedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Approved"
          );
          state.notApprovedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Not Approved"
          );
          state.blockedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Blocked"
          );
          state.seniourReporterReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Sr.Reporter"
          );
          localStorage.setItem(
            "reportersTotal",
            JSON.stringify(state.reportersTotal)
          );
        }

        state.reporterLoading = false;
      })
      .addCase(reporterUpdate.rejected, (state) => {
        state.reporterLoading = true;
      });
    builder
      .addCase(reporterDelete.pending, (state) => {
        state.reporterLoading = true;
      })
      .addCase(reporterDelete.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.reportersTotal = state.reportersTotal
            .filter((reporter) => reporter._id !== action.payload.id)
            .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

          state.approvedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Approved"
          );
          state.notApprovedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Not Approved"
          );
          state.blockedReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Blocked"
          );
          state.seniourReporterReporters = state.reportersTotal.filter(
            (reorter) => reorter.reporterStatusText === "Sr.Reporter"
          );
        }
        state.reporterLoading = false;
      })
      .addCase(reporterDelete.rejected, (state) => {
        state.reporterLoading = true;
      });
  },
});

export const { updateKycImages, removeImages } = ReporterSlice.actions;
export default ReporterSlice.reducer;
