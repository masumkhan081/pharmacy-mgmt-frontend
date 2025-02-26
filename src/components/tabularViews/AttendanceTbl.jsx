import React, { useEffect } from "react";
import { tblHeaderBrands, tblOptionsStaffPage } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/StaffView";
import { getHandler } from "../../utils/handler";
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
      const data = await getHandler("/attendances");
      dispatch(setCurrentView({ view: ENTITIES.attendance, data: data.data.attendances }));
      // 
      localStorage.setItem('activeTab', ENTITIES.attendance);
      localStorage.setItem('lastRoute', location.pathname);
    };
    fetch();
  }, []);
  //
  return (
    <div className="w-full border rounded-md border-slate-200 overflow-x-scroll">
      <table className="w-full ">
        <thead>
          <tr className="tr_thead">
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
              <tr key={item._id} className="tr_tbody">
                <td className="td">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td> 
                <td className="py-1.125">{ind}</td>
                <td className="py-1.125">{item.name}</td>
                <td className="py-1.125">{item.generic}</td>
                <td className="py-1.125">{item.group}</td>
                <td className="py-1.125">{item.mfr}</td>
              </tr>
            );
          })} */}
        </tbody>
      </table>
    </div>
  );
}
