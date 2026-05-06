import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/StaffView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { memberSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = {
  fullName: "",
  phone: "",
  altPhone: "",
  email: "",
  designation: "salesman",
  gender: "",
  shift: "Morning",
  salaryType: "Hourly",
  hourlySalary: 0,
  weeklySalary: 0,
  monthlySalary: 0,
  hoursPerDay: 8,
  daysPerWeek: 5,
  address: "",
};

export default function MemberForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.staffView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.staffView.isModalVisible);
  const modalData = useSelector((s) => s.staffView.modalData);
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
    const validation = validateData(memberSchema, {
      ...form,
      hourlySalary: Number(form.hourlySalary),
      weeklySalary: Number(form.weeklySalary),
      monthlySalary: Number(form.monthlySalary),
      hoursPerDay: Number(form.hoursPerDay),
      daysPerWeek: Number(form.daysPerWeek),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/staff/${modalData._id}`, validation.data);
      } else {
        await postHandler("/staff", validation.data);
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
        <Field label="Designation" error={errors.designation}>
          <select className="txt-input" value={form.designation} onChange={(e) => set("designation", e.target.value)}>
            <option value="salesman">salesman</option>
            <option value="pharmacist">pharmacist</option>
            <option value="manager">manager</option>
            <option value="admin">admin</option>
          </select>
        </Field>
        <Field label="Gender" error={errors.gender}>
          <select className="txt-input" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="">—</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </Field>
        <Field label="Shift" error={errors.shift}>
          <select className="txt-input" value={form.shift} onChange={(e) => set("shift", e.target.value)}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
        </Field>
        <Field label="Salary type" error={errors.salaryType}>
          <select className="txt-input" value={form.salaryType} onChange={(e) => set("salaryType", e.target.value)}>
            <option value="Hourly">Hourly</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </Field>
        <Field label="Hourly salary" error={errors.hourlySalary}>
          <Input type="number" value={form.hourlySalary} onChange={(e) => set("hourlySalary", e.target.value)} />
        </Field>
        <Field label="Weekly salary" error={errors.weeklySalary}>
          <Input type="number" value={form.weeklySalary} onChange={(e) => set("weeklySalary", e.target.value)} />
        </Field>
        <Field label="Monthly salary" error={errors.monthlySalary}>
          <Input type="number" value={form.monthlySalary} onChange={(e) => set("monthlySalary", e.target.value)} />
        </Field>
        <Field label="Hours/day" error={errors.hoursPerDay}>
          <Input type="number" value={form.hoursPerDay} onChange={(e) => set("hoursPerDay", e.target.value)} />
        </Field>
        <Field label="Days/week" error={errors.daysPerWeek}>
          <Input type="number" value={form.daysPerWeek} onChange={(e) => set("daysPerWeek", e.target.value)} />
        </Field>
        <Field label="Address" error={errors.address}>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
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
