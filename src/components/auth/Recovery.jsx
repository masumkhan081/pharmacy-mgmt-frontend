import React, { useState } from "react";
import Label from "../../common-ui/Label";

export default function Recovery() {

  const [recoveryEmail, setRecoveryEmail] = useState("");
  
  const handleSubmit = () => {
    e.preventDefault();
    postHandler("/auth/account-recovery", { email, password })
      .then((data) => {
        console.log("result:  ", data, " :: ", data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <p className="btn_auth_toggler">Account Recovery</p>

      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center gap-4 pt-6 px-1.5"
      >
        <div className="flex flex-col gap-2">
          <Label txt="Email" />

          <Input
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            required={true}
            style="txt_inp_form"
            pc="Enter Your Email"
          />
        </div>

        <Button type="submit" txt="Submit" style="btn_auth_submit trans_eio" />
      </form>
    </>
  );
}
