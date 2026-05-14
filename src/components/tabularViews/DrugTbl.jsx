import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { tblHeaderDrugs } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setCurrentView,
  toggleModal,
  setModaldata,
  bumpRefresh,
} from "../../redux/slices/DrugsView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from '../../hooks/useTableData';

export default function DrugTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.drugsView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/drugs",
    onLoaded: (data) =>
      dispatch(setCurrentView({ view: ENTITIES.stock, data })),
  });
  const stock = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.stock);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search drugs..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Stock"
          onClick={() =>
            dispatch(toggleModal({ isModalForEdit: false, isModalVisible: true }))
          }
          style="btn-primary"
        />
      }
    >
      <div className="table-shell">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="tr-thead">
              <th className="th">#</th>
              {tblHeaderDrugs.map((itm, ind) => (
                <th key={ind} className="th">
                  {itm}
                </th>
              ))}
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item, ind) => (
              <tr key={item.id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.brandId ?? "—"}</td>
                <td className="py-4">{item.generic?.name ?? "—"}</td>
                <td className="py-4">{item.available ?? "—"}</td>
                <td className="py-4">
                  {[item.strength, item.unit?.name].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="py-4">{item.formulation?.name ?? "—"}</td>
                <td className="py-4">{item.manufacturer?.name ?? "—"}</td>
                <td className="py-4">{item.status ?? "—"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="drug"
                    endpoint={`/drugs/${item.id}`}
                    onEdit={() => {
                      dispatch(setModaldata(item));
                      dispatch(toggleModal({ isModalForEdit: true, isModalVisible: true }));
                    }}
                    onAfterDelete={() => dispatch(bumpRefresh())}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}
