import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  toggleModal,
  setModaldata,
  bumpRefresh,
} from "../../redux/slices/PrescriptionView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableQuery } from "../../hooks/useTableQuery";

const headers = ["#", "Number", "Customer", "Doctor", "Issued", "Expiry", "Status"];

export default function PrescriptionTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.prescriptionView.refreshKey);
  const query = useTableQuery({ endpoint: "/prescriptions" });
  const items = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.prescription);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (refreshKey > 0) query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search prescriptions..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Prescription"
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
              <tr key={item._id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.prescriptionNumber ?? "—"}</td>
                <td className="py-4">{item.customer?.fullName ?? "—"}</td>
                <td className="py-4">{item.doctor?.fullName ?? "—"}</td>
                <td className="py-4">{item.issueDate ? new Date(item.issueDate).toLocaleDateString() : "—"}</td>
                <td className="py-4">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
                <td className="py-4">{item.status ?? "—"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="prescription"
                    endpoint={`/prescriptions/${item._id}`}
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
