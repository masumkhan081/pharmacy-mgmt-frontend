import React from "react";

export default function Input({ id, type, pc, style, value, onChange }) {
  const styLogic = () => (type === "text" ? "txt_inp_form" : "txt_inp_form");
  return (
    <input
      id={id}
      type={type || "text"}
      className={`${styLogic()} ${style}`}
      placeholder={pc}
      value={value}
      onChange={onChange}
    ></input>
  );
}
