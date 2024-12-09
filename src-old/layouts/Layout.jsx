import React from "react";
import { Outlet } from "react-router-dom";
import NavTop from "../components/nav/NavTop";

export default function Layout() {
  return (
    <div className="w-full h-screen flex flex-col">
      <NavTop />
      <Outlet />
    </div>
  );
}
