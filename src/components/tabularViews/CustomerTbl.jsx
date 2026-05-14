import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  toggleModal,
  setModaldata,
  bumpRefresh,
} from "../../redux/slices/CustomerView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from '../../hooks/useTableData';

const headers = ["#", "Name", "Phone", "Email", "Loyalty"];

export default function CustomerTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.customerView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/customers" });
  const items = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.customer);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search customers..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Customer"
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
                <td className="py-4">{item.fullName ?? "—"}</td>
                <td className="py-4">{item.phone ?? "—"}</td>
                <td className="py-4">{item.email ?? "—"}</td>
                <td className="py-4">{item.loyaltyPoints ?? 0}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="customer"
                    endpoint={`/customers/${item.id}`}
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
