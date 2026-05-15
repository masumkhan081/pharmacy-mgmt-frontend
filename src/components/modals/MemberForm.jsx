import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/StaffView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { memberSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = {
  name: "",
  phone: "",
  email: "",
  role: "",
  salary: 0,
};

export default function MemberForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalForEdit = useSelector((s) => s.staffView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.staffView.isModalVisible);
  const modalData = useSelector((s) => s.staffView.modalData);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      setForm({
        ...initial,
        name: modalData.name ?? modalData.fullName ?? "",
        phone: modalData.phone ?? "",
        email: modalData.email ?? "",
        role: modalData.role ?? "",
        salary: Number(modalData.salary ?? 0),
      });
    } else {
      setForm(initial);
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(memberSchema, {
      ...form,
      salary: Number(form.salary),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.phone) delete payload.phone;
      if (!payload.email) delete payload.email;
      if (!payload.role) delete payload.role;
      if (payload.salary === undefined || payload.salary === null || Number.isNaN(payload.salary)) {
        delete payload.salary;
      }
      // BE staff routes are mounted at `/api/staff` (singular).
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/staff/${modalData.id}`, payload);
      } else {
        await postHandler("/staff", payload);
      }
      toast.success(`Staff member ${isModalForEdit ? "updated" : "created"}`);
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
        <Field label="Name" error={errors.name}>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Role" error={errors.role}>
          <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. pharmacist, manager" />
        </Field>
        <Field label="Salary" error={errors.salary}>
          <Input type="number" step="0.01" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
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
