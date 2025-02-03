import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import menu from "../../assets/icons/menu.svg";
import close from "../../assets/icons/close.svg";
import CustomLink from "../common-ui/CustomLink";
import Button from "../common-ui/Button";
import ProjectList from "../ProjectList";
import { MdLocalPharmacy } from "react-icons/md";
import { BiSolidUserPlus, BiUserPlus, BiLogInCircle } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { AiFillHome, AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { getHandler } from "../../utils/handler"

export default function NavTop() {

  const [dropDown, setDropDown] = useState(false);
  const [menuFolded, setMenuFolded] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.authenticated);

  function handleLogout() {
    toAuthForm(false);
    setMenuFolded(true);
    dispatch(setUser(null));  // Clear Redux store
    localStorage.removeItem("user"); // Remove from localStorage
    navigate("/login");  // Redirect to login page
    getHandler("/auth/logout").then((data) => {

    }).catch((err) => {

    });
  }


  const styLogic = () =>
    menuFolded
      ? "sm:flex hidden  sm:grow  gap-4 justify-end items-center text-green-800 "
      : "sm:hidden block absolute top-[52px] left-[10px] right-[10px] rounded-md  h-auto flex flex-col gap-4 bg-green-200 border border-br/600 px-4 py-4";

  async function fetchData() {
    alert("hi hello !")
    // https://pharmacy-mgmt-backend.onrender.com
    const data = await getHandler("/units");
    alert(`--log-- ` + JSON.stringify(data.data.data))
  }

  return (
    <div className=" sm:px-3.0 px-1.0 flex justify-between items-center py-2 teal-950 font-semibold text-1/1.25 rounded-b-md">
      <div className="flex gap-2 items-center">
        {/* <button onClick={() => fetchData()}>Fetch</button> */}
        <CustomLink to="/" txt="Pharmacy Mgmt Syst" style="brand">
          <MdLocalPharmacy className="w-5 h-5 text-blue-700" />
        </CustomLink>
      </div>
      <div className={styLogic()}>
        {/* <Button
          onClick={() => setDropDown(!dropDown)}
          txt="Other Projects"
          icon={<BsListNested className="nav_icn" />}
          style={"btn_nav"}
        /> */}
        {!isAuthenticated && (
          <Button
            onClick={() => {
              setMenuFolded(true);
              navigate("/auth/login")
            }}
            txt="Log In"
            icon={<BiLogInCircle className="nav_icn" />}
            style={"btn_nav"}
          />
        )}

        {isAuthenticated && (
          <Button
            onClick={
              handleLogout
            }
            txt="Log Out"
            icon={<RiLogoutCircleRLine className="nav_icn" />}
            style={"btn_nav"}
          />
        )}

        <div className={dropDown ? "nav_drop_down" : `hidden`}>
          <ProjectList
            onClose={() => {
              setDropDown(false);
              setMenuFolded(true);
            }}
          />
        </div>
      </div>
      <div className="sm:hidden block">
        <Button
          icon={
            menuFolded ? (
              <GiHamburgerMenu className="nav_icn" />
            ) : (
              <AiOutlineClose className="nav_icn" />
            )
          }
          onClick={() => setMenuFolded(!menuFolded)}
        />
      </div>
    </div>
  );
}
