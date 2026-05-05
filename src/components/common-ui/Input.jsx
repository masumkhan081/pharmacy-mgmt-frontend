import React from "react";

export default function Input({ 
  id, 
  type = "text", 
  pc, 
  placeholder,
  style, 
  className,
  value, 
  onChange,
  name,
  required,
  disabled,
  title,
  onBlur,
  onFocus,
  checked,
  ...props 
}) {
  const inputClass = className || (style ? `txt-input ${style}` : "txt-input");
  
  return (
    <input
      id={id}
      name={name}
      type={type}
      className={inputClass}
      placeholder={placeholder || pc}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      title={title}
      checked={checked}
      {...props}
    />
  );
}
