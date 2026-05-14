import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal, bumpRefresh } from "../../redux/slices/purchView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { purchaseSchema } from "../../schemas/purchase.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

const blankItem = () => ({
  drug: "",
  quantity: 1,
  purchasePrice: 0,
  mrp: 0,
  batchNumber: "",
  expirationDate: "",
});

const initial = () => ({
  purchaseAt: new Date().toISOString().slice(0, 16),
  supplier: "",
  items: [blankItem()],
});

const itemsFromModal = (md) =>
  Array.isArray(md?.drugs) && md.drugs.length
    ? md.drugs.map((d) => ({
        drug: typeof d.drug === "object" ? d.drug?.id ?? "" : d.drug ?? "",
        quantity: Number(d.quantity) || 1,
        purchasePrice: Number(d.purchasePrice ?? d.unitPrice) || 0,
        mrp: Number(d.mrp) || 0,
        batchNumber: d.batchNumber ?? "",
        expirationDate: d.expirationDate
          ? String(d.expirationDate).slice(0, 10)
          : "",
      }))
    : [blankItem()];

export default function PurchaseForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.purchView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.purchView.isModalVisible);
  const modalData = useSelector((s) => s.purchView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseAt, setPurchaseAt] = useState(initial().purchaseAt);
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState(initial().items);
  const [errors, setErrors] = useState({});

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
    if (isModalForEdit && modalData?.id) {
      setPurchaseAt(
        modalData.purchaseAt
          ? new Date(modalData.purchaseAt).toISOString().slice(0, 16)
          : initial().purchaseAt
      );
      setSupplier(
        typeof modalData.supplier === "object"
          ? modalData.supplier?.id ?? ""
          : modalData.supplier ?? ""
      );
      setItems(itemsFromModal(modalData));
    } else {
      setPurchaseAt(initial().purchaseAt);
      setSupplier("");
      setItems(initial().items);
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  const updateItem = (idx, patch) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  const addRow = () => setItems((prev) => [...prev, blankItem()]);
  const removeRow = (idx) =>
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );

  const bill = items.reduce(
    (sum, it) =>
      sum + (Number(it.quantity) || 0) * (Number(it.purchasePrice) || 0),
    0
  );

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      purchaseAt: new Date(purchaseAt),
      ...(supplier ? { supplier } : {}),
      drugs: items.map((it) => ({
        drug: it.drug,
        quantity: Number(it.quantity),
        purchasePrice: Number(it.purchasePrice),
        mrp: Number(it.mrp),
        batchNumber: it.batchNumber,
        expirationDate: it.expirationDate ? new Date(it.expirationDate) : "",
      })),
      bill: Number(bill.toFixed(2)),
    };
    const validation = validateData(purchaseSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/purchases/${modalData.id}`, validation.data);
      } else {
        await postHandler("/purchases", validation.data);
      }
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      {errors._form && (
        <div className="text-sm text-error-600">{errors._form}</div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Purchase date" error={errors.purchaseAt}>
          <Input
            type="datetime-local"
            value={purchaseAt}
            onChange={(e) => setPurchaseAt(e.target.value)}
          />
        </Field>
        <Field label="Supplier" error={errors.supplier}>
          <select
            className="txt-input"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">—</option>
            {suppliers.map((s) => (
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
                onChange={(e) => updateItem(idx, { drug: e.target.value })}
              >
                <option value="">Select drug</option>
                {drugs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name ?? d.brand?.name ?? d.id}
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
                placeholder="Cost"
                value={it.purchasePrice}
                onChange={(e) =>
                  updateItem(idx, { purchasePrice: Number(e.target.value) })
                }
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                step="0.01"
                placeholder="MRP"
                value={it.mrp}
                onChange={(e) =>
                  updateItem(idx, { mrp: Number(e.target.value) })
                }
              />
            </div>
            <div className="w-28">
              <Input
                placeholder="Batch #"
                value={it.batchNumber}
                onChange={(e) =>
                  updateItem(idx, { batchNumber: e.target.value })
                }
              />
            </div>
            <div className="w-36">
              <Input
                type="date"
                value={it.expirationDate}
                onChange={(e) =>
                  updateItem(idx, { expirationDate: e.target.value })
                }
              />
            </div>
            <Button
              type="button"
              onClick={() => removeRow(idx)}
              aria-label="Remove row"
            >
              <AiFillDelete className="w-5 h-5 text-error-600" />
            </Button>
          </div>
        ))}
        {errors.drugs && (
          <span className="text-sm text-error-600">{errors.drugs}</span>
        )}
        <Button
          type="button"
          icon={<AiOutlinePlus className="inline" />}
          txt="Add item"
          onClick={addRow}
          style="btn-test-data"
        />
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <span className="font-medium">Bill</span>
        <span className="font-semibold">{bill.toFixed(2)}</span>
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
          {isModalForEdit ? "Update" : "Save"}
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
