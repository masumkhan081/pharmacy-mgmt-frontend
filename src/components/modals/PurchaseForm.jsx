import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/purchView";
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

const blankItem = () => ({ drug: "", quantity: 1, unitPrice: 0 });
const initial = () => ({
  purchaseAt: new Date().toISOString().slice(0, 16),
  items: [blankItem()],
});

const itemsFromModal = (md) =>
  Array.isArray(md?.drugs) && md.drugs.length
    ? md.drugs.map((d) => ({
        drug: typeof d.drug === "object" ? d.drug?._id ?? "" : d.drug ?? "",
        quantity: Number(d.quantity) || 1,
        unitPrice: Number(d.unitPrice) || 0,
      }))
    : [blankItem()];

export default function PurchaseForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.purchView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.purchView.isModalVisible);
  const modalData = useSelector((s) => s.purchView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [purchaseAt, setPurchaseAt] = useState(initial().purchaseAt);
  const [items, setItems] = useState(initial().items);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHandler("/drugs?limit=1000");
        setDrugs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch drugs:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      setPurchaseAt(
        modalData.purchaseAt
          ? new Date(modalData.purchaseAt).toISOString().slice(0, 16)
          : initial().purchaseAt
      );
      setItems(itemsFromModal(modalData));
    } else {
      setPurchaseAt(initial().purchaseAt);
      setItems(initial().items);
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  const updateItem = (idx, patch) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const addRow = () => setItems((prev) => [...prev, blankItem()]);
  const removeRow = (idx) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const bill = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      purchaseAt: new Date(purchaseAt),
      drugs: items.map((it) => ({
        drug: it.drug,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
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
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/purchases/${modalData._id}`, validation.data);
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
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <div className="flex flex-col">
        <label className="form-label">Purchase Date</label>
        <Input
          type="datetime-local"
          value={purchaseAt}
          onChange={(e) => setPurchaseAt(e.target.value)}
        />
        {errors.purchaseAt && <span className="text-sm text-error-600 mt-1">{errors.purchaseAt}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="form-label">Items</label>
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2 items-end">
            <div className="flex-1">
              <select
                className="txt-input"
                value={it.drug}
                onChange={(e) => updateItem(idx, { drug: e.target.value })}
              >
                <option value="">Select drug</option>
                {drugs.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.generic?.name ?? d.brandId ?? d._id}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <Input
                type="number"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
              />
            </div>
            <div className="w-28">
              <Input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={it.unitPrice}
                onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
              />
            </div>
            <Button type="button" onClick={() => removeRow(idx)} aria-label="Remove row">
              <AiFillDelete className="w-5 h-5 text-error-600" />
            </Button>
          </div>
        ))}
        {errors.drugs && <span className="text-sm text-error-600">{errors.drugs}</span>}
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
        <Button type="button" onClick={() => dispatch(toggleModal({ isModalVisible: false }))} className="px-4 py-2 text-sm">
          Cancel
        </Button>
        <Button type="submit" className="btn-primary">
          {isModalForEdit ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
