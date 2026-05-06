import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/PrescriptionView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { prescriptionSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

const blankMed = () => ({
  drug: "",
  dosage: "",
  frequency: "",
  duration: { value: 1, unit: "days" },
  quantity: 1,
});

const initial = () => ({
  customer: "",
  doctor: "",
  prescriptionNumber: "",
  expiryDate: "",
  notes: "",
});

const medsFromModal = (md) =>
  Array.isArray(md?.medications) && md.medications.length
    ? md.medications.map((m) => ({
        drug: typeof m.drug === "object" ? m.drug?._id ?? "" : m.drug ?? "",
        dosage: m.dosage ?? "",
        frequency: m.frequency ?? "",
        duration: {
          value: Number(m.duration?.value) || 1,
          unit: m.duration?.unit ?? "days",
        },
        quantity: Number(m.quantity) || 1,
      }))
    : [blankMed()];

export default function PrescriptionForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.prescriptionView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.prescriptionView.isModalVisible);
  const modalData = useSelector((s) => s.prescriptionView.modalData);
  const [customers, setCustomers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState(initial);
  const [meds, setMeds] = useState([blankMed()]);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [c, d, dr] = await Promise.all([
          getHandler("/customers?limit=1000"),
          getHandler("/doctors?limit=1000"),
          getHandler("/drugs?limit=1000"),
        ]);
        setCustomers(Array.isArray(c.data) ? c.data : []);
        setDoctors(Array.isArray(d.data) ? d.data : []);
        setDrugs(Array.isArray(dr.data) ? dr.data : []);
      } catch (err) {
        console.error("Failed to fetch options:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      setForm({
        ...initial(),
        ...modalData,
        customer:
          typeof modalData.customer === "object"
            ? modalData.customer?._id ?? ""
            : modalData.customer ?? "",
        doctor:
          typeof modalData.doctor === "object"
            ? modalData.doctor?._id ?? ""
            : modalData.doctor ?? "",
        expiryDate: modalData.expiryDate
          ? String(modalData.expiryDate).slice(0, 10)
          : "",
      });
      setMeds(medsFromModal(modalData));
    } else {
      setForm(initial());
      setMeds([blankMed()]);
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  const updateMed = (idx, patch) =>
    setMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  const updateMedDuration = (idx, patch) =>
    setMeds((prev) =>
      prev.map((m, i) =>
        i === idx ? { ...m, duration: { ...m.duration, ...patch } } : m
      )
    );
  const addMed = () => setMeds((prev) => [...prev, blankMed()]);
  const removeMed = (idx) =>
    setMeds((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(prescriptionSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = {
        ...validation.data,
        expiryDate: new Date(validation.data.expiryDate),
        medications: meds.map((m) => ({
          drug: m.drug,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: { value: Number(m.duration.value), unit: m.duration.unit },
          quantity: Number(m.quantity),
        })),
      };
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/prescriptions/${modalData._id}`, payload);
      } else {
        await postHandler("/prescriptions", payload);
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
        <Field label="Customer" error={errors.customer}>
          <select className="txt-input" value={form.customer} onChange={(e) => set("customer", e.target.value)}>
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>{c.fullName}</option>
            ))}
          </select>
        </Field>
        <Field label="Doctor" error={errors.doctor}>
          <select className="txt-input" value={form.doctor} onChange={(e) => set("doctor", e.target.value)}>
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>{d.fullName}</option>
            ))}
          </select>
        </Field>
        <Field label="Prescription #" error={errors.prescriptionNumber}>
          <Input value={form.prescriptionNumber} onChange={(e) => set("prescriptionNumber", e.target.value)} />
        </Field>
        <Field label="Expiry date" error={errors.expiryDate}>
          <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} />
        </Field>
        <Field label="Notes" error={errors.notes}>
          <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <label className="form-label">Medications</label>
        {meds.map((m, idx) => (
          <div key={idx} className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <select className="txt-input" value={m.drug} onChange={(e) => updateMed(idx, { drug: e.target.value })}>
                <option value="">Select drug</option>
                {drugs.map((d) => (
                  <option key={d._id} value={d._id}>{d.generic?.name ?? d.brandId ?? d._id}</option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <Input placeholder="Dosage" value={m.dosage} onChange={(e) => updateMed(idx, { dosage: e.target.value })} />
            </div>
            <div className="w-32">
              <Input placeholder="Frequency" value={m.frequency} onChange={(e) => updateMed(idx, { frequency: e.target.value })} />
            </div>
            <div className="w-20">
              <Input type="number" placeholder="Dur" value={m.duration.value} onChange={(e) => updateMedDuration(idx, { value: Number(e.target.value) })} />
            </div>
            <div className="w-28">
              <select className="txt-input" value={m.duration.unit} onChange={(e) => updateMedDuration(idx, { unit: e.target.value })}>
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
                <option value="ongoing">ongoing</option>
              </select>
            </div>
            <div className="w-20">
              <Input type="number" placeholder="Qty" value={m.quantity} onChange={(e) => updateMed(idx, { quantity: Number(e.target.value) })} />
            </div>
            <Button type="button" onClick={() => removeMed(idx)} aria-label="Remove">
              <AiFillDelete className="w-5 h-5 text-error-600" />
            </Button>
          </div>
        ))}
        <Button type="button" icon={<AiOutlinePlus className="inline" />} txt="Add medication" onClick={addMed} style="btn-test-data" />
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
