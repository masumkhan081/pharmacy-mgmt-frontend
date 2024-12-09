import React from "react";
import Label from "../../common-ui/Label";
import { postHandler } from "../../util/handler";

export default function OTP() {
  const [otp_state, setOtp] = React.useState(["", "", "", ""]);

  function handleOTP(str, state_ind) {
    if (str.length == 4) {
      setOtp([...str.split("")]);
    }
    if (str.length <= 1) {
      setOtp(
        otp_state.map((itm, ind) => {
          if (state_ind == ind) {
            return str;
          }
          return itm;
        })
      );
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    postHandler("/auth/verify-otp", { email, password })
      .then((data) => {
        console.log("result:  ", data, " :: ", data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <p className="btn_auth_toggler">Email Verification</p>
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center gap-2 pt-6 px-2.5"
      >
        <div className="flex flex-col gap-2">
          <Label txt="OTP" />

          <div className="w-full mb-2.5 flex justify-between flex-wrap gap-0.62   ">
            {otp_state.map((item, ind) => {
              return (
                <input
                  type="text"
                  className=" py-1.125 px-1.25 rounded-full w-5.0 text-1.5/2 h-3.0 text-center "
                  value={otp_state[ind]}
                  onChange={(e) => {
                    console.log(e.target.value);
                    handleOTP(e.target.value, ind);
                  }}
                />
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn_auth_submit  ">
          Verify Account
        </button>
      </form>
    </>
  );
}
