import React from "react";
import { Link } from "react-router-dom";

const EmptyTransactions = () => {
  return (
    <>
      <div className="empty_trans_container">
        <div className="empty_trans_box">
          <div className="empty_trans_box_image">
            <img src="/assets/img/logo/notransactions.jpg" alt="" />
          </div>
          <div className="empty_trans_box_title">
            <span>
              No Data Found, <Link to="/dashboard">Go to Dashboard</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmptyTransactions;
