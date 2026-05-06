import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { tblHeadergroups } from "../../ui-config/table";
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
import { useTableQuery } from "../../hooks/useTableQuery";

export default function GroupTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.drugsView.refreshKey);
  const query = useTableQuery({
    endpoint: "/groups",
    onLoaded: (data) =>
      dispatch(setCurrentView({ view: ENTITIES.group, data })),
  });
  const groups = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.group);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (refreshKey > 0) query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search groups..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Group"
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
              {tblHeadergroups.map((itm, ind) => (
                <th key={ind} className="th">
                  {itm}
                </th>
              ))}
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((item, ind) => (
              <tr key={item._id ?? ind} className="tr-tbody">
                <td className="py-4">{offset + ind + 1}</td>
                <td className="py-4">{item.name}</td>
                <td className="py-4 flex justify-center gap-2">
                  <RowActions
                    label="group"
                    endpoint={`/groups/${item._id}`}
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
