import React, { useEffect } from "react";
import { tblHeaderPurch } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/purchView";
import { getHandler } from "../../utils/handlerReqRes";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";
import Input from "../common-ui/Input";

export default function PurchTbl() {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const purchases = useSelector((state) => state.purchView.purchases);
  const allChecked = useSelector((state) => state.purchView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/purchases");
        dispatch(setCurrentView({ view: ENTITIES.purchase, data }));
      } catch (err) {
        console.error("Failed to fetch purchases:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.purchase);
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
            {tblHeaderPurch.map((itm, ind) => {
              return (
                <th key={ind} className="th">
                  {itm}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {purchases && purchases.map((item, ind) => {
            return (
              <tr key={item._id} className="tr-tbody">
                <td className="td">
                  <Input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td>
                <td className="py-4">
                  {item.purchaseAt ? new Date(item.purchaseAt).toLocaleString() : "—"}
                </td>
                <td className="py-4">{item.bill ?? "—"}</td>
                <td className="py-4">—</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
