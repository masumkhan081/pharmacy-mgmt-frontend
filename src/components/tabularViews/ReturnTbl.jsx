import { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleModal, bumpRefresh } from "../../redux/slices/ReturnView";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import TableShell from "../common-ui/TableShell";
import RowActions from "../common-ui/RowActions";
import { useTableData } from "../../hooks/useTableData";
import { postHandler } from "../../utils/handlerReqRes";

const headers = ["#", "Number", "Type", "Total", "Status"];

function ReturnWorkflowActions({ row, userId, onChanged }) {
  const [busy, setBusy] = useState(false);

  if (row.status !== "PENDING") return null;

  const act = async (verb) => {
    if (!userId || busy) return;
    setBusy(true);
    try {
      const body =
        verb === "approve" ? { approvedBy: userId } : { rejectedBy: userId };
      await postHandler(`/returns/${row.id}/${verb}`, body);
      onChanged?.();
    } catch (err) {
      console.error(`Failed to ${verb} return:`, err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        aria-label="Approve return"
        onClick={() => act("approve")}
        disabled={busy || !userId}
      >
        <AiOutlineCheck className="w-5 h-5 text-success-600 hover:text-success-700 transition-colors cursor-pointer" />
      </Button>
      <Button
        aria-label="Reject return"
        onClick={() => act("reject")}
        disabled={busy || !userId}
      >
        <AiOutlineClose className="w-5 h-5 text-warning-600 hover:text-warning-700 transition-colors cursor-pointer" />
      </Button>
    </>
  );
}

export default function ReturnTbl() {
  const location = useLocation();
  const dispatch = useDispatch();
  const refreshKey = useSelector((s) => s.returnView.refreshKey);
  const userId = useSelector((s) => s.user?.userId);
  const query = useTableData({
    refreshKey,
    endpoint: "/returns",
  });
  const items = query.data;
  const offset =
    ((query.meta?.page || query.page) - 1) * (query.meta?.limit || query.pageSize);

  useEffect(() => {
    localStorage.setItem("activeTab", ENTITIES.return);
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <TableShell
      query={query}
      searchPlaceholder="Search returns..."
      toolbar={
        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt=" Return"
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
                <td className="py-4">{item.returnNumber ?? "—"}</td>
                <td className="py-4">{item.returnType ?? "—"}</td>
                <td className="py-4">{item.totalAmount ?? "—"}</td>
                <td className="py-4">{item.status ?? "—"}</td>
                <td className="py-4 flex justify-center gap-2">
                  <ReturnWorkflowActions
                    row={item}
                    userId={userId}
                    onChanged={() => dispatch(bumpRefresh())}
                  />
                  <RowActions
                    label="return"
                    endpoint={`/returns/${item.id}`}
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
