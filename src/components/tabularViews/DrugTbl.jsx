import { useEffect } from "react";
import { tblHeaderDrugs, tblOptionsDrugsPage } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/DrugsView";
import { getHandler } from "../../utils/handlerReqRes";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";
import Input from "../common-ui/Input";

export default function DrugTbl() {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.drugsView.stock);
  const allChecked = useSelector((state) => state.drugsView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/drugs");
        dispatch(setCurrentView({ view: ENTITIES.stock, data }));
      } catch (err) {
        console.error("Failed to fetch stock:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.stock);
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
            {tblHeaderDrugs.map((itm, ind) => {
              return (
                <th key={ind} className="th">
                  {itm}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {stock &&
            stock?.map((item, ind) => {
              return (
                <tr key={item._id ?? ind} className="tr-tbody">
                  <td className="td">
                    <Input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => dispatch(checkSingle())}
                    />
                  </td>

                  <td className="py-4">{ind + 1}</td>
                  <td className="py-4">{item.brandId ?? "—"}</td>
                  <td className="py-4">{item.generic?.name ?? "—"}</td>
                  <td className="py-4">{item.available ?? "—"}</td>
                  <td className="py-4">
                    {[item.strength, item.unit?.name].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="py-4">{item.formulation?.name ?? "—"}</td>
                  <td className="py-4">{item.manufacturer?.name ?? "—"}</td>
                  <td className="py-4">{item.status ?? "—"}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
