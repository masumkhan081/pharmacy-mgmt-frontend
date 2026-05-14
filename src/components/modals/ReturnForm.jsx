import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal, bumpRefresh } from "../../redux/slices/ReturnView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { returnSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

// Returns are workflow-driven on the backend:
//   POST /returns               creates a PENDING return (no inventory mutation).
//   POST /returns/:id/approve   triggers transactional stock restoration.
//   POST /returns/:id/reject    no inventory change.
// There is no PATCH route — edit UI is intentionally not offered.

const blankItem = () => ({
  drug: "",
  batch: "",
  quantity: 1,
  unitPrice: 0,
  reason: "",
});

const initial = () => ({
  returnType: "CUSTOMER_RETURN",
  processedBy: "",
});

export default function ReturnForm() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.user?.userId);
  const isModalVisible = useSelector((s) => s.returnView.isModalVisible);
  const [drugs, setDrugs] = useState([]);
  const [batches, setBatches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initial);
  const [items, setItems] = useState([blankItem()]);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [d, b, st] = await Promise.all([
          getHandler("/drugs?limit=1000"),
          getHandler("/inventory-batches?limit=1000"),
          getHandler("/staff?limit=1000"),
        ]);
        setDrugs(Array.isArray(d.data) ? d.data : []);
        setBatches(Array.isArray(b.data) ? b.data : []);
        setStaff(Array.isArray(st.data) ? st.data : []);
      } catch (err) {
        console.error("Failed to fetch options:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    setForm({ ...initial(), processedBy: userId ?? "" });
    setItems([blankItem()]);
    setErrors({});
  }, [isModalVisible, userId]);

  const updateItem = (idx, patch) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  const addRow = () => setItems((prev) => [...prev, blankItem()]);
  const removeRow = (idx) =>
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );

  const batchesForDrug = (drugId) =>
    batches.filter((b) => (b.drugId ?? b.drug?.id) === drugId);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      returnType: form.returnType,
      processedBy: form.processedBy,
      items: items.map((it) => ({
        drug: it.drug,
        batch: it.batch,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        reason: it.reason,
      })),
    };
    const validation = validateData(returnSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      await postHandler("/returns", validation.data);
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
        <Field label="Type" error={errors.returnType}>
          <select
            className="txt-input"
            value={form.returnType}
            onChange={(e) => set("returnType", e.target.value)}
          >
            <option value="CUSTOMER_RETURN">CUSTOMER_RETURN</option>
            <option value="SUPPLIER_RETURN">SUPPLIER_RETURN</option>
          </select>
        </Field>
        <Field label="Processed by" error={errors.processedBy}>
          <select
            className="txt-input"
            value={form.processedBy}
            onChange={(e) => set("processedBy", e.target.value)}
          >
            <option value="">Select staff/user</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <label className="form-label">Items</label>
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <select
                className="txt-input"
                value={it.drug}
                onChange={(e) =>
                  updateItem(idx, { drug: e.target.value, batch: "" })
                }
              >
                <option value="">Select drug</option>
                {drugs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name ?? d.brand?.name ?? d.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-44">
              <select
                className="txt-input"
                value={it.batch}
                onChange={(e) => updateItem(idx, { batch: e.target.value })}
                disabled={!it.drug}
              >
                <option value="">Select batch</option>
                {batchesForDrug(it.drug).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-20">
              <Input
                type="number"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) =>
                  updateItem(idx, { quantity: Number(e.target.value) })
                }
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={it.unitPrice}
                onChange={(e) =>
                  updateItem(idx, { unitPrice: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <Input
                placeholder="Reason"
                value={it.reason}
                onChange={(e) => updateItem(idx, { reason: e.target.value })}
              />
            </div>
            <Button
              type="button"
              onClick={() => removeRow(idx)}
              aria-label="Remove"
            >
              <AiFillDelete className="w-5 h-5 text-error-600" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          icon={<AiOutlinePlus className="inline" />}
          txt="Add item"
          onClick={addRow}
          style="btn-test-data"
        />
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <Button
          type="button"
          onClick={() => dispatch(toggleModal({ isModalVisible: false }))}
          className="px-4 py-2 text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="btn-primary">
          Submit return
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
