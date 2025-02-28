import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavTop from "../components/partials/NavTop";
import Footer from "../components/partials/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/User";
import { ROLES } from "../ui-config/user.roles"

export default function RootLayout() {
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
      } else if ([ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.PHARMACIST, ROLES.MANAGER].includes(userRole)) {
        navigate("/dashboard");
      } else if (userRole === ROLES.SALESMAN) {
        navigate("/drugs/stock");
      }
    } else {
      console.log("inside:else - ");
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    console.log("lout-effect...")
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
