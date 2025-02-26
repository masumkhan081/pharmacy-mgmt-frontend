import React, { useEffect } from "react";
import Button from "../common-ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentView } from "../../redux/slices/DrugsView";
import { tblOptionsDrugsPage } from "../../ui-config/table";
import { useNavigate } from "react-router-dom";
import leftNav from "../../ui-config/left-nav"
import { ENTITIES } from "../../ui-config/entities";


export default function ViewFilterDrugs() {
  //
  const navigate = useNavigate();
  const currentView = useSelector((state) => state.drugsView.currentView);
  const activeStyle = (button) => (button == currentView ? "bg-green-300" : "");
  const userRole = useSelector((state) => state.user.role);

  //
  return (
    <div className="flex gap-2 flex-wrap">
      {
        tblOptionsDrugsPage
          .filter((option) => {
            const { access, isAccessControlled } = leftNav[ENTITIES.drug].options[option];
            // Only include options that are either not access controlled or accessible by the user's role
            return isAccessControlled === false || access.includes(userRole);
          })
          .map((option, ind) => (
            <Button
              txt={option}
              onClick={() => {
                navigate("/drugs/" + option);
              }}
              style={`btn_test_data capitalize ${activeStyle(option)}`}
              key={ind}
            />
          ))
      }
    </div>
  );
}
