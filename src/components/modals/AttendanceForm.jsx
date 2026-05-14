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
import { attendanceSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"];

const initial = () => ({
  staff: "",
  status: "PRESENT",
  date: new Date().toISOString().slice(0, 10),
});

export default function AttendanceForm() {
  const dispatch = useDispatch();
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
        console.error("Failed to fetch staff:", err.message);
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
        status: modalData.status ?? "PRESENT",
        date: modalData.date
          ? String(modalData.date).slice(0, 10)
          : initial().date,
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(attendanceSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.date) delete payload.date;
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/attendances/${modalData.id}`, payload);
      } else {
        await postHandler("/attendances", payload);
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
      <Field label="Staff" error={errors.staff}>
        <select className="txt-input" value={form.staff} onChange={(e) => set("staff", e.target.value)}>
          <option value="">Select staff</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>{s.name ?? s.id}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status" error={errors.status}>
          <select className="txt-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" error={errors.date}>
          <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
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
