import React, { useEffect } from "react";
import { tblHeaderSales} from "../../static-data/table";
import { useDispatch, useSelector } from "react-redux";
import { checkSingle, checkAll, setCurrentView } from "../../redux/slices/saleView";
import { getHandler } from "../../util/handler";

export default function SaleRecTbl({}) {
  //
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.saleView.sales);
  const allChecked = useSelector((state) => state.saleView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/sales");
      dispatch(setCurrentView({ view: "sales", data: data.data.sales }));
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
          {sales && sales.map((item,ind) => {
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
                <td className="py-1.125">{"item.serial"}</td>
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
