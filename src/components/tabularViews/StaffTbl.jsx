import React, { useEffect } from "react";
import { tblHeaderStaff } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/StaffView";
import { getHandler } from "../../utils/handlerReqRes";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";
import Input from "../common-ui/Input";

export default function StaffTbl() {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const staff = useSelector((state) => state.staffView.staff);
  const allChecked = useSelector((state) => state.staffView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/staff");
        dispatch(setCurrentView({ view: ENTITIES.member, data }));
      } catch (err) {
        console.error("Failed to fetch staff:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.member);
    localStorage.setItem("lastRoute", location.pathname);
  }, []);
  //
  return (
    <div className="table-shell">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="tr-thead">
            <th className="th">
              <Input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(checkAll())}
              />
            </th>
            {tblHeaderStaff.map((itm, ind) => {
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
              <tr key={item._id} className="tr-tbody">
                <td className="td">
                  <Input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td>
                {/* below padding may apply to all */}
                <td className="py-4">{ind + 1}</td>
                <td className="py-4">{item.name ?? "—"}</td>
                <td className="py-4">{item.role ?? "—"}</td>
                <td className="py-4">{item.email ?? "—"}</td>
                <td className="py-4">{item.phone ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
