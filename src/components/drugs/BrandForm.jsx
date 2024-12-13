import React, { useEffect } from 'react'
import { setGroups, setGenerics, setManufacturers } from '../../redux/slices/DrugsView'
import { getHandler } from '../../util/handler'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function BrandForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
  const closeModal = useSelector((state) => state.drugsView.closeModal)
  const modalData = useSelector((state) => state.drugsView.modalData)
  const [selectedGroup, setSelectedGroup] = useState(isModalForEdit == true ? modalData.grpId : "select-one")
  const [selectedGeneric, setSelectedGeneric] = useState(isModalForEdit == true ? modalData.genId : "select-one")
  const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  const [selectedMFR, setSelectedMFR] = useState(isModalForEdit == true ? modalData.mfrId : "")

  // 
  const groups = useSelector((state) => state.drugsView.groups);
  const generics = useSelector((state) => state.drugsView.generics);
  const manufacturers = useSelector((state) => state.drugsView.manufacturers);
  //  

  async function handleSave(e) {
    e.preventDefault();
    console.log("reached to handle submit ... ");
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
      let data = await getHandler("/groups");
      dispatch(setGroups({ data: data?.data?.groups }));
      data = await getHandler("/manufacturers/all");
      dispatch(setManufacturers({ data: data?.data?.manufacturers }));
    };
    visible ? fetch() : null;
  }, []);

  return (
    <div className=" flex flex-col ">

      <div className='flex justify-end'>
        <button onClick={() => { dispatch(closeModal({ isModalVisible: false })) }}>Close</button>
      </div>

      <form onSubmit={() => handleSave}>
        <div className='flex flex-col'>

          <label>brand name</label>
          <input type='text' name="name" value={name} onChange={(e) => setName(e.target.value)}></input>

        </div>
        <div>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            <option disabled value="select-one">Select One</option>
            {groups && groups?.map((grp, ind) => {
              return <option key={ind} value={grp._id}>{grp.name}</option>
            })}
          </select>
        </div>


        <div> <select value={selectedGeneric} onChange={(e) => setSelectedGeneric(e.target.value)}>

          <option disabled value="select-one">Select One</option>
          {generics && generics?.map((gen, ind) => {
            return <option key={ind} value={gen._id}>{gen.name}</option>
          })}
        </select></div>

        <div><select value={selectedMFR} onChange={(e) => setSelectedMFR(e.target.value)}>

          <option disabled value="select-one">Select One</option>
          {manufacturers && manufacturers?.map((mfr, ind) => {
            return <option key={ind} value={mfr._id}>{mfr.name}</option>
          })}
        </select></div>

        <div>
          <button type="submit"  >Save</button>
        </div>
      </form>
    </div>
  )
}
