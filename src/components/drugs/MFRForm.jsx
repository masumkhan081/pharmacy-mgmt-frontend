import React, { useEffect } from 'react'
import { toggleModal, setManufacturers } from '../../redux/slices/DrugsView'
import { getHandler, postHandler, patchHandler } from '../../utils/handlerReqRes'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function MFRForm() {
  //
  const [isLoading, setIsLoading] = useState(false)
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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     alert("why i am running ..")
  //     setIsLoading(true);
  //     const data = await getHandler("/manufacturers");
  //     dispatch(setManufacturers({ data: data?.data?.manufacturers }));
  //     setIsLoading(false);
  //   };
  //   if (!isLoading) {
  //     fetchData();
  //   }
  // }, []);

  return (
    <form className="flex flex-col ">


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

    </form>
  )
}
