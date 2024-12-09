import React, { useEffect } from 'react'
import { setGroups, setGenerics, setManufacturers } from '../../redux/slices/DrugsView'
import { getHandler, postHandler } from '../../util/handler'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function GenericForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
  const modalData = useSelector((state) => state.drugsView.modalData)
  const groups = useSelector((state) => state.drugsView.groups);
  const generics = useSelector((state) => state.drugsView.generics);
  const [selectedGroup, setSelectedGroup] = useState(isModalForEdit == true ? modalData.groupId: "")
  const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  //  

  async function handleSubmit(e) {
    e.preventDefault();
    const response = postHandler("/generic", { name })
    console.log("resp: - generic-- ", JSON.stringify(response));
  }

  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/generics/" + selectedGroup);
      dispatch(setGenerics(data.data.generics));
    }; if (selectedGroup !== "select-one") {
      fetch()
    }
  }, [selectedGroup]);
  // 
  useEffect(() => {
    const fetch = async () => {
      let data = await getHandler("/groups/all");
      dispatch(setGroups({ data: data?.data?.groups }));

    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col ">

      <div className='flex justify-end'>
        <button onClick={() => setDropDown(!visible)}>Close</button>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option disabled value="select-one">Select One</option>
          {groups && groups?.map((grp, ind) => {
            return <option key={ind} value={grp._id}>{grp.name}</option>
          })}
        </select>

        <div className=' flex flex-col'>
          <label>Existing Generic</label>
          <select >
            {generics && generics?.map((gen, ind) => {
              return <option key={ind}  >{gen.name}</option>
            })}
          </select>
        </div>
        <div className='flex flex-col'>
          <label>New Generic Name</label>
          <input type='text' name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
        </div>

        <div>

          <button type='submit'>Save</button>

        </div>

      </form>


    </div>
  )
}
