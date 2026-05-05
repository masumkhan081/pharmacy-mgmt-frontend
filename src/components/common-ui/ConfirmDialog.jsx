import React, { useState } from "react";
import ModalWrapper from "../modals/ModalWrapper";
import Button from "./Button";

export default function ConfirmDialog({
  isVisible,
  title = "Confirm",
  message = "Are you sure you want to proceed?",
  confirmTxt = "Confirm",
  cancelTxt = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setBusy(true);
    setError("");
    try {
      await onConfirm?.();
    } catch (err) {
      setError(err?.message ?? "Action failed");
      return;
    } finally {
      setBusy(false);
    }
    onCancel?.();
  }

  const confirmClass =
    variant === "danger"
      ? "px-4 py-2 text-sm font-medium text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors duration-200 disabled:opacity-60"
      : "btn-primary disabled:opacity-60";

  return (
    <ModalWrapper title={title} isVisible={isVisible} onClose={onCancel}>
      <div className="flex flex-col gap-4">
        <p className="text-neutral-700 text-sm">{message}</p>
        {error && (
          <p className="text-sm text-error-600 bg-error-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
            txt={cancelTxt}
          />
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className={confirmClass}
            txt={busy ? "Working..." : confirmTxt}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
