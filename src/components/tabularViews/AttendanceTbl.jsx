import React, { useEffect } from "react";
import { tblHeaderBrands, tblOptionsStaffPage } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/StaffView";
import { getHandler } from "../../utils/handlerReqRes";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";

export default function AttendanceTbl({ }) {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const attendances = useSelector((state) => state.staffView.attendances);
  const allChecked = useSelector((state) => state.staffView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/attendances");
        dispatch(setCurrentView({ view: ENTITIES.attendance, data }));
      } catch (err) {
        console.error("Failed to fetch attendances:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.attendance);
    localStorage.setItem("lastRoute", location.pathname);
  }, []);
  //
  return (
    <div className="table-shell">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="tr-thead">
            <th className="th">
              {/* <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(checkAll())}
              /> */}
            </th>
            {tblHeaderBrands.map((itm, ind) => {
              return (
                <th key={ind} className="th">
                  {itm}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {/* {brands.map((item, ind) => {
            return (
              <tr key={item._id} className="tr-tbody">
                <td className="td">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td> 
                <td className="py-4">{ind}</td>
                <td className="py-4">{item.name}</td>
                <td className="py-4">{item.generic}</td>
                <td className="py-4">{item.group}</td>
                <td className="py-4">{item.mfr}</td>
              </tr>
            );
          })} */}
        </tbody>
      </table>
    </div>
  );
}
