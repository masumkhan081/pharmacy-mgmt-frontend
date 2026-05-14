import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { tblHeaderSales } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setCurrentView,
  toggleModal,
  setModaldata,
  bumpRefresh,
} from "../../redux/slices/saleView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from '../../hooks/useTableData';

export default function SaleRecTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.saleView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/sales",
    onLoaded: (data) =>
      dispatch(setCurrentView({ view: ENTITIES.sale, data })),
  });
  const sales = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.sale);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search sales..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Sale"
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
              {tblHeaderSales.map((itm, ind) => (
                <th key={ind} className="th">
                  {itm}
                </th>
              ))}
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((item, ind) => (
              <tr key={item.id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">
                  {item.saleAt ? new Date(item.saleAt).toLocaleString() : "—"}
                </td>
                <td className="py-4">{item.bill ?? "—"}</td>
                <td className="py-4">{item.drugs?.length ?? 0} items</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="sale"
                    endpoint={`/sales/${item.id}`}
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
