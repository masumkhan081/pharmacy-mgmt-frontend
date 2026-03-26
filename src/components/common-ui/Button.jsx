import React from "react";

export default function Button({ 
  onClick, 
  txt, 
  icon, 
  style, 
  className,
  type = "button", 
  endIcon, 
  disabled,
  children,
  ...props 
}) {
  const buttonClass = className || style || "btn_test_data";
  
  return (
    <button 
      onClick={onClick} 
      className={buttonClass} 
      type={type}
      disabled={disabled}
      {...props}
    >
      {icon}
      {txt || children}
      {endIcon}
    </button>
  );
}
