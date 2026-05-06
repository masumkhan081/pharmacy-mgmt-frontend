import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/DoctorView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { doctorSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = {
  fullName: "",
  specialty: "",
  licenseNumber: "",
  phone: "",
  email: "",
  notes: "",
};

export default function DoctorForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.doctorView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.doctorView.isModalVisible);
  const modalData = useSelector((s) => s.doctorView.modalData);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      setForm({ ...initial, ...modalData });
    } else {
      setForm(initial);
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(doctorSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.email) delete payload.email;
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/doctors/${modalData._id}`, payload);
      } else {
        await postHandler("/doctors", payload);
      }
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
        <Field label="Full name" error={errors.fullName}>
          <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </Field>
        <Field label="Specialty" error={errors.specialty}>
          <Input value={form.specialty} onChange={(e) => set("specialty", e.target.value)} />
        </Field>
        <Field label="License #" error={errors.licenseNumber}>
          <Input value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Notes" error={errors.notes}>
          <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>
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
