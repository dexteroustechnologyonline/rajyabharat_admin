import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../redux/Authentication/AuthSlice";
import categoryreducer from "../redux/category/CategorySlice";
import subCategoryreducer from "../redux/subcategory/SubCategorySlice";
import universaltagreducer from "../redux/universaltag/universalTagSlice";
import categoryTagreducer from "../redux/categorytag/CategoryTagSlice";
import newsAdminreducer from "../redux/news/NewsSlice";
import reporterreducer from "../redux/reporter/ReporterSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    category: categoryreducer,
    subCategory: subCategoryreducer,
    universaltag: universaltagreducer,
    categoryTag: categoryTagreducer,
    newsAdmin: newsAdminreducer,
    reporter: reporterreducer,
  },
});
