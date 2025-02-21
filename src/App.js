
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from './pages/Login';
import Dashboard_Layout from './components/dashboard/Dashboard_Layout';
import Dashboard from './pages/Dashboard';
import AddCategory from "./pages/add-edit/category/AddCategory";
import ListCategory from "./pages/add-edit/category/ListCategory";
import UpdateCategory from "./pages/add-edit/category/UpdateCategory";
import AddCategoryTag from "./pages/add-edit/categorytag/AddCategoryTag";
import UpdateCategoryTag from "./pages/add-edit/categorytag/UpdateCategoryTag";
import ListCategoryTag from "./pages/add-edit/categorytag/ListCategoryTag";
import AddSubcategory from "./pages/add-edit/subcategory/AddSubcategory";
import UpdateSubcategory from "./pages/add-edit/subcategory/UpdateSubcategory";
import ListSubcategory from "./pages/add-edit/subcategory/ListSubcategory";
import AddUniversalTag from "./pages/add-edit/universaltag/AddUniversalTag";
import UpdateUniversalTag from "./pages/add-edit/universaltag/UpdateUniversalTag";
import ListUniversalTag from "./pages/add-edit/universaltag/ListUniversalTag";
import AddReporter from "./pages/reporter_management/AddReporter";
import UpdateReporter from "./pages/reporter_management/UpdateReporter";
import ReporterApprovedList from "./pages/reporter_management/ReporterApprovedList";
import SeniorReporterList from "./pages/reporter_management/SeniorReporterList";
import ReporterBlockList from "./pages/reporter_management/ReporterBlockList";
import ReporterNotApprovedList from "./pages/reporter_management/ReporterNotApprovedList";
import AddNews from "./pages/news_management/AddNews";
import UpdateNews from "./pages/news_management/UpdateNews";
import ListNews from "./pages/news_management/ListNews";
import UnPublishedNews from "./pages/news_management/UnPublishedNews";
import UplishedNews from "./pages/news_management/UplishedNews";
import CancelledNews from "./pages/news_management/CancelledNews";
import SavedNews from "./pages/news_management/SavedNews";
import AddAdds from "./pages/adds/AddAdds";
import ListAdds from "./pages/adds/ListAdds";
import UpdateAdds from "./pages/adds/UpdateAdds";
import { getCategory } from "./redux/category/CategorySlice";
import { getSubCategory } from "./redux/subcategory/SubCategorySlice";
import { getUniversalTag } from "./redux/universaltag/universalTagSlice";
import { getCategoryTag } from "./redux/categorytag/CategoryTagSlice";
import { getNewsAdmin } from "./redux/news/NewsSlice";
import ReporterList from "./pages/reporter_management/ReporterList";
import { getReporterAll } from "./redux/reporter/ReporterSlice";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);



  }, [pathname]);
  return null;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // if (!isMajor_subjectsAvailable || major_subjects.length === 0) {
    //   dispatch(getAllMajor_subjects());
    // }
  }, [])

  useEffect(() => {
    //get category
    dispatch(getCategory());
    //getSubCategory
    dispatch(getSubCategory());
    //universalTags
    dispatch(getUniversalTag());
    //categoryTagtotal
    dispatch(getCategoryTag());
    //getReporterAll
    dispatch(getReporterAll());
    //getNewsAdmin
    dispatch(getNewsAdmin());
    // //getadd
    // dispatch(getadd());
  }, []);
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route path="/admin" exact element={<Dashboard_Layout />}>
            <Route path="/admin" index element={<Dashboard />} />

            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/list-category" element={<ListCategory />} />
            <Route path="/admin/update-category/:caturl" element={<UpdateCategory />} />

            <Route path="/admin/add-category-tag" element={<AddCategoryTag />} />
            <Route path="/admin/list-category-tag" element={<ListCategoryTag />} />
            <Route path="/admin/update-category-tag/:cattagurl" element={<UpdateCategoryTag />} />

            <Route path="/admin/add-sub-category" element={<AddSubcategory />} />
            <Route path="/admin/list-sub-category" element={<ListSubcategory />} />
            <Route path="/admin/update-sub-category/:subcatslugurl" element={<UpdateSubcategory />} />

            <Route path="/admin/add-universal-tag" element={<AddUniversalTag />} />
            <Route path="/admin/list-universal-tag" element={<ListUniversalTag />} />
            <Route path="/admin/update-universal-tag/:unitagurl" element={<UpdateUniversalTag />} />

            <Route path="/admin/add-reporter" element={<AddReporter />} />
            <Route path="/admin/approved-list-reporter" element={<ReporterApprovedList />} />
            <Route path="/admin/not-approved-list-reporter" element={<ReporterNotApprovedList />} />
            <Route path="/admin/senior-list-reporter" element={<SeniorReporterList />} />
            <Route path="/admin/blocked-list-reporter" element={<ReporterBlockList />} />
            <Route path="/admin/all-list-reporter" element={<ReporterList />} />
            <Route path="/admin/update-reporter/:id" element={<UpdateReporter />} />

            <Route path="/admin/add-news" element={<AddNews />} />
            <Route path="/admin/list-news" element={<ListNews />} />
            <Route path="/admin/unpublished-news" element={<UnPublishedNews />} />
            <Route path="/admin/published-news" element={<UplishedNews />} />
            <Route path="/admin/cancelled-news" element={<CancelledNews />} />
            <Route path="/admin/saved-news" element={<SavedNews />} />
            <Route path="/admin/update-news/:newsurl" element={<UpdateNews />} />

            <Route path="/admin/add-adds" element={<AddAdds />} />
            <Route path="/admin/list-adds" element={<ListAdds />} />
            <Route path="/admin/update-adds/:id" element={<UpdateAdds />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
