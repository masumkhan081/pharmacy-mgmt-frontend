import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch,
  useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setCurrentView,
  toggleModal,
  setModaldata,
  bumpRefresh,
} from "../../redux/slices/InventoryView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from '../../hooks/useTableData';

const headers = ["#", "Drug", "Min", "Max", "Reorder pt", "Reorder qty", "Auto", "Active"];

export default function InventoryAlertTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.inventoryView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/inventory-alerts",
    onLoaded: () => dispatch(setCurrentView({ view: ENTITIES.inventoryAlert,
    onLoaded: (data) => dispatch(setCurrentView({ view: ENTITIES.inventoryAlert, data })),
  })),
  });
  const items = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.inventoryAlert);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search alerts..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Alert"
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
              {headers.map((h, i) => (
                <th key={i} className="th">{h}</th>
              ))}
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, ind) => (
              <tr key={item.id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.drug?.name ?? "—"}</td>
                <td className="py-4">{item.minThreshold ?? "—"}</td>
                <td className="py-4">{item.maxThreshold ?? "—"}</td>
                <td className="py-4">{item.reorderPoint ?? "—"}</td>
                <td className="py-4">{item.reorderQuantity ?? "—"}</td>
                <td className="py-4">{item.autoReorder ? "Yes" : "No"}</td>
                <td className="py-4">{item.isActive ? "Yes" : "No"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="alert"
                    endpoint={`/inventory-alerts/${item.id}`}
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
