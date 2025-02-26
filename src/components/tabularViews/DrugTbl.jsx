import { useEffect } from "react";
import { tblHeaderDrugs, tblOptionsDrugsPage } from "../../static-data/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/DrugsView";
import { getHandler } from "../../utils/handler";
import { useLocation } from "react-router-dom";

export default function DrugTbl() {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.drugsView.stock);
  const allChecked = useSelector((state) => state.drugsView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/stock");
      dispatch(setCurrentView({ view: tblOptionsDrugsPage.stock, data: data?.data?.stock }));
    };
    fetch();
    // 
    localStorage.setItem('activeTab', tblOptionsDrugsPage.stock);
    localStorage.setItem('lastRoute', location.pathname);
  }, []);
  //
  return (
    <div className="w-full border rounded-md border-teal-600 overflow-x-scroll">
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
                <tr key={ind} className="tr_tbody">
                  <td className="td">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => dispatch(checkSingle())}
                    />
                  </td>

                  <td className="py-1.125">{ind}</td>
                  <td className="py-1.125">{item.brandId}</td>
                  <td className="py-1.125">{"item.generic.name"}</td>
                  <td className="py-1.125">{item.available}</td>
                  <td className="py-1.125">
                    {item.strength + " " + "item.unit.name"}
                  </td>
                  <td className="py-1.125">{"item.formulation.name"}</td>
                  <td className="py-1.125">{"item.manufacturer"}</td>
                  <TD2 txt={item.status} />
                </tr>
              );
            })}
        </tbody>
      </table>
      {JSON.stringify(stock)}
    </div>
  );
}
