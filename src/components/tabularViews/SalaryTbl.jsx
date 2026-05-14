import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setCurrentView,
  toggleModal,
  setModaldata,
  bumpRefresh,
} from "../../redux/slices/StaffView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from '../../hooks/useTableData';

const headers = ["#", "Staff", "Month", "Year", "Due", "Paid"];

export default function SalariesTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.staffView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/salaries",
    onLoaded: (data) =>
      dispatch(setCurrentView({ view: ENTITIES.salary, data })),
  });
  const salaries = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.salary);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search salaries..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Salary"
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
            {salaries.map((item, ind) => (
              <tr key={item.id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.staff?.fullName ?? item.staff ?? "—"}</td>
                <td className="py-4">{item.month ?? "—"}</td>
                <td className="py-4">{item.year ?? "—"}</td>
                <td className="py-4">{item.dueAmount ?? "—"}</td>
                <td className="py-4">{item.paidAmount ?? "—"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="salary"
                    endpoint={`/salaries/${item.id}`}
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
