import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavTop from "../components/partials/NavTop";
import Footer from "../components/partials/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/User";

export default function Layout() {
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loadUserFromStorage = () => {
    //
    const storedUser = localStorage.getItem("user");
    const lastRoute = localStorage.getItem("lastRoute");
    if (storedUser) {

      dispatch(setUser(JSON.parse(storedUser))); // store user in Redux store
      if (lastRoute) {
        navigate(lastRoute);
      } else if (["admin", "super-admin", "manager"].includes(userRole)) {
        navigate("/dashboard");
      } else if (userRole === "salesman") {
        navigate("/drugs/stock");
      }
    } else {
      console.log("inside:else - ");
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <div className="bg-blue-100 max-w-[1600px] mx-auto rounded-md h-screen flex flex-col">
      <NavTop />
      <Outlet />
      <Footer />
    </div>
  );
}
