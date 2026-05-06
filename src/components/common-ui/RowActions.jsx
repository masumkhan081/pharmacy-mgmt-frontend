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
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      {onEdit && (
        <Button aria-label={`Edit ${label}`} onClick={onEdit}>
          <AiFillEdit className="w-5 h-5 text-primary-600 hover:text-primary-700 transition-colors cursor-pointer" />
        </Button>
      )}
      <Button
        aria-label={`Delete ${label}`}
        onClick={() => setConfirming(true)}
      >
        <AiFillDelete className="w-5 h-5 text-error-600 hover:text-error-700 transition-colors cursor-pointer" />
      </Button>
      <ConfirmDialog
        isVisible={confirming}
        title={`Delete ${label}`}
        message={`Are you sure you want to delete this ${label}? This cannot be undone.`}
        confirmTxt="Delete"
        onConfirm={async () => {
          await deleteHandler(endpoint);
          onAfterDelete?.();
        }}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
