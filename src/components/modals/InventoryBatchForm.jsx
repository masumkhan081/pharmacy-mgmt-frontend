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

const STATUSES = [
  "AVAILABLE",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "EXPIRED",
  "RECALLED",
  "RECALLED_RETURNED",
];

const initial = () => ({
  drugId: "",
  batchNumber: "",
  lotNumber: "",
  expirationDate: "",
  initialQuantity: 0,
  currentQuantity: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  status: "AVAILABLE",
  isActive: true,
});

const drugLabel = (d) => d?.name ?? d?.brand?.name ?? d?.generic?.name ?? d?.id ?? "";

export default function InventoryBatchForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.inventoryView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.inventoryView.isModalVisible);
  const modalData = useSelector((s) => s.inventoryView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const d = await getHandler("/drugs?limit=1000");
        setDrugs(Array.isArray(d.data) ? d.data : []);
      } catch (err) {
        console.error("Failed to fetch drugs:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      const idOf = (v) => (typeof v === "object" ? v?.id ?? "" : v ?? "");
      setForm({
        ...initial(),
        drugId: modalData.drugId ?? idOf(modalData.drug) ?? "",
        batchNumber: modalData.batchNumber ?? "",
        lotNumber: modalData.lotNumber ?? "",
        expirationDate: modalData.expirationDate
          ? String(modalData.expirationDate).slice(0, 10)
          : "",
        initialQuantity: Number(modalData.initialQuantity ?? 0),
        currentQuantity: Number(modalData.currentQuantity ?? 0),
        purchasePrice: Number(modalData.purchasePrice ?? 0),
        sellingPrice: Number(modalData.sellingPrice ?? 0),
        status: modalData.status ?? "AVAILABLE",
        isActive:
          modalData.isActive === undefined ? true : Boolean(modalData.isActive),
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(inventoryBatchSchema, {
      ...form,
      initialQuantity: Number(form.initialQuantity),
      currentQuantity: Number(form.currentQuantity),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.lotNumber) delete payload.lotNumber;
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/inventory-batches/${modalData.id}`, payload);
      } else {
        await postHandler("/inventory-batches", payload);
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
        <Field label="Drug" error={errors.drugId}>
          <select className="txt-input" value={form.drugId} onChange={(e) => set("drugId", e.target.value)}>
            <option value="">Select drug</option>
            {drugs.map((d) => (
              <option key={d.id} value={d.id}>{drugLabel(d)}</option>
            ))}
          </select>
        </Field>
        <Field label="Status" error={errors.status}>
          <select className="txt-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Batch number" error={errors.batchNumber}>
          <Input value={form.batchNumber} onChange={(e) => set("batchNumber", e.target.value)} />
        </Field>
        <Field label="Lot number" error={errors.lotNumber}>
          <Input value={form.lotNumber} onChange={(e) => set("lotNumber", e.target.value)} />
        </Field>
        <Field label="Expiration date" error={errors.expirationDate}>
          <Input type="date" value={form.expirationDate} onChange={(e) => set("expirationDate", e.target.value)} />
        </Field>
        <Field label="Active" error={errors.isActive}>
          <select className="txt-input" value={form.isActive ? "yes" : "no"} onChange={(e) => set("isActive", e.target.value === "yes")}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Initial qty" error={errors.initialQuantity}>
          <Input type="number" value={form.initialQuantity} onChange={(e) => set("initialQuantity", e.target.value)} />
        </Field>
        <Field label="Current qty" error={errors.currentQuantity}>
          <Input type="number" value={form.currentQuantity} onChange={(e) => set("currentQuantity", e.target.value)} />
        </Field>
        <Field label="Purchase price" error={errors.purchasePrice}>
          <Input type="number" step="0.01" value={form.purchasePrice} onChange={(e) => set("purchasePrice", e.target.value)} />
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
