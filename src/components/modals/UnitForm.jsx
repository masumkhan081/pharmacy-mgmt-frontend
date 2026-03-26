import React, { useEffect } from "react";
import { setUnits, toggleModal } from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createUnitSchema } from "../../schemas/unit.schema";
import { validateData } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function UnitForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const modalData = useSelector((state) => state.drugsView.modalData);
  const units = useSelector((state) => state.drugsView.units);
  const [shortName, setShortName] = useState(
    isModalForEdit == true ? modalData.shortName : ""
  );
  const [longName, setLongName] = useState(
    isModalForEdit == true ? modalData.longName : ""
  );
  const [errors, setErrors] = useState({});
  //
  async function handleSave(e) {
    e.preventDefault();
    
    // Validate form data
    const formData = { shortName, longName };
    const validation = validateData(createUnitSchema, formData);
    
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    
    // Clear errors if validation passed
    setErrors({});
    
    // Submit data
    const response = await postHandler("/units", validation.data);
    console.log("resp: - units-- ", JSON.stringify(response));
    
    if (response.status === 200 || response.status === 201) {
      // Refresh units list
      const data = await getHandler("/units/all");
      dispatch(setUnits({ data: data?.data?.units }));
      
      // Clear form
      setShortName("");
      setLongName("");
    }
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
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="lbl_form">Existing Units</label>
        <select className="txt_inp_form">
          <option value="">Select a unit</option>
          {units &&
            units?.map((unit, ind) => {
              return <option key={ind} value={unit._id}>{unit.shortName} - {unit.longName}</option>;
            })}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="lbl_form">Short Name *</label>
        <Input
          type="text"
          name="shortName"
          value={shortName}
          onChange={(e) => {
            setShortName(e.target.value);
            // Clear error when user starts typing
            if (errors.shortName) {
              setErrors({ ...errors, shortName: null });
            }
          }}
          className={`txt_inp_form ${errors.shortName ? 'border-error-500' : ''}`}
          placeholder="e.g., mg, ml, tab"
        />
        {errors.shortName && (
          <span className="text-sm text-error-600 mt-1">{errors.shortName}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="lbl_form">Long Name *</label>
        <Input
          type="text"
          name="longName"
          value={longName}
          onChange={(e) => {
            setLongName(e.target.value);
            // Clear error when user starts typing
            if (errors.longName) {
              setErrors({ ...errors, longName: null });
            }
          }}
          className={`txt_inp_form ${errors.longName ? 'border-error-500' : ''}`}
          placeholder="e.g., Milligram, Milliliter, Tablet"
        />
        {errors.longName && (
          <span className="text-sm text-error-600 mt-1">{errors.longName}</span>
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
          {isModalForEdit ? "Update Unit" : "Create Unit"}
        </Button>
      </div>
    </form>
  );
}
