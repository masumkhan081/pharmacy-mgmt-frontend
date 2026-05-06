import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/DrugsView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { createUnitSchema } from "../../schemas/unit.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function UnitForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.drugsView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.drugsView.isModalVisible);
  const modalData = useSelector((s) => s.drugsView.modalData);
  const [shortName, setShortName] = useState("");
  const [longName, setLongName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      setShortName(modalData.shortName ?? "");
      setLongName(modalData.longName ?? "");
    } else {
      setShortName("");
      setLongName("");
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(createUnitSchema, { shortName, longName });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/units/${modalData._id}`, validation.data);
      } else {
        await postHandler("/units", validation.data);
      }
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <div className="flex flex-col">
        <label className="form-label">Short Name *</label>
        <Input
          type="text"
          name="shortName"
          value={shortName}
          onChange={(e) => {
            setShortName(e.target.value);
            if (errors.shortName) setErrors({ ...errors, shortName: null });
          }}
          className={`txt-input ${errors.shortName ? "border-error-500" : ""}`}
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
            if (errors.longName) setErrors({ ...errors, longName: null });
          }}
          className={`txt-input ${errors.longName ? "border-error-500" : ""}`}
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
          className="px-4 py-2 text-sm"
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
