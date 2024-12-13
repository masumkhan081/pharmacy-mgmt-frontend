import React from "react";

export default function Input({ type, pc, style,value, onChange}) {
  const styLogic = () => (type === "text" ? "txt_inp_form" : "txt_inp_form");
  return (
    <input
      type={type || "text"}
      className={`${styLogic()} ${style}`}
      placeholder={pc}
      value={value}
      onChange={onChange}
    ></input>
  );
}
