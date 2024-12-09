import React from "react";

export default function Title({ txt, icon, children, style }) {
  return (
    <p className={`${style}  items-center `}>
      {icon}
      <span className=" text-center">{txt}</span>
      <>{children}</>
    </p>
  );
}
