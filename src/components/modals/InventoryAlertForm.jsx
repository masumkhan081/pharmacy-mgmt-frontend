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
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = () => ({
  drug: "",
  title: "",
  message: "",
  severity: "MEDIUM",
  isResolved: false,
});

const drugLabel = (d) => d?.name ?? d?.brand?.name ?? d?.generic?.name ?? d?.id ?? "";

export default function InventoryAlertForm() {
  const dispatch = useDispatch();
  const toast = useToast();
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
        toast.error(`Failed to fetch drugs: ${err.message}`);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      const idOf = (v) => (typeof v === "object" ? v?.id ?? "" : v ?? "");
      setForm({
        ...initial(),
        drug: idOf(modalData.drug) || modalData.drugId || "",
        title: modalData.title ?? "",
        message: modalData.message ?? "",
        severity: modalData.severity ?? "MEDIUM",
        isResolved: Boolean(modalData.isResolved),
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(inventoryAlertSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/inventory-alerts/${modalData.id}`, payload);
      } else {
        await postHandler("/inventory-alerts", payload);
      }
      toast.success(`Alert ${isModalForEdit ? "updated" : "created"}`);
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
              <option key={d.id} value={d.id}>{drugLabel(d)}</option>
            ))}
          </select>
        </Field>
        <Field label="Severity" error={errors.severity}>
          <select className="txt-input" value={form.severity} onChange={(e) => set("severity", e.target.value)}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </Field>
        <Field label="Title" error={errors.title}>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Resolved" error={errors.isResolved}>
          <select className="txt-input" value={form.isResolved ? "yes" : "no"} onChange={(e) => set("isResolved", e.target.value === "yes")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>
      </div>
      <Field label="Message" error={errors.message}>
        <Input value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
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
