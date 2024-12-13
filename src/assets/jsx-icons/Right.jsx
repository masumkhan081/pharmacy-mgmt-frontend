import React from "react";

export default function DB_right({ status }) {
   
  
  const sty = {
    active: "w-1.0 h-1.0 inline my-auto ml-auto rotate-90",
    idle: "w-1.0 h-1.0 inline my-auto ml-auto ",
  };
  const fill = {
    active: "#0D3D4B", // FFFFFF
    idle: "#0D3D4B", //#0D3D4B
  };
  return (
    <svg
      className={sty[`${status}`]}
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.00025 12.0002C0.74425 12.0002 0.48825 11.9022 0.29325 11.7072C-0.09775 11.3162 -0.09775 10.6842 0.29325 10.2933L4.58625 6.00025L0.29325 1.70725C-0.09775 1.31625 -0.09775 0.68425 0.29325 0.29325C0.68425 -0.09775 1.31625 -0.09775 1.70725 0.29325L6.70725 5.29325C7.09825 5.68425 7.09825 6.31625 6.70725 6.70725L1.70725 11.7072C1.51225 11.9022 1.25625 12.0002 1.00025 12.0002Z"
        fill={fill[`${status}`]}
      />
    </svg>
  );
}
