import React, { useEffect } from 'react'
import { setFormulations } from '../../redux/slices/DrugsView'
import { getHandler } from '../../util/handler'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function FormulationForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
  const modalData = useSelector((state) => state.drugsView.modalData)
  const formulations = useSelector((state) => state.drugsView.formulations);
  const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  // 
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/formulations/all");
      dispatch(setFormulations({ data: data?.data?.formulations }));
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col ">

      <div className='flex justify-end'>
        <button onClick={() => setDropDown(!visible)}>Close</button>
      </div>
      <div className='flex flex-col'>

        <label>Formulation Name</label>
        <input type='text' name="name" value={name} onChange={(e) => setName(e.target.value)}></input>

      </div>
      <select  >
        <option disabled  >Exisitng Formulations</option>
        {formulations && formulations?.map((frm, ind) => {
          return <option key={ind} disabled  >{frm.name}</option>
        })}
      </select>

      <div className=''>
        <button onClick={(e) => handleSave(e)}>Save</button>
      </div>
    </div>
  )
}
