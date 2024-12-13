import React from "react";
import Title from "../common-ui/Title";
import { HiMiniQueueList } from "react-icons/hi2";
import { FaBookReader, FaHandPointRight } from "react-icons/fa";
import { FaRightLong } from "react-icons/fa6";
import List from "../common-ui/List";
import {
  usedTechAndTools,
  projectFeatures,
  projectObjectives,
} from "../static-data/about";

export default function About() {
  return (
    <div className="md:px-2.0 px-1.0 grid grid-cols-3 gap-4">
      <div className=" col-span-1 flex flex-col gap-4 justify-start items-start md:px-4 px-2">
        <Title
          txt="Whats Been Used"
          style="neutral_title "
          icon={<HiMiniQueueList className="mr-2" />}
        />
        <ul className="w-full bg-green-50 border-y-8 border-emerald-100 text-green-800 px-2">
          <li className="font-semibold mt-2">Data-Tier:</li>
          <List listArray={usedTechAndTools.dataTier} />
          <li className="font-semibold mt-2">Back-End:</li>
          <List listArray={usedTechAndTools.backEnd} />
          <li className="font-semibold mt-2">Front-End:</li>
          <List listArray={usedTechAndTools.frontEnd} />
        </ul>
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        <Title
          txt="Read Me"
          style="neutral_title"
          icon={<FaRightLong className="mr-2" />}
        />

        <div className="flex flex-col items-start justify-start gap-3">
          <ul className="w-full ">
            <li className="font-bold">Objectives:</li>
            <List listArray={projectObjectives} />
          </ul>

          <ul className="w-full ">
            <li className="font-bold">Features:</li>
            <List listArray={projectFeatures} />
          </ul>
        </div>
      </div>
    </div>
  );
}
