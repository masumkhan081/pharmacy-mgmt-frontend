import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/DrugsView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { formulationSchema } from "../../schemas/drug.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function FormulationForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.drugsView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.drugsView.isModalVisible);
  const modalData = useSelector((s) => s.drugsView.modalData);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalVisible) return;
    setName(
      isModalForEdit
        ? modalData?.fullName ?? modalData?.name ?? modalData?.longName ?? ""
        : ""
    );
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(formulationSchema, { name });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/formulations/${modalData.id}`, { name });
      } else {
        await postHandler("/formulations", { name });
      }
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSave}>
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <div className="flex flex-col">
        <label className="form-label">Formulation Name</label>
        <Input
          className="txt-input"
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({ ...errors, name: null });
          }}
        />
        {errors.name && <span className="text-sm text-error-600 mt-1">{errors.name}</span>}
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
          {isModalForEdit ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
