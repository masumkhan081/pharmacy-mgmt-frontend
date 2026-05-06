import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/FinanceView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { paymentSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const METHODS = [
  "CASH",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "MOBILE_BANKING",
  "BANK_TRANSFER",
  "INSURANCE",
  "OTHER",
];

const initial = () => ({
  invoice: "",
  amount: 0,
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "CASH",
  notes: "",
  processedBy: "",
});

export default function PaymentForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.financeView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.financeView.isModalVisible);
  const modalData = useSelector((s) => s.financeView.modalData);
  const [invoices, setInvoices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [i, s] = await Promise.all([
          getHandler("/invoices?limit=1000"),
          getHandler("/staff?limit=1000"),
        ]);
        setInvoices(Array.isArray(i.data) ? i.data : []);
        setStaff(Array.isArray(s.data) ? s.data : []);
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
        invoice:
          typeof modalData.invoice === "object" ? modalData.invoice?._id ?? "" : modalData.invoice ?? "",
        processedBy:
          typeof modalData.processedBy === "object" ? modalData.processedBy?._id ?? "" : modalData.processedBy ?? "",
        paymentDate: modalData.paymentDate
          ? String(modalData.paymentDate).slice(0, 10)
          : initial().paymentDate,
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(paymentSchema, {
      ...form,
      amount: Number(form.amount),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const body = {
        ...validation.data,
        paymentDate: new Date(validation.data.paymentDate),
        processedBy: form.processedBy,
      };
      if (!body.invoice) delete body.invoice;
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/payments/${modalData._id}`, body);
      } else {
        await postHandler("/payments", body);
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
        <Field label="Invoice (optional)" error={errors.invoice}>
          <select className="txt-input" value={form.invoice} onChange={(e) => set("invoice", e.target.value)}>
            <option value="">—</option>
            {invoices.map((i) => (
              <option key={i._id} value={i._id}>{i.invoiceNumber}</option>
            ))}
          </select>
        </Field>
        <Field label="Amount" error={errors.amount}>
          <Input type="number" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
        </Field>
        <Field label="Date" error={errors.paymentDate}>
          <Input type="date" value={form.paymentDate} onChange={(e) => set("paymentDate", e.target.value)} />
        </Field>
        <Field label="Method" error={errors.paymentMethod}>
          <select className="txt-input" value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)}>
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Processed by" error={errors.processedBy}>
          <select className="txt-input" value={form.processedBy} onChange={(e) => set("processedBy", e.target.value)}>
            <option value="">Select staff</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>{s.fullName}</option>
            ))}
          </select>
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
