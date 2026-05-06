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
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = () => ({
  staff: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  dueAmount: 0,
  paidAmount: 0,
});

export default function SalaryForm() {
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
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(salarySchema, {
      ...form,
      month: Number(form.month),
      year: Number(form.year),
      dueAmount: Number(form.dueAmount),
      paidAmount: Number(form.paidAmount),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/salaries/${modalData._id}`, validation.data);
      } else {
        await postHandler("/salaries", validation.data);
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
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="form-label">Month</label>
          <Input type="number" value={form.month} onChange={(e) => set("month", e.target.value)} />
          {errors.month && <span className="text-sm text-error-600 mt-1">{errors.month}</span>}
        </div>
        <div className="flex flex-col">
          <label className="form-label">Year</label>
          <Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} />
          {errors.year && <span className="text-sm text-error-600 mt-1">{errors.year}</span>}
        </div>
        <div className="flex flex-col">
          <label className="form-label">Due amount</label>
          <Input type="number" value={form.dueAmount} onChange={(e) => set("dueAmount", e.target.value)} />
          {errors.dueAmount && <span className="text-sm text-error-600 mt-1">{errors.dueAmount}</span>}
        </div>
        <div className="flex flex-col">
          <label className="form-label">Paid amount</label>
          <Input type="number" value={form.paidAmount} onChange={(e) => set("paidAmount", e.target.value)} />
          {errors.paidAmount && <span className="text-sm text-error-600 mt-1">{errors.paidAmount}</span>}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-3">
        <Button type="button" onClick={() => dispatch(toggleModal({ isModalVisible: false }))} className="px-4 py-2 text-sm">Cancel</Button>
        <Button type="submit" className="btn-primary">{isModalForEdit ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
}
