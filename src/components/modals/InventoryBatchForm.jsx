import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/InventoryView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { inventoryBatchSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = () => ({
  drug: "",
  batchNumber: "",
  lotNumber: "",
  manufacturer: "",
  supplier: "",
  manufactureDate: "",
  expirationDate: "",
  initialQuantity: 0,
  currentQuantity: 0,
  costPrice: 0,
  sellingPrice: 0,
  purchaseDate: new Date().toISOString().slice(0, 10),
  location: "",
});

export default function InventoryBatchForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.inventoryView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.inventoryView.isModalVisible);
  const modalData = useSelector((s) => s.inventoryView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [mfrs, setMfrs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [d, m, s] = await Promise.all([
          getHandler("/drugs?limit=1000"),
          getHandler("/manufacturers?limit=1000"),
          getHandler("/suppliers?limit=1000"),
        ]);
        setDrugs(Array.isArray(d.data) ? d.data : []);
        setMfrs(Array.isArray(m.data) ? m.data : []);
        setSuppliers(Array.isArray(s.data) ? s.data : []);
      } catch (err) {
        console.error("Failed to fetch options:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      const idOf = (v) => (typeof v === "object" ? v?._id ?? "" : v ?? "");
      setForm({
        ...initial(),
        ...modalData,
        drug: idOf(modalData.drug),
        manufacturer: idOf(modalData.manufacturer),
        supplier: idOf(modalData.supplier),
        manufactureDate: modalData.manufactureDate ? String(modalData.manufactureDate).slice(0, 10) : "",
        expirationDate: modalData.expirationDate ? String(modalData.expirationDate).slice(0, 10) : "",
        purchaseDate: modalData.purchaseDate ? String(modalData.purchaseDate).slice(0, 10) : initial().purchaseDate,
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      ...form,
      initialQuantity: Number(form.initialQuantity),
      currentQuantity: Number(form.currentQuantity),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
    };
    const validation = validateData(inventoryBatchSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const body = {
        ...validation.data,
        manufactureDate: new Date(validation.data.manufactureDate),
        expirationDate: new Date(validation.data.expirationDate),
        purchaseDate: new Date(validation.data.purchaseDate),
      };
      if (form.supplier) body.supplier = form.supplier;
      else delete body.supplier;
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/inventory-batches/${modalData._id}`, body);
      } else {
        await postHandler("/inventory-batches", body);
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
        <Field label="Drug" error={errors.drug}>
          <select className="txt-input" value={form.drug} onChange={(e) => set("drug", e.target.value)}>
            <option value="">Select drug</option>
            {drugs.map((d) => (
              <option key={d._id} value={d._id}>{d.generic?.name ?? d._id}</option>
            ))}
          </select>
        </Field>
        <Field label="Manufacturer" error={errors.manufacturer}>
          <select className="txt-input" value={form.manufacturer} onChange={(e) => set("manufacturer", e.target.value)}>
            <option value="">Select manufacturer</option>
            {mfrs.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Supplier (optional)" error={errors.supplier}>
          <select className="txt-input" value={form.supplier} onChange={(e) => set("supplier", e.target.value)}>
            <option value="">—</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>{s.fullName}</option>
            ))}
          </select>
        </Field>
        <Field label="Batch number" error={errors.batchNumber}>
          <Input value={form.batchNumber} onChange={(e) => set("batchNumber", e.target.value)} />
        </Field>
        <Field label="Lot number" error={errors.lotNumber}>
          <Input value={form.lotNumber} onChange={(e) => set("lotNumber", e.target.value)} />
        </Field>
        <Field label="Storage location" error={errors.location}>
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Manufacture date" error={errors.manufactureDate}>
          <Input type="date" value={form.manufactureDate} onChange={(e) => set("manufactureDate", e.target.value)} />
        </Field>
        <Field label="Expiration date" error={errors.expirationDate}>
          <Input type="date" value={form.expirationDate} onChange={(e) => set("expirationDate", e.target.value)} />
        </Field>
        <Field label="Purchase date" error={errors.purchaseDate}>
          <Input type="date" value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} />
        </Field>
        <Field label="Initial qty" error={errors.initialQuantity}>
          <Input type="number" value={form.initialQuantity} onChange={(e) => set("initialQuantity", e.target.value)} />
        </Field>
        <Field label="Current qty" error={errors.currentQuantity}>
          <Input type="number" value={form.currentQuantity} onChange={(e) => set("currentQuantity", e.target.value)} />
        </Field>
        <Field label="Cost price" error={errors.costPrice}>
          <Input type="number" step="0.01" value={form.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
        </Field>
        <Field label="Selling price" error={errors.sellingPrice}>
          <Input type="number" step="0.01" value={form.sellingPrice} onChange={(e) => set("sellingPrice", e.target.value)} />
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
