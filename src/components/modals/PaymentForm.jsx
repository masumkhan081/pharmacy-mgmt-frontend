import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal, bumpRefresh } from "../../redux/slices/FinanceView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { paymentSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

// Payments are IMMUTABLE on the backend (no PATCH, no DELETE).
// This form only supports creation; processedBy is injected by the controller from req.user.

const METHODS = ["CASH", "CARD", "MOBILE_BANKING"];

const initial = () => ({
  invoiceId: "",
  amount: 0,
  method: "CASH",
  notes: "",
});

export default function PaymentForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalVisible = useSelector((s) => s.financeView.isModalVisible);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHandler("/invoices?limit=1000");
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(`Failed to fetch invoices: ${err.message}`);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    setForm(initial());
    setErrors({});
  }, [isModalVisible]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      invoiceId: form.invoiceId,
      amount: Number(form.amount),
      method: form.method,
      ...(form.notes ? { notes: form.notes } : {}),
    };
    const validation = validateData(paymentSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      await postHandler("/payments", validation.data);
      toast.success("Payment recorded");
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      {errors._form && (
        <div className="text-sm text-error-600">{errors._form}</div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Invoice" error={errors.invoiceId}>
          <select
            className="txt-input"
            value={form.invoiceId}
            onChange={(e) => set("invoiceId", e.target.value)}
          >
            <option value="">Select invoice</option>
            {invoices.map((i) => (
              <option key={i.id} value={i.id}>
                {i.invoiceNo ?? i.invoiceNumber ?? i.id}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Amount" error={errors.amount}>
          <Input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
        </Field>
        <Field label="Method" error={errors.method}>
          <select
            className="txt-input"
            value={form.method}
            onChange={(e) => set("method", e.target.value)}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Notes" error={errors.notes}>
          <Input
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 mt-3">
        <Button
          type="button"
          onClick={() => dispatch(toggleModal({ isModalVisible: false }))}
          className="px-4 py-2 text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="btn-primary">
          Save
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
      {error && (
        <span className="text-sm text-error-600 mt-1">{error}</span>
      )}
    </div>
  );
}
