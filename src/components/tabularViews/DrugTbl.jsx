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
      const data = await getHandler("/stock");
      dispatch(setCurrentView({ view: ENTITIES.stock, data: data?.data?.stock }));
    };
    fetch();
    // 
    localStorage.setItem('activeTab', ENTITIES.stock);
    localStorage.setItem('lastRoute', location.pathname);
  }, []);
  //
  return (
    <div className="w-full border border-primary-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <table className="w-full ">
        <thead>
          <tr className="tr_thead">
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
                <tr key={ind} className="tr_tbody">
                  <td className="td">
                    <Input
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
