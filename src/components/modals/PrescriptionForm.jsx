import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/PrescriptionView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { prescriptionSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = () => ({
  patientName: "",
  doctorName: "",
  details: "",
  image: "",
});

export default function PrescriptionForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalForEdit = useSelector((s) => s.prescriptionView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.prescriptionView.isModalVisible);
  const modalData = useSelector((s) => s.prescriptionView.modalData);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      setForm({
        ...initial(),
        patientName: modalData.patientName ?? "",
        doctorName: modalData.doctorName ?? "",
        details: modalData.details ?? "",
        image: modalData.image ?? "",
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(prescriptionSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.doctorName) delete payload.doctorName;
      if (!payload.details) delete payload.details;
      if (!payload.image) delete payload.image;
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/prescriptions/${modalData.id}`, payload);
      } else {
        await postHandler("/prescriptions", payload);
      }
      toast.success(`Prescription ${isModalForEdit ? "updated" : "created"}`);
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Patient name" error={errors.patientName}>
          <Input value={form.patientName} onChange={(e) => set("patientName", e.target.value)} />
        </Field>
        <Field label="Doctor name" error={errors.doctorName}>
          <Input value={form.doctorName} onChange={(e) => set("doctorName", e.target.value)} />
        </Field>
      </div>
      <Field label="Details" error={errors.details}>
        <textarea
          className="txt-input min-h-[100px]"
          value={form.details}
          onChange={(e) => set("details", e.target.value)}
          placeholder="Free-text transcription of the scanned prescription"
        />
      </Field>
      <Field label="Image URL / path" error={errors.image}>
        <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://... or /uploads/..." />
      </Field>
      <div className="flex items-center justify-end gap-3 mt-3">
        <Button type="button" onClick={() => dispatch(toggleModal({ isModalVisible: false }))} className="px-4 py-2 text-sm">Cancel</Button>
        <Button type="submit" className="btn-primary">{isModalForEdit ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col">
      <label className="form-label">{label}</label>
      {children}
      {error && <span className="text-sm text-error-600 mt-1">{error}</span>}
    </div>
  );
}
