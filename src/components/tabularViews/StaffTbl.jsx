import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { tblHeaderStaff } from "../../ui-config/table";
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

export default function StaffTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.staffView.refreshKey);
  const query = useTableData({
    refreshKey,
    endpoint: "/staff",
    onLoaded: (data) =>
      dispatch(setCurrentView({ view: ENTITIES.member, data })),
  });
  const staff = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.member);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search staff..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Member"
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
              {tblHeaderStaff.map((itm, ind) => (
                <th key={ind} className="th">
                  {itm}
                </th>
              ))}
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((item, ind) => (
              <tr key={item.id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.fullName ?? item.name ?? "—"}</td>
                <td className="py-4">{item.designation ?? item.role ?? "—"}</td>
                <td className="py-4">{item.email ?? "—"}</td>
                <td className="py-4">{item.phone ?? "—"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="member"
                    endpoint={`/staff/${item.id}`}
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
