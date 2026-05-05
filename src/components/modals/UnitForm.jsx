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

    const formData = { shortName, longName };
    const validation = validateData(createUnitSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    try {
      await postHandler("/units", validation.data);
      const { data } = await getHandler("/units");
      dispatch(setUnits({ data }));
      setShortName("");
      setLongName("");
    } catch (err) {
      setErrors(
        err.errors?.reduce((a, e) => ({ ...a, [e.field]: e.message }), {}) ?? {
          _form: err.message,
        }
      );
    }
  }
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/units");
        dispatch(setUnits({ data }));
      } catch (err) {
        console.error("Failed to fetch units:", err.message);
      }
    };
    fetch();
  }, []);
  //

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="form-label">Existing Units</label>
        <select className="txt-input">
          <option value="">Select a unit</option>
          {units &&
            units?.map((unit, ind) => {
              return <option key={ind} value={unit._id}>{unit.shortName} - {unit.longName}</option>;
            })}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="form-label">Short Name *</label>
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
          className={`txt-input ${errors.shortName ? 'border-error-500' : ''}`}
          placeholder="e.g., mg, ml, tab"
        />
        {errors.shortName && (
          <span className="text-sm text-error-600 mt-1">{errors.shortName}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="form-label">Long Name *</label>
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
          className={`txt-input ${errors.longName ? 'border-error-500' : ''}`}
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
        <Button type="submit" className="btn-primary">
          {isModalForEdit ? "Update Unit" : "Create Unit"}
        </Button>
      </div>
    </form>
  );
}
