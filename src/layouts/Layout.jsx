import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavTop from "../components/partials/NavTop";
import Footer from "../components/partials/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/User";

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser))); // Restore user in Redux store
    } else {
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
