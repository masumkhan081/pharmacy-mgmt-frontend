import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomLink from "../common-ui/CustomLink";
import Button from "../common-ui/Button";
import { MdLocalPharmacy } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { HiLogout, HiLogin } from "react-icons/hi";
import { getHandler } from "../../utils/handlerReqRes";
import { setAuthToken } from "../../utils/apiClient";
import { reset } from "../../redux/slices/User";
//
export default function NavTop() {
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  function handleLogout() {
    setDropDown(false);
    setAuthToken(null);
    dispatch(reset());
    localStorage.removeItem("user");
    localStorage.removeItem("expansion");
    localStorage.removeItem("lastRoute");
    navigate("/auth/login");
  }

  // function toggleProfileMenu() {}

  // async function fetchData() {
  //   // https://pharmacy-mgmt-backend.onrender.com
  //   const data = await getHandler("/units");
  //   alert(`--log-- ` + JSON.stringify(data.data.data));
  // }

  // useEffect(() => {
  //   alert("isAuthenticated has changed:", isAuthenticated);
  // }, [isAuthenticated]);

  return (
    <div className="sm:px-6 px-4 flex justify-between items-center py-3 bg-white border-b border-neutral-200 shadow-sm">
      <div className="flex gap-2 items-center">
        {/* <button onClick={() => fetchData()}>Fetch</button> */}
        <CustomLink to="/" txt="Pharmacy Mgmt Syst" style="brand">
          <MdLocalPharmacy className="w-6 h-6 text-primary-600" />
        </CustomLink>
      </div>

      {!isAuthenticated && (
        <Button
          onClick={() => {
            navigate("/auth/login");
          }}
          txt="Log In"
          // endIcon={<HiLogin className="nav-icon text-blue-700" />}
          style={"btn-nav"}
        />
      )}
      {isAuthenticated && (
        <Button
          onClick={() => setDropDown(!dropDown)}
          icon={
            dropDown ? (
              <AiOutlineClose className="nav-icon text-warning" />
            ) : (
              <CgProfile className="nav-icon text-info" />
            )
          }
          style={"btn-nav"}
        />
      )}

      {isAuthenticated && dropDown && (
        <div className="flex flex-col gap-2 px-4 py-3 absolute z-10 sm:w-[300px] w-1/2 left-auto right-0 top-[52px] h-auto border border-neutral-200 rounded-lg bg-white shadow-lg">
          <Button
            txt={"Profile"}
            onClick={() => {
              navigate("/auth/profile");
            }}
            icon={<CgProfile className="nav-icon text-primary-600" />}
            style={"btn-nav"}
          />
          <Button
            txt={"Logout"}
            onClick={() => handleLogout()}
            icon={<HiLogout className="nav-icon text-error-600" />}
            style={
              "flex items-center gap-2 text-error-600 hover:bg-error-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            }
          />
        </div>
      )}
    </div>
  );
}
