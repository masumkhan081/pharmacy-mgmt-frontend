import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";

export default function CrudActionsCell({
  onEdit,
  onDelete,
  entityLabel = "item",
  canEdit = true,
  canDelete = true,
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {canEdit && onEdit && (
        <Button
          type="button"
          onClick={onEdit}
          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          icon={<FiEdit2 className="w-4 h-4" />}
        />
      )}
      {canDelete && onDelete && (
        <Button
          type="button"
          onClick={() => setConfirming(true)}
          className="p-2 text-neutral-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
          icon={<FiTrash2 className="w-4 h-4" />}
        />
      )}
      <ConfirmDialog
        isVisible={confirming}
        title={`Delete ${entityLabel}`}
        message={`This ${entityLabel} will be permanently removed. Continue?`}
        confirmTxt="Delete"
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
