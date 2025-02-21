
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPrint } from "react-icons/fa6";
import { styled } from "@mui/material/styles";
import { Box, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Link, useNavigate } from "react-router-dom";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import Checkbox from "@mui/material/Checkbox";
import { CSVLink } from "react-csv";
import { MdEdit, MdDelete } from "react-icons/md";
import { FcCancel } from "react-icons/fc";
import { TiCancel } from "react-icons/ti";
import {
  DownOutlined,
  CaretDownOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, Select, Button, Flex, Modal, message } from "antd";

import axios from "axios";
import { FaRegCheckCircle, FaBell } from "react-icons/fa";
import { LuXCircle } from "react-icons/lu";
import {
  categoryDelete,
  categoryUpdate,
} from "../../redux/category/CategorySlice";
import { newsUpdate } from "../../redux/news/NewsSlice";
const { RangePicker } = DatePicker;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#006fa9",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&td, &th": {
    border: 0,
  },
}));

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const UplishedNews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { publishedNews } = useSelector((store) => store.newsAdmin);
  const { menubar } = useSelector((store) => store.auth);
  const [messageApi, contextHolder] = message.useMessage();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filter_data, setfilter_data] = useState([]);
  const [start_date, setstart_date] = useState("");
  const [end_date, setend_date] = useState("");
  const [search, setSearch] = useState("");
  const [selectData, setSelectData] = useState("");
  const [modal, setModal] = useState(false);
  const [modal_cancel, setModal_cancel] = useState(false);

  const statusChange = async (e, data) => {
    e.preventDefault();
    const value = e.target.checked;
    if (value === true) {
      const formData = {
        newsid: data._id,
        newsAprovelStatus: true,
        newsAprovelText: "published",
      };
      await dispatch(newsUpdate(formData));
    } else {
      const formData = {
        newsid: data._id,
        newsAprovelStatus: false,
        newsAprovelText: "Pending",
      };
      await dispatch(newsUpdate(formData));
    }
  };

  const deleteClick = async (e) => {
    const id = selectData._id;
    const deletclick = await dispatch(categoryDelete(id));
    if (deletclick.payload.success) {
      setModal(false);
      messageApi.open({
        type: "success",
        content: "News deleted  successfully",
      });
    }
  };

  const cancelnewsClick = async (e) => {
    const formData = {
      newsid: selectData._id,
      newsAprovelText: "cancelled",
    };
    const cancelclick = await dispatch(newsUpdate(formData));
    if (cancelclick.payload.success) {
      setModal_cancel(false);
      messageApi.open({
        type: "success",
        content: "News Cancel successfully",
      });
    }
  };

  useEffect(() => {
    let filter_trans = publishedNews;
    if (search !== "") {
      filter_trans = filter_trans.filter((transaction) => {
        return (
          transaction.newsTitle.toLowerCase().match(search.toLowerCase()) ||
          transaction.reporterName.toLowerCase().match(search.toLowerCase()) ||
          transaction.mobile.toLowerCase().match(search.toLowerCase())
        );
      });
    }
    if (end_date !== "" && start_date !== "") {
      filter_trans = filter_trans.filter(
        (transaction) =>
          moment(transaction.createdAt).format("YYYY-MM-DD") >= start_date &&
          moment(transaction.createdAt).format("YYYY-MM-DD") <= end_date
      );
    }
    setfilter_data([...filter_trans]);
  }, [search, end_date, start_date, publishedNews]);

  const disableFutureDates = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current.toDate() > today;
  };

  const onChange = (date, dateString) => {
    setstart_date(dateString[0]);
    setend_date(dateString[1]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      {contextHolder}

      <Modal
        open={modal}
        title=" "
        onOk={(e) => deleteClick(e)}
        onCancel={() => {
          setModal(false);
          setSelectData("");
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <p> Do you want to Delete {selectData.name} </p>
      </Modal>
      <Modal
        open={modal_cancel}
        title=" "
        onOk={(e) => cancelnewsClick(e)}
        onCancel={() => {
          setModal_cancel(false);
          setSelectData("");
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <p> Do you want to Cancel {selectData.newsTitle} </p>
      </Modal>

      <div className="main_fragnent_container p-2">
        <div className="profile_container_header">
          <div className="profile_co_header_left">
            <span>Search News</span>
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
        <div className="transaction_header">
          <Input
            placeholder="Name Search"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            style={{
              width: "50vh",
            }}
            suffix={
              <SearchOutlined
                style={{
                  fontSize: 16,
                  color: "#1677ff",
                }}
              />
            }
          />
          <RangePicker
            disabledDate={disableFutureDates}
            onChange={onChange}
            format="YYYY-MM-DD"
            // value={selectedDates}
          />
          <TablePagination
            component="div"
            count={0}
            page={0}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 100]}
            labelRowsPerPage="Rows:"
            labelDisplayedRows={() => null}
            SelectProps={{
              inputProps: { "aria-label": "rows" },
              native: true,
            }}
            ActionsComponent={() => null}
          />
        </div>
        <div className="letter_content">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer component={Paper} className="customScrollbar">
              <Table
                sx={{ minWidth: 700, border: "none" }}
                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left" sx={{ border: "none" }}>
                      No
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: "none" }}>
                      Title
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: "none" }}>
                      IMAGE
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: "none" }}>
                      STATUS
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ border: "none" }}>
                      ACTION
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ border: "none" }}>
                      DOC
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ border: "none" }}>
                      Reporter Name
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filter_data
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((data, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          sx={{ border: "none" }}
                        >
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell
                          width={menubar ? 400 : 550}
                          align="left"
                          sx={{ border: "none" }}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              navigate(`/admin/update-news/${data.slugUrl}`);
                            }}
                          >
                            {data.newsTitle}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          width={150}
                          sx={{ border: "none" }}
                        >
                          <img
                            src={data.thumbnail}
                            height="100"
                            width="100"
                            alt=""
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          align="center"
                          width={50}
                          sx={{ border: "none" }}
                        >
                          <Checkbox
                            {...label}
                            value={data.newsAprovelStatus}
                            checked={data.newsAprovelStatus === true}
                            onChange={(e) => {
                              statusChange(e, data);
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          width={100}
                          sx={{ border: "none" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "row",
                              gap: "1vh",
                            }}
                          >
                            <Link to={`/admin/update-news/${data.slugUrl}`}>
                              <div className="approve_box">
                                <MdEdit />
                              </div>
                            </Link>
                            <div
                              className="regect_box"
                              onClick={() => {
                                setSelectData(data);
                                setModal(true);
                              }}
                            >
                              <MdDelete />
                            </div>
                            <div
                              className="pending_box"
                              onClick={() => {
                                setSelectData(data);
                                setModal_cancel(true);
                              }}
                            >
                              <TiCancel />
                            </div>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          width={100}
                          sx={{ border: "none" }}
                        >
                          {moment(data.createdAt).format("MMM DD, YYYY")}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          width={150}
                          sx={{ border: "none" }}
                        >
                          {data.reporterName}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filter_data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </>
  );
};

export default UplishedNews;
