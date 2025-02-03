import React from "react";

export default function Button({ onClick, txt, icon,style,type }) {
  return (
    <button onClick={onClick} className={style?style :"btn_test_data"} type={type}>
      {icon}
      {txt}
    </button>
  );
}
