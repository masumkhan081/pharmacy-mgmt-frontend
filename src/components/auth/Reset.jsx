import React from "react";
import Label from "../common-ui/Label";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
//  icons
import eye from "../../assets/icons/eye.svg";

export default function Reset() {
  const handleSubmit = (e) => {
    e.preventDefault();

    postHandler("/auth/reset-password", { email, password })
      .then((data) => {
        console.log("result:  ", data, " :: ", data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <p className="btn-auth-toggler">Password Reset</p>
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center gap-4 py-12 px-6"
      >
        <div className="flex flex-col gap-2">
          <Label txt="Email" />

          <Input
            type="email"
            required
            className="txt-input"
            placeholder="Enter Your Email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label txt="Password" />
          <div className="flex gap-2 justify-between">
            {/* <Input type="text" pc="" style="flex-grow" /> */}
            <Input
              id="password"
              name="password"
              type="password"
              title="Must contain at least 6 or more characters"
              required
              placeholder="Set a password"
              className="txt-input flex-grow"
            />
            <Button onClick={(e) => passVisibility(e, "password")}>
              <img src={eye} className="icon-sm" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label txt="Confirm Password" />
          <div className="flex gap-2 justify-between">
            <Input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              title="Must contain at least 6 or more characters"
              required
              placeholder="Password again"
              className="txt-input flex-grow"
            />
            <Button onClick={(e) => passVisibility(e, "confirmpassword")}>
              <img src={eye} className="icon-sm" />
            </Button>
          </div>
        </div>

        <Button type="submit" className="btn-auth-submit trans-eio">
          Submit
        </Button>
      </form>
    </>
  );
}
