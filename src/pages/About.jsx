import React from "react";
import Title from "../components/common-ui/Title";
import { HiMiniQueueList } from "react-icons/hi2";
import { FaBookReader, FaHandPointRight } from "react-icons/fa";
import { FaRightLong } from "react-icons/fa6";
import List from "../components/common-ui/List";
import {
  usedTechAndTools,
  projectFeatures,
  projectObjectives,
} from "../ui-config/about";

export default function About() {
  return (
    <div className="md:px-8 px-4 grid grid-cols-3 gap-4">
      <div className=" col-span-1 flex flex-col gap-4 justify-start items-start md:px-4 px-2">
        <Title
          txt="Whats Been Used"
          style="section-title "
          icon={<HiMiniQueueList className="mr-2" />}
        />
        <ul className="w-full bg-secondary-50 border-l-4 border-secondary-500 text-neutral-700 px-6 py-4 rounded-lg shadow-sm">
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
          style="section-title"
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
