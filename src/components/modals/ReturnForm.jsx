import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/ReturnView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { returnSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

const blankItem = () => ({
  drug: "",
  quantity: 1,
  unitPrice: 0,
  reason: "DAMAGED",
  condition: "NEW",
});

const initial = () => ({
  returnType: "CUSTOMER_RETURN",
  returnDate: new Date().toISOString().slice(0, 10),
  customer: "",
  supplier: "",
  totalAmount: 0,
  processedBy: "",
  notes: "",
});

const itemsFromModal = (md) =>
  Array.isArray(md?.items) && md.items.length
    ? md.items.map((i) => ({
        drug: typeof i.drug === "object" ? i.drug?._id ?? "" : i.drug ?? "",
        quantity: Number(i.quantity) || 1,
        unitPrice: Number(i.unitPrice) || 0,
        reason: i.reason ?? "DAMAGED",
        condition: i.condition ?? "NEW",
      }))
    : [blankItem()];

export default function ReturnForm() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.user.userId);
  const isModalForEdit = useSelector((s) => s.returnView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.returnView.isModalVisible);
  const modalData = useSelector((s) => s.returnView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initial);
  const [items, setItems] = useState([blankItem()]);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [d, c, s, st] = await Promise.all([
          getHandler("/drugs?limit=1000"),
          getHandler("/customers?limit=1000"),
          getHandler("/suppliers?limit=1000"),
          getHandler("/staff?limit=1000"),
        ]);
        setDrugs(Array.isArray(d.data) ? d.data : []);
        setCustomers(Array.isArray(c.data) ? c.data : []);
        setSuppliers(Array.isArray(s.data) ? s.data : []);
        setStaff(Array.isArray(st.data) ? st.data : []);
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
          typeof modalData.customer === "object" ? modalData.customer?._id ?? "" : modalData.customer ?? "",
        supplier:
          typeof modalData.supplier === "object" ? modalData.supplier?._id ?? "" : modalData.supplier ?? "",
        processedBy:
          typeof modalData.processedBy === "object" ? modalData.processedBy?._id ?? "" : modalData.processedBy ?? "",
        returnDate: modalData.returnDate
          ? String(modalData.returnDate).slice(0, 10)
          : initial().returnDate,
      });
      setItems(itemsFromModal(modalData));
    } else {
      setForm(initial());
      setItems([blankItem()]);
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  const updateItem = (idx, patch) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const addRow = () => setItems((prev) => [...prev, blankItem()]);
  const removeRow = (idx) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const totalAmount = items.reduce(
    (s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(returnSchema, {
      ...form,
      totalAmount: Number(totalAmount.toFixed(2)),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = {
        ...validation.data,
        returnDate: new Date(validation.data.returnDate),
        items: items.map((i) => ({
          drug: i.drug,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
          reason: i.reason,
          condition: i.condition,
        })),
        processedBy: form.processedBy || userId,
      };
      if (form.returnType !== "CUSTOMER_RETURN") delete payload.customer;
      else delete payload.supplier;
      if (form.returnType !== "SUPPLIER_RETURN") delete payload.supplier;
      else delete payload.customer;
      if (!payload.customer) delete payload.customer;
      if (!payload.supplier) delete payload.supplier;
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/returns/${modalData._id}`, payload);
      } else {
        await postHandler("/returns", payload);
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
        <Field label="Type" error={errors.returnType}>
          <select className="txt-input" value={form.returnType} onChange={(e) => set("returnType", e.target.value)}>
            <option value="CUSTOMER_RETURN">CUSTOMER_RETURN</option>
            <option value="SUPPLIER_RETURN">SUPPLIER_RETURN</option>
            <option value="DAMAGED_GOODS">DAMAGED_GOODS</option>
            <option value="EXPIRED_DRUGS">EXPIRED_DRUGS</option>
          </select>
        </Field>
        <Field label="Return date" error={errors.returnDate}>
          <Input type="date" value={form.returnDate} onChange={(e) => set("returnDate", e.target.value)} />
        </Field>
        {form.returnType === "CUSTOMER_RETURN" && (
          <Field label="Customer" error={errors.customer}>
            <select className="txt-input" value={form.customer} onChange={(e) => set("customer", e.target.value)}>
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.fullName}</option>
              ))}
            </select>
          </Field>
        )}
        {form.returnType === "SUPPLIER_RETURN" && (
          <Field label="Supplier" error={errors.supplier}>
            <select className="txt-input" value={form.supplier} onChange={(e) => set("supplier", e.target.value)}>
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>{s.fullName}</option>
              ))}
            </select>
          </Field>
        )}
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

      <div className="flex flex-col gap-2">
        <label className="form-label">Items</label>
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <select className="txt-input" value={it.drug} onChange={(e) => updateItem(idx, { drug: e.target.value })}>
                <option value="">Select drug</option>
                {drugs.map((d) => (
                  <option key={d._id} value={d._id}>{d.generic?.name ?? d.brandId ?? d._id}</option>
                ))}
              </select>
            </div>
            <div className="w-20">
              <Input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
            </div>
            <div className="w-24">
              <Input type="number" step="0.01" placeholder="Price" value={it.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} />
            </div>
            <div className="w-36">
              <select className="txt-input" value={it.reason} onChange={(e) => updateItem(idx, { reason: e.target.value })}>
                {["DAMAGED","EXPIRED","WRONG_ITEM","WRONG_QUANTITY","PATIENT_DECEASED","ADVERSE_REACTION","NOT_NEEDED","RECALL","QUALITY_ISSUE","OTHER"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="w-28">
              <select className="txt-input" value={it.condition} onChange={(e) => updateItem(idx, { condition: e.target.value })}>
                {["NEW","OPENED","DAMAGED","EXPIRED"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Button type="button" onClick={() => removeRow(idx)} aria-label="Remove">
              <AiFillDelete className="w-5 h-5 text-error-600" />
            </Button>
          </div>
        ))}
        <Button type="button" icon={<AiOutlinePlus className="inline" />} txt="Add item" onClick={addRow} style="btn-test-data" />
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <span className="font-medium">Total</span>
        <span className="font-semibold">{totalAmount.toFixed(2)}</span>
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
