import React, { useEffect } from "react";
import { tblHeaderSales } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import { checkSingle, checkAll, setCurrentView } from "../../redux/slices/saleView";
import { getHandler } from "../../utils/handlerReqRes";
import { ENTITIES } from "../../ui-config/entities";
import { useLocation } from "react-router-dom";
import Input from "../common-ui/Input";

export default function SaleRecTbl({ }) {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.saleView.sales);
  const allChecked = useSelector((state) => state.saleView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/sales");
        dispatch(setCurrentView({ view: ENTITIES.sale, data }));
      } catch (err) {
        console.error("Failed to fetch sales:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.sale);
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
            {tblHeaderSales.map((itm, ind) => {
              return (
                <th key={ind} className="th">
                  {itm}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sales && sales.map((item, ind) => {
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
                  {item.saleAt ? new Date(item.saleAt).toLocaleString() : "—"}
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
