import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../common-ui/Button";

export default function ModalWrapper({ 
  title, 
  isVisible, 
  onClose, 
  children
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-800 text-center flex-1">
            {title}
          </h2>
          <Button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
            type="button"
          >
            <AiOutlineClose className="w-5 h-5" />
          </Button>
        </div>

        {/* Content area - scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
