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
import { inventoryAlertSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = (userId = "") => ({
  drug: "",
  minThreshold: 10,
  maxThreshold: 100,
  reorderPoint: 20,
  reorderQuantity: 50,
  preferredSupplier: "",
  autoReorder: false,
  isActive: true,
  createdBy: userId,
});

export default function InventoryAlertForm() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.user.userId);
  const isModalForEdit = useSelector((s) => s.inventoryView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.inventoryView.isModalVisible);
  const modalData = useSelector((s) => s.inventoryView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initial(userId));
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [d, s] = await Promise.all([
          getHandler("/drugs?limit=1000"),
          getHandler("/suppliers?limit=1000"),
        ]);
        setDrugs(Array.isArray(d.data) ? d.data : []);
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
        ...initial(userId),
        ...modalData,
        drug: idOf(modalData.drug),
        preferredSupplier: idOf(modalData.preferredSupplier),
        createdBy: idOf(modalData.createdBy) || userId,
      });
    } else {
      setForm(initial(userId));
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit, userId]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      ...form,
      minThreshold: Number(form.minThreshold),
      maxThreshold: Number(form.maxThreshold),
      reorderPoint: Number(form.reorderPoint),
      reorderQuantity: Number(form.reorderQuantity),
      createdBy: form.createdBy || userId,
    };
    const validation = validateData(inventoryAlertSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const body = { ...validation.data };
      if (!body.preferredSupplier) delete body.preferredSupplier;
      if (isModalForEdit && modalData?._id) {
        body.updatedBy = userId;
        await patchHandler(`/inventory-alerts/${modalData._id}`, body);
      } else {
        await postHandler("/inventory-alerts", body);
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
        <Field label="Preferred supplier" error={errors.preferredSupplier}>
          <select className="txt-input" value={form.preferredSupplier} onChange={(e) => set("preferredSupplier", e.target.value)}>
            <option value="">—</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>{s.fullName}</option>
            ))}
          </select>
        </Field>
        <Field label="Min threshold" error={errors.minThreshold}>
          <Input type="number" value={form.minThreshold} onChange={(e) => set("minThreshold", e.target.value)} />
        </Field>
        <Field label="Max threshold" error={errors.maxThreshold}>
          <Input type="number" value={form.maxThreshold} onChange={(e) => set("maxThreshold", e.target.value)} />
        </Field>
        <Field label="Reorder point" error={errors.reorderPoint}>
          <Input type="number" value={form.reorderPoint} onChange={(e) => set("reorderPoint", e.target.value)} />
        </Field>
        <Field label="Reorder qty" error={errors.reorderQuantity}>
          <Input type="number" value={form.reorderQuantity} onChange={(e) => set("reorderQuantity", e.target.value)} />
        </Field>
        <Field label="Auto reorder" error={errors.autoReorder}>
          <select className="txt-input" value={form.autoReorder ? "yes" : "no"} onChange={(e) => set("autoReorder", e.target.value === "yes")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>
        <Field label="Active" error={errors.isActive}>
          <select className="txt-input" value={form.isActive ? "yes" : "no"} onChange={(e) => set("isActive", e.target.value === "yes")}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
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
