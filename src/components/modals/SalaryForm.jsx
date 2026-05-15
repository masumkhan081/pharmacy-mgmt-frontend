import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/StaffView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { salarySchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const initial = () => ({
  staff: "",
  amount: 0,
  month: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear(),
  paidAt: "",
});

export default function SalaryForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalForEdit = useSelector((s) => s.staffView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.staffView.isModalVisible);
  const modalData = useSelector((s) => s.staffView.modalData);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHandler("/staff?limit=1000");
        setStaff(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(`Failed to fetch staff: ${err.message}`);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      setForm({
        ...initial(),
        staff:
          typeof modalData.staff === "object"
            ? modalData.staff?.id ?? ""
            : modalData.staffId ?? modalData.staff ?? "",
        amount: Number(modalData.amount ?? 0),
        month: modalData.month ?? initial().month,
        year: Number(modalData.year ?? initial().year),
        paidAt: modalData.paidAt
          ? String(modalData.paidAt).slice(0, 10)
          : "",
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(salarySchema, {
      ...form,
      amount: Number(form.amount),
      year: Number(form.year),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.paidAt) delete payload.paidAt;
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/salaries/${modalData.id}`, payload);
      } else {
        await postHandler("/salaries", payload);
      }
      toast.success(`Salary ${isModalForEdit ? "updated" : "created"}`);
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <Field label="Staff" error={errors.staff}>
        <select className="txt-input" value={form.staff} onChange={(e) => set("staff", e.target.value)}>
          <option value="">Select staff</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>{s.name ?? s.id}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount" error={errors.amount}>
          <Input type="number" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
        </Field>
        <Field label="Month" error={errors.month}>
          <select className="txt-input" value={form.month} onChange={(e) => set("month", e.target.value)}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Year" error={errors.year}>
          <Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} />
        </Field>
        <Field label="Paid at" error={errors.paidAt}>
          <Input type="date" value={form.paidAt} onChange={(e) => set("paidAt", e.target.value)} />
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
