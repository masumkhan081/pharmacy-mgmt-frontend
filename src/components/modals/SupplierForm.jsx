import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/SupplierView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { supplierSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = {
  fullName: "",
  phone: "",
  altPhone: "",
  gender: "",
  email: "",
  manufacturer: "",
  address: "",
  deliveryFrequency: "On-demand",
  isActive: true,
  notes: "",
};

export default function SupplierForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.supplierView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.supplierView.isModalVisible);
  const modalData = useSelector((s) => s.supplierView.modalData);
  const [mfrs, setMfrs] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHandler("/manufacturers?limit=1000");
        setMfrs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch manufacturers:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      setForm({
        ...initial,
        ...modalData,
        manufacturer:
          typeof modalData.manufacturer === "object"
            ? modalData.manufacturer?._id ?? ""
            : modalData.manufacturer ?? "",
      });
    } else {
      setForm(initial);
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.gender) delete payload.gender;
    const validation = validateData(supplierSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/suppliers/${modalData._id}`, validation.data);
      } else {
        await postHandler("/suppliers", validation.data);
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
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Alt phone" error={errors.altPhone}>
          <Input value={form.altPhone} onChange={(e) => set("altPhone", e.target.value)} />
        </Field>
        <Field label="Gender" error={errors.gender}>
          <select className="txt-input" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="">—</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </Field>
        <Field label="Manufacturer" error={errors.manufacturer}>
          <select className="txt-input" value={form.manufacturer} onChange={(e) => set("manufacturer", e.target.value)}>
            <option value="">Select manufacturer</option>
            {mfrs.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Delivery frequency" error={errors.deliveryFrequency}>
          <select className="txt-input" value={form.deliveryFrequency} onChange={(e) => set("deliveryFrequency", e.target.value)}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="On-demand">On-demand</option>
          </select>
        </Field>
        <Field label="Active" error={errors.isActive}>
          <select className="txt-input" value={form.isActive ? "yes" : "no"} onChange={(e) => set("isActive", e.target.value === "yes")}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Address" error={errors.address}>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="Notes" error={errors.notes}>
          <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
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
