import { useEffect } from "react";
import { useDispatch,
  useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setCurrentView,
  bumpRefresh,
} from "../../redux/slices/FinanceView";
import { ENTITIES } from "../../ui-config/entities";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from '../../hooks/useTableData';

// Invoices are server-derived from completed sales — no Add button, no Edit.
// Delete is permitted on the BE only when paidAmount === 0.
const headers = ["#", "Invoice #", "Sale", "Total", "Paid", "Status"];

export default function InvoiceTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.financeView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/invoices",
    onLoaded: (data) =>
      dispatch(setCurrentView({ view: ENTITIES.invoice, data })),
  });
  const items = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.invoice);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell query={query} searchPlaceholder="Search invoices...">
      <div className="table-shell">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="tr-thead">
              {headers.map((h, i) => (
                <th key={i} className="th">
                  {h}
                </th>
              ))}
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, ind) => (
              <tr key={item.id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.invoiceNo ?? "—"}</td>
                <td className="py-4">
                  {item.sale?.saleNumber ?? item.saleId ?? "—"}
                </td>
                <td className="py-4">{item.totalAmount ?? "—"}</td>
                <td className="py-4">{item.paidAmount ?? 0}</td>
                <td className="py-4">{item.status ?? "—"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="invoice"
                    endpoint={`/invoices/${item.id}`}
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
