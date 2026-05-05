import React from "react";
import Label from "../common-ui/Label";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { postHandler } from "../../utils/handlerReqRes";

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
      <p className="btn-auth-toggler">Email Verification</p>
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center gap-2 pt-6 px-10"
      >
        <div className="flex flex-col gap-2">
          <Label txt="OTP" />

          <div className="w-full mb-10 flex justify-between flex-wrap gap-10   ">
            {otp_state.map((item, ind) => {
              return (
                <Input
                  type="text"
                  className=" py-4 px-5 rounded-full w-20 text-2xl leading-8 h-12 text-center "
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

        <Button type="submit" className="btn-auth-submit  ">
          Verify Account
        </Button>
      </form>
    </>
  );
}
