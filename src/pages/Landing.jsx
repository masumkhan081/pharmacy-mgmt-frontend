import { Outlet } from "react-router-dom";
import NavLeft from "../components/partials/NavLeft";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
//
export default function Landing() {

  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);

  useEffect(() => {
    if (userRole) {
      if (["admin", "super-admin", "manager"].includes(userRole)) {
        navigate("/dashboard");
      } else if (userRole === "salesman") {
        navigate("/drugs/stock");
      } else {
        navigate("/auth/login");
      }
    }
  }, [userRole, navigate]);

  return (
    <div className="w-full h-full  grid grid-cols-5 ">
      <NavLeft />
      <div className="col-span-4 px-2.0 bg-wh">
        <Outlet />
      </div>
    </div>
  );
}
