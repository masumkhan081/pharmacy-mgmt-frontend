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
import { reset } from "../../redux/slices/User";
//
export default function NavTop() {
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  function handleLogout() {
    setDropDown(false);
    dispatch(reset());
    localStorage.removeItem("user");
    localStorage.removeItem("expansion");
    localStorage.removeItem("lastRoute");
    navigate("/auth/login");

    // getHandler("/auth/logout").then((data) => {
    // }).catch((err) => {
    // });
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
    <div className=" sm:px-3.0 px-1.0 flex justify-between items-center py-2 teal-950 font-semibold text-1/1.25 rounded-b-md">
      <div className="flex gap-2 items-center">
        {/* <button onClick={() => fetchData()}>Fetch</button> */}
        <CustomLink to="/" txt="Pharmacy Mgmt Syst" style="brand">
          <MdLocalPharmacy className="w-5 h-5 text-blue-700" />
        </CustomLink>
      </div>

      {!isAuthenticated && (
        <Button
          onClick={() => {
            navigate("/auth/login");
          }}
          txt="Log In"
          // endIcon={<HiLogin className="nav_icn text-blue-700" />}
          style={"btn_nav"}
        />
      )}
      {isAuthenticated && (
        <Button
          onClick={() => setDropDown(!dropDown)}
          icon={
            dropDown ? (
              <AiOutlineClose className="nav_icn text-orange-800" />
            ) : (
              <CgProfile className="nav_icn text-blue-700" />
            )
          }
          style={"btn_nav"}
        />
      )}

      {isAuthenticated && dropDown && (
        <div className="flex flex-col gap-4 sm:px-4 px-2 py-4 absolute z-10 sm:w-[300px] w-1/2  left-auto right-0 top-[40px] h-auto border rounded-md bg-slate-200">
          <Button
            txt={"Profile"}
            onClick={() => {
              navigate("/auth/profile");
            }}
            icon={<CgProfile className="nav_icn text-blue-700" />}
            style={"btn_nav"}
          />
          <Button
            txt={"Logout"}
            onClick={() => handleLogout()}
            icon={<HiLogout className="nav_icn text-red-950" />}
            style={
              "flex items-center flex-wrap overflow-hidden gap-1 text-center px-2 py-1 rounded-md text-sm flex gap-2 text-red-800 border border-red-950"
            }
          />
        </div>
      )}
    </div>
  );
}
