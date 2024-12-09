import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Auth() {
  return (
    <div className="w-full h-full  ">
      <Outlet />
    </div>
  );
}
