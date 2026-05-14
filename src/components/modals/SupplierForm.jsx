import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/SupplierView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { supplierSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

export default function SupplierForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.supplierView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.supplierView.isModalVisible);
  const modalData = useSelector((s) => s.supplierView.modalData);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      setForm({
        ...initial,
        name: modalData.name ?? "",
        contactPerson: modalData.contactPerson ?? "",
        phone: modalData.phone ?? "",
        email: modalData.email ?? "",
        address: modalData.address ?? "",
      });
    } else {
      setForm(initial);
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(supplierSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.contactPerson) delete payload.contactPerson;
      if (!payload.phone) delete payload.phone;
      if (!payload.email) delete payload.email;
      if (!payload.address) delete payload.address;
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/suppliers/${modalData.id}`, payload);
      } else {
        await postHandler("/suppliers", payload);
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
        <Field label="Name" error={errors.name}>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Contact person" error={errors.contactPerson}>
          <Input value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Address" error={errors.address}>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 mt-3">
        <Button type="button" onClick={() => dispatch(toggleModal({ isModalVisible: false }))} className="px-4 py-2 text-sm">Cancel</Button>
        <Button type="submit" className="btn-primary">
          {isModalForEdit ? "Update" : "Save"}
        </Button>
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
