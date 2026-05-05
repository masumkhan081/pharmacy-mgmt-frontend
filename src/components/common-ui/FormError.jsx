import React from "react";

export default function FormError({ message, className = "" }) {
  if (!message) return null;
  return (
    <span className={`text-sm text-error-600 mt-1 ${className}`}>{message}</span>
  );
}

export function FormErrorBanner({ message }) {
  if (!message) return null;
  return (
    <p className="text-sm text-error-600 bg-error-50 px-4 py-2 rounded-lg">
      {message}
    </p>
  );
}
