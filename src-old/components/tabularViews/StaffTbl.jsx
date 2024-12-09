import React, { useEffect } from "react";
import { tblHeaderBrands } from "../../static-data/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/StaffView";
import { getHandler } from "../../util/handler";

export default function StaffTbl() {
  //
  const dispatch = useDispatch();
  const staff = useSelector((state) => state.staffView.staff);
  const allChecked = useSelector((state) => state.staffView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/staff");
      dispatch(setCurrentView({ view: "staff", data: data.data.staff }));
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
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(checkAll())}
              />
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
          {staff && staff?.map((item, ind) => {
            return (
              <tr key={item._id} className="tr_tbody">
                <td className="td">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td>
                {/* below padding may apply to all */}
                <td className="py-1.125">{ind}</td>
                <td className="py-1.125">{"item.name"}</td>
                <td className="py-1.125">{"item.generic"}</td>
                <td className="py-1.125">{"item.group"}</td>
                <td className="py-1.125">{"item.mfr"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
