import React, { useEffect } from "react";
import { tblHeaderBrands } from "../../static-data/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/StaffView";

export default function AttendanceTbl({ }) {
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
