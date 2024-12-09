import React, { useEffect } from "react";
import { tblHeaderPurch } from "../../static-data/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/purchView";
import { getHandler } from "../../util/handler";

export default function PurchTbl() {
  //
  const dispatch = useDispatch();
  const purchases = useSelector((state) => state.purchView.purchases);
  const allChecked = useSelector((state) => state.purchView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/purchases");
      dispatch(
        setCurrentView({ view: "purchases", data: data.data.purchases })
      );
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
                <td className="py-1.125">{"item.generic.name"}</td>
                <td className="py-1.125">{"item.available"}</td>
                <td className="py-1.125">
                  {"item.strength" + " item.unit.name"}
                </td>
                <td className="py-1.125">{"item.formulation.name"}</td>
                <td className="py-1.125">{"item.manufacturer"}</td>
                {/* <TD2 txt={item.status} /> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
