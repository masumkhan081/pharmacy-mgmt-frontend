import React from "react";

export default function List({ listArray }) {
  return (
    <>
      {listArray.map((listItem) => {
        return <li>{listItem}</li>;
      })}
    </>
  );
}
