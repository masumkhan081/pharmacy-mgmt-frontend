import { Outlet } from "react-router-dom";
import NavLeft from "../components/partials/NavLeft";
import { } from "../redux/slices/User";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
//
export default function Landing() {

  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);

  useEffect(() => {
    console.log(userRole);
    if (userRole == "admin" || userRole == "super-admin" || userRole == "manager") {
      navigate("/dashboard");
    }
    else if (userRole == "salesman") {
      navigate("/drugs/brands")
    }
    else {
      navigate("/auth/login");
      // navigate("/drugs/brands")
    }
  }, [])

  return (
    <div className="w-full h-full  grid grid-cols-5 ">
      <NavLeft />
      <div className="col-span-4 px-2.0 bg-wh">
        <Outlet />
      </div>
    </div>
  );
}
