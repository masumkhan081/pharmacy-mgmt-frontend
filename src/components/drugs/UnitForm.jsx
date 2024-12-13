import React, { useEffect } from "react";
import {
  setUnits
} from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../util/handler";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function UnitForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
  const modalData = useSelector((state) => state.drugsView.modalData)
  const units = useSelector((state) => state.drugsView.units);
  const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  //   
  async function handleSave() {
    const response = postHandler("/units", { name })
    console.log("resp: - units-- ", JSON.stringify(response));
  }
  // 
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/units/all");
      dispatch(setUnits({ data: data?.data?.units }));
    };
    fetch();
  }, []);
  // 

  return (
    <div className="flex flex-col ">
      <div className="flex justify-end">
        <button onClick={() => setDropDown(!visible)}>Close</button>
      </div>

      <div className=' flex flex-col'>
        <label>Existing Units</label>
        <select>
          {units && units?.map((unit, ind) => {
            return <option key={ind}  >{unit.name}</option>
          })}
        </select>
      </div>

      <div className="flex flex-col">
        <label>Unit Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <button
        onClick={() => {
          handleSave();
        }}
      >
        Save
      </button>
    </div>
  );
}
