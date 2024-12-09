import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ txt, icon, to,children,style }) {
  return (
    <Link to={to} className={style} >
      {icon}  
      {children}
      {txt}
    </Link>
  );
}
