import React, { useEffect } from 'react'
import { closeModal, setManufacturers } from '../../redux/slices/DrugsView'
import { getHandler, postHandler, patchHandler } from '../../util/handler'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function MFRForm() {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
  const modalData = useSelector((state) => state.drugsView.modalData)
  const manufacturers = useSelector((state) => state.drugsView.manufacturers);
  const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  // 

  //  
  async function handleSave(e) {
    e.preventDefault();
    const response = postHandler("/manufacturers", { name })
    console.log("resp: - manufacturers-- ", JSON.stringify(response));
  }
  // 
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/manufacturers/all");
      dispatch(setManufacturers({ data: data?.data?.manufacturers }));
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col ">

      <div className='flex justify-end'>
        <button onClick={() => dispatch(closeModal({ isModalVisible: false }))}>Close</button>
      </div>
      <span>{JSON.stringify(isModalForEdit)}</span>
      <div className=' flex flex-col'>
        <label>Existing Manufacturers</label>
        <select  >
          {manufacturers && manufacturers?.map((mfr, ind) => {
            return <option key={ind}  >{mfr.name}</option>
          })}
        </select>
      </div>

      <div className='flex flex-col'>
        <label>Manufacture Name</label>
        <input type='text' name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
      </div>

      <div>
        <button onClick={() => handleSave()}>Save</button>
      </div>

    </div>
  )
}
