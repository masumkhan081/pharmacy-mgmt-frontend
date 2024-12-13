import React, { useEffect } from "react";
import Button from "../../common-ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentView } from "../../redux/slices/DrugsView";
import { tblOptionsDrugsPage } from "../../static-data/table";
import { useNavigate } from "react-router-dom";

// icons

export default function ViewFilterDrugs() {
  //
  const navigate = useNavigate();
  const currentView = useSelector((state) => state.drugsView.currentView);
  const activeStyle = (button) => (button == currentView ? "bg-green-300" : "");
  console.log("currentView::   ", currentView);
  // 
  return (
    <div className="flex gap-2 flex-wrap">
      {tblOptionsDrugsPage.map((option, ind) => {
        return (
          <Button
            txt={option}
            onClick={() => {
              navigate("/drugs/" + option);
            }}
            style={`btn_test_data capitalize ${activeStyle(option)} `}
            key={ind}
          />
        );
      })}
    </div>
  );
}
