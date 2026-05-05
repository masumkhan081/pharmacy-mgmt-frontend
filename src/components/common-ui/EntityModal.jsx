import React from "react";
import ModalWrapper from "../modals/ModalWrapper";

export default function EntityModal({
  isVisible,
  mode = "create",
  entityLabel = "Entity",
  onClose,
  children,
}) {
  const verb = mode === "edit" ? "Edit" : "Create";
  return (
    <ModalWrapper
      isVisible={isVisible}
      title={`${verb} ${entityLabel}`}
      onClose={onClose}
    >
      {children}
    </ModalWrapper>
  );
}
