import { useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { deleteHandler } from "../../utils/handlerReqRes";

export default function RowActions({
  onEdit,
  endpoint,
  label = "record",
  onAfterDelete,
  noDelete = false,
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await deleteHandler(endpoint);
      onAfterDelete?.();
    } catch (err) {
      console.error(`Failed to delete ${label}:`, err.message);
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <>
      {onEdit && (
        <Button aria-label={`Edit ${label}`} onClick={onEdit}>
          <AiFillEdit className="w-5 h-5 text-primary-600 hover:text-primary-700 transition-colors cursor-pointer" />
        </Button>
      )}
      {!noDelete && (
        <>
          <Button
            aria-label={`Delete ${label}`}
            onClick={() => setConfirming(true)}
            disabled={busy}
          >
            <AiFillDelete className="w-5 h-5 text-error-600 hover:text-error-700 transition-colors cursor-pointer" />
          </Button>
          <ConfirmDialog
            isVisible={confirming}
            title={`Delete ${label}`}
            message={`Are you sure you want to delete this ${label}? This cannot be undone.`}
            confirmTxt="Delete"
            onConfirm={handleDelete}
            onCancel={() => setConfirming(false)}
          />
        </>
      )}
    </>
  );
}
