import React from "react";
import Label from "../../common-ui/Label";
import { postHandler } from "../../util/handler";
//  icons
import eye from "../../assets/icons/eye.svg";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Input from "../../common-ui/Input";
import Button from "../../common-ui/Button";
//
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const status = location.state?.loginView;

  const handleSubmit = (e) => {
    e.preventDefault();

    postHandler("/auth/login", { email, password })
      .then((data) => {
        console.log("result:  ", data, " :: ", data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function setTestData(role) {
    if (role === "super-admin") {

    }
    else if (role === "admin") {

    } else if (role === "manager") {

    } else if (role === "salesman") {

    }
    setUsername("email@gmail.com");
    setPassword("123456");
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
    <div className="container mx-auto h-full flex sm:flex-row flex-col justify-around items-center ">
      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 w-full sm:mx-0 mx-6 flex flex-col gap-6 pt-2 pb-8 px-2 sm:px-4  rounded-md shadow-sm drop-shadow-md"
      >
        <div className="flex flex-col gap-1">
          <Label txt="User Name" />
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={true}
            pc="Enter Your username"
          />
        </div>

        <div className="flex flex-col gap-1">
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
            title="Must contain at least 6 or more characters"
            required={true}
            pc="password"
            style=" flex-grow"
          />
        </div>
        <div className="flex justify-start">
          <Button txt="Log In" type="submit" style=" btn_auth_submit "></Button>
        </div>
      </form>
      <div className=" flex flex-col justify-center gap-4">
        <span className="bg-slate-300 text-sm rounded-md px-1 ">Test Accounts:</span>
        <Button
          onClick={() => setTestData("super-admin")}
          txt="super-admin"
          style=" btn_test_data "
        ></Button>
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
    </div>
  );
}
