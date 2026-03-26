import React, { useEffect, useState } from 'react'
import { toggleModal, setManufacturers } from '../../redux/slices/DrugsView'
import { getHandler, postHandler, patchHandler } from '../../utils/handlerReqRes'
import { useDispatch, useSelector } from 'react-redux';
import { mfrSchema } from '../../schemas/drug.schema';
import { validateData } from '../../utils/validation';
import Button from '../common-ui/Button';
import Input from '../common-ui/Input';

export default function MFRForm() {
  //
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit)
  const modalData = useSelector((state) => state.drugsView.modalData)
  const manufacturers = useSelector((state) => state.drugsView.manufacturers);
  const [name, setName] = useState(isModalForEdit == true ? modalData.name : "")
  const [errors, setErrors] = useState({});
  // 

  //  
  async function handleSave(e) {
    e.preventDefault();
    
    // Validate form data
    const validation = validateData(mfrSchema, { name });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    const response = await postHandler("/manufacturers", { name });
    console.log("resp: - manufacturers-- ", JSON.stringify(response));
    
    // Reset form on success
    if (response?.success) {
      setName("");
    }
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
    <form className="flex flex-col" onSubmit={handleSave}>
      <div className='flex flex-col'>
        <label className="lbl_form">Existing Manufacturers</label>
        <select className="txt_inp_form">
          <option disabled>Select existing manufacturer</option>
          {manufacturers && manufacturers?.map((mfr, ind) => {
            return <option key={ind}>{mfr.name}</option>
          })}
        </select>
      </div>

      <div className='flex flex-col mt-4'>
        <label className="lbl_form">Manufacturer Name</label>
        <Input 
          className="txt_inp_form"
          type='text' 
          name="name" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value);
            setErrors({ ...errors, name: null });
          }}
        />
        {errors.name && (
          <span className="text-sm text-error-600 mt-1">{errors.name}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <Button
          type="button"
          onClick={() => dispatch(toggleModal({ isModalVisible: false }))}
          className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        >
          Cancel
        </Button>
        <Button type="submit" className="btn_primary">
          {isModalForEdit ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  )
}
