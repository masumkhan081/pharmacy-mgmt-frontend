import Image from "next/image";
import React from "react";

export default function NavLink({ href, txt, icon, active, download }) {
  return (
    <a
      href={href}
      download={download}
      className={
        active
          ? ` nav_link shadow shadow-slate-400 rounded-md`
          : `nav_link`
      }
    >
      <span className="text-opacity-50">{icon}</span>
      {txt}
    </a>
  );
}
