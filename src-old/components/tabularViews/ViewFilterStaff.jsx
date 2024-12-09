import React from "react";
import Button from "../../common-ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentView } from "../../redux/slices/StaffView";
import { tblOptionsStaffPage } from "../../static-data/table";
import { useNavigate } from "react-router-dom";

export default function ViewFilterStaff() {
  //
  const navigate = useNavigate();
  const currentView = useSelector((state) => state.staffView.currentView);

  const activeStyle = (button) => (button == currentView ? "bg-green-300" : "");

  return (
    <div className="flex gap-2 flex-wrap">
      {tblOptionsStaffPage.map((option, ind) => {
        return (
          <Button
            txt={option}
            onClick={() => {
              navigate("/staff/" + option);
            }}
            style={`btn_test_data capitalize ${activeStyle(option)} `}
            key={ind}
          />
        );
      })}
    </div>
  );
}
