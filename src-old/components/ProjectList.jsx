import React from "react";

import { AiOutlineClose } from "react-icons/ai";
import Button from "../common-ui/Button";
import Title from "../common-ui/Title";

export default function ({ onClose }) {
  return (
    <div className="w-full flex flex-col gap-4 sm:px-4 px-1 ">
      <Title
        txt="Live Projects"
        style="neutral_title mt-4 rounded-md drop-shadow px-4 shadow-md"
      >
        <Button
          style={"ml-auto"}
          icon={
            <AiOutlineClose className="w-1.25 h-1.25 text-orange-800 mb-0.125" />
          }
          onClick={() => onClose()}
        />
      </Title>

      <div className="flex sm:flex-row flex-col">
        <ul className="flex-grow space-y-4 px-3 py-4">
          <li className="">E commerce site </li>
          <li className="">hi</li>
          <li className="">hi</li>
        </ul>
        <ul className="flex-grow space-y-4 px-3 py-4">
          <li className="">E commerce site </li>
          <li className="">hi</li>
          <li className="">hi</li>
        </ul>
      </div>
    </div>
  );
}
