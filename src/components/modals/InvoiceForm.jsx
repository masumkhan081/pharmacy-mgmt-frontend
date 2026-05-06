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
import { invoiceSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

const blankItem = () => ({
  name: "",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  tax: 0,
  totalPrice: 0,
});

const initial = () => ({
  invoiceNumber: "",
  customer: "",
  dueDate: new Date().toISOString().slice(0, 10),
  notes: "",
});

const itemsFromModal = (md) =>
  Array.isArray(md?.items) && md.items.length
    ? md.items.map((i) => ({
        name: i.name ?? "",
        quantity: Number(i.quantity) || 1,
        unitPrice: Number(i.unitPrice) || 0,
        discount: Number(i.discount) || 0,
        tax: Number(i.tax) || 0,
        totalPrice: Number(i.totalPrice) || 0,
      }))
    : [blankItem()];

export default function InvoiceForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.financeView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.financeView.isModalVisible);
  const modalData = useSelector((s) => s.financeView.modalData);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initial);
  const [items, setItems] = useState([blankItem()]);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHandler("/customers?limit=1000");
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch customers:", err.message);
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
        dueDate: modalData.dueDate
          ? String(modalData.dueDate).slice(0, 10)
          : initial().dueDate,
      });
      setItems(itemsFromModal(modalData));
    } else {
      setForm(initial());
      setItems([blankItem()]);
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  const updateItem = (idx, patch) =>
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it;
        const next = { ...it, ...patch };
        next.totalPrice =
          (Number(next.quantity) || 0) * (Number(next.unitPrice) || 0) +
          (Number(next.tax) || 0) -
          (Number(next.discount) || 0);
        return next;
      })
    );
  const addRow = () => setItems((prev) => [...prev, blankItem()]);
  const removeRow = (idx) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const subtotal = items.reduce(
    (s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );
  const taxTotal = items.reduce((s, it) => s + (Number(it.tax) || 0), 0);
  const discountTotal = items.reduce((s, it) => s + (Number(it.discount) || 0), 0);
  const grandTotal = subtotal + taxTotal - discountTotal;

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(invoiceSchema, {
      ...form,
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = {
        ...validation.data,
        dueDate: new Date(validation.data.dueDate),
        items: items.map((it) => ({
          name: it.name,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          discount: Number(it.discount),
          tax: Number(it.tax),
          totalPrice: Number(it.totalPrice),
        })),
      };
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/invoices/${modalData._id}`, payload);
      } else {
        await postHandler("/invoices", payload);
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
        <Field label="Invoice #" error={errors.invoiceNumber}>
          <Input value={form.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} />
        </Field>
        <Field label="Customer" error={errors.customer}>
          <select className="txt-input" value={form.customer} onChange={(e) => set("customer", e.target.value)}>
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>{c.fullName}</option>
            ))}
          </select>
        </Field>
        <Field label="Due date" error={errors.dueDate}>
          <Input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </Field>
        <Field label="Notes" error={errors.notes}>
          <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <label className="form-label">Items</label>
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[140px]">
              <Input placeholder="Name" value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} />
            </div>
            <div className="w-20">
              <Input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
            </div>
            <div className="w-24">
              <Input type="number" step="0.01" placeholder="Unit" value={it.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} />
            </div>
            <div className="w-20">
              <Input type="number" step="0.01" placeholder="Disc" value={it.discount} onChange={(e) => updateItem(idx, { discount: Number(e.target.value) })} />
            </div>
            <div className="w-20">
              <Input type="number" step="0.01" placeholder="Tax" value={it.tax} onChange={(e) => updateItem(idx, { tax: Number(e.target.value) })} />
            </div>
            <div className="w-24">
              <Input type="number" readOnly value={it.totalPrice.toFixed(2)} />
            </div>
            <Button type="button" onClick={() => removeRow(idx)} aria-label="Remove">
              <AiFillDelete className="w-5 h-5 text-error-600" />
            </Button>
          </div>
        ))}
        <Button type="button" icon={<AiOutlinePlus className="inline" />} txt="Add item" onClick={addRow} style="btn-test-data" />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
        <span>Subtotal</span><span className="text-right">{subtotal.toFixed(2)}</span>
        <span>Tax</span><span className="text-right">{taxTotal.toFixed(2)}</span>
        <span>Discount</span><span className="text-right">{discountTotal.toFixed(2)}</span>
        <span className="font-semibold">Grand total</span><span className="text-right font-semibold">{grandTotal.toFixed(2)}</span>
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
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
