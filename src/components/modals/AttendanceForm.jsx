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

const initial = () => ({
  staff: "",
  date: new Date().toISOString().slice(0, 10),
  shift: "day",
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
    if (isModalForEdit && modalData?._id) {
      setForm({
        ...initial(),
        ...modalData,
        staff:
          typeof modalData.staff === "object"
            ? modalData.staff?._id ?? ""
            : modalData.staff ?? "",
        date: modalData.date
          ? String(modalData.date).slice(0, 10)
          : initial().date,
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(attendanceSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = {
        ...validation.data,
        date: new Date(validation.data.date),
      };
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/attendances/${modalData._id}`, payload);
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
      <div className="flex flex-col">
        <label className="form-label">Staff</label>
        <select className="txt-input" value={form.staff} onChange={(e) => set("staff", e.target.value)}>
          <option value="">Select staff</option>
          {staff.map((s) => (
            <option key={s._id} value={s._id}>{s.fullName ?? s.name ?? s._id}</option>
          ))}
        </select>
        {errors.staff && <span className="text-sm text-error-600 mt-1">{errors.staff}</span>}
      </div>
      <div className="flex flex-col">
        <label className="form-label">Date</label>
        <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        {errors.date && <span className="text-sm text-error-600 mt-1">{errors.date}</span>}
      </div>
      <div className="flex flex-col">
        <label className="form-label">Shift</label>
        <select className="txt-input" value={form.shift} onChange={(e) => set("shift", e.target.value)}>
          <option value="day">day</option>
          <option value="evening">evening</option>
          <option value="night">night</option>
        </select>
      </div>
      <div className="flex items-center justify-end gap-3 mt-3">
        <Button type="button" onClick={() => dispatch(toggleModal({ isModalVisible: false }))} className="px-4 py-2 text-sm">Cancel</Button>
        <Button type="submit" className="btn-primary">{isModalForEdit ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
}
