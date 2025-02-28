import React from "react";
import Label from "../common-ui/Label";
import { postHandler } from "../../utils/handlerReqRes";
//  icons
import eye from "../../assets/icons/eye.svg";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Input from "../common-ui/Input";
import Button from "../common-ui/Button";
import { users } from "../../ui-config/test.users"
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../../redux/slices/User";
import { useNavigate } from 'react-router-dom'
//
export default function Login() {
  //  
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const status = location.state?.loginView;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const foundUser = users.find(user =>
      (user.userName === userName || user.userEmail === userName) && user.password === password
    );
    if (foundUser) {
      const { userRole } = foundUser
      dispatch(setUser(foundUser));
      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));

      if (userRole == "admin" || userRole == "manager" || userRole == "accountant") {
        navigate("/dashboard");
      }
      else if (userRole == "salesman") {
        navigate("/drugs/brands")
      }
    } else {
      setError("Invalid username or password");
    }

    // postHandler("/auth/login", { email, password })
    //   .then((data) => {
    //     console.log("result:  ", data, " :: ", data.status);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  function setTestData(role) {
    let email = "";
    let password = "";

    // if (role === "super-admin") {
    //   email = `test.super-admin@gmail.com`;
    //   password = `pass.super-admin`;
    // }   

    if (role === "admin") {
      email = `test.admin@gmail.com`;
      password = `pass.admin`;
    } else if (role === "manager") {
      email = `test.manager@gmail.com`;
      password = `pass.manager`;
    } else if (role === "salesman") {
      email = `test.salesman@gmail.com`;
      password = `pass.salesman`;
    } else {
      email = ``;
      password = ``;
    }
    setUserName(email);
    setPassword(password);
  }

  function passVisibility(e, id) {
    e.preventDefault();
    var x = document.getElementById(id);
    x.type === "password" ? (x.type = "text") : (x.type = "password");
    setTimeout(() => {
      x.type = "password";
    }, 2000);
  }

  return (

    <div className="h-full w-full flex flex-col gap-4 justify-center items-center sm:px-2 px-4">
      <div className=" md:w-2/5 sm:w-1/2 w-full  flex justify-start gap-4">
        <span className="  font-titan font-normal text-slate-500 rounded-md px-1">Test Accounts:</span>

        <Button
          onClick={() => setTestData("admin")}
          txt="admin"
          style=" btn_test_data "
        ></Button><Button
          onClick={() => setTestData("manager")}
          txt="manager/accountant"
          style=" btn_test_data "
        ></Button>
        <Button
          onClick={() => setTestData("salesman")}
          txt="salesman"
          style=" btn_test_data "
        ></Button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="  md:w-2/5 sm:w-1/2 w-full m-2 flex flex-col gap-4 items-start"
      >
        <div className="flex flex-col gap-1 w-full">
          <Label txt="Email / User Name" />
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required={true}
            pc="Enter Your email / username"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Label txt="Password" />
              <button onClick={(e) => passVisibility(e, "password")}>
                <img src={eye} className="icn_sm" />
              </button>
            </div>

            <Link to="/auth/account-recovery" className="text-blue-400">
              Forgot Password ?
            </Link>
          </div>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            title="Must contain at least 6 or more characters"
            required={true}
            pc="password"
            style=" flex-grow"
          />
        </div>
        <div className="flex justify-start">
          <Button txt="Log In" type="submit" style=" btn_auth_submit "></Button>
        </div>
        <p className="text-sm text-red-900">{error}</p>
      </form>

    </div>

  );
}
