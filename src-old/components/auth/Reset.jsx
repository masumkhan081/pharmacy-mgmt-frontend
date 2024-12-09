import React from "react";
import Label from "../../common-ui/Label";
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
      <p className="btn_auth_toggler">Password Reset</p>
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center gap-4 py-3.0 px-1.5"
      >
        <div className="flex flex-col gap-2">
          <Label txt="Email" />

          <input
            type="email"
            required
            className="txt_inp_form"
            placeholder="Enter Your Email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label txt="Password" />
          <div className="flex gap-2 justify-between">
            {/* <Input type="text" pc="" style="flex-grow" /> */}
            <input
              id="password"
              name="password"
              type="password"
              title="Must contain at least 6 or more characters"
              required
              placeholder="Set a password"
              className="txt_inp_form flex-grow"
            />
            <button onClick={(e) => passVisibility(e, "password")}>
              <img src={eye} className="icn_sm" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label txt="Confirm Password" />
          <div className="flex gap-2 justify-between">
            <input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              title="Must contain at least 6 or more characters"
              required
              placeholder="Password again"
              className="txt_inp_form flex-grow"
            />
            <button onClick={(e) => passVisibility(e, "confirmpassword")}>
              <img src={eye} className="icn_sm" />
            </button>
          </div>
        </div>

        <button type="submit" className="btn_auth_submit trans_eio">
          Submit
        </button>
      </form>
    </>
  );
}
