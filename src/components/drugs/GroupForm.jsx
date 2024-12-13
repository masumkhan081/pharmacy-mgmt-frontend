import React, { useEffect } from 'react'
import { setGroups, setGenerics, setManufacturers } from '../../redux/slices/DrugsView'
import { getHandler } from '../../util/handler'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function GroupForm({ visible, setDropDown }) {
   //
   const dispatch = useDispatch();
   const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
   const modalData = useSelector((state) => state.drugsView.modalData)
   const groups = useSelector((state) => state.drugsView.groups);
   const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  //
  async function handleSave() {
   
    const response = postHandler("/groups", { name })
    console.log("resp: - groups-- ", JSON.stringify(response));
  }
  // 
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/groups/all");
      dispatch(setGroups({ data: data?.data?.groups }));
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col ">

      <div className='flex justify-end'>
        <button onClick={() => setDropDown(!visible)}>Close</button>
      </div>
      <div className=' flex flex-col'>
        <label>Existing Generics</label>
        <select  > 
          {groups && groups?.map((grp, ind) => {
            return <option key={ind}  >{grp.name}</option>
          })}
        </select>
      </div>
      <div className='flex flex-col'>

        <label>Group Name</label>
        <input type='text' name="name" value={name} onChange={(e) => setName(e.target.value)}></input>

      </div>

      <div>
        <button onClick={() => handleSave()}>Save</button>
      </div>
    </div>
  )
}
