import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/saleView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { saleSchema } from "../../schemas/sale.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

const blankItem = () => ({ drug: "", quantity: 1, mrp: 0 });
const initial = () => ({
  saleAt: new Date().toISOString().slice(0, 16),
  items: [blankItem()],
});

const itemsFromModal = (md) =>
  Array.isArray(md?.drugs) && md.drugs.length
    ? md.drugs.map((d) => ({
        drug: typeof d.drug === "object" ? d.drug?.id ?? "" : d.drug ?? "",
        quantity: Number(d.quantity) || 1,
        mrp: Number(d.mrp) || 0,
      }))
    : [blankItem()];

export default function SaleForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.saleView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.saleView.isModalVisible);
  const modalData = useSelector((s) => s.saleView.modalData);
  const [drugs, setDrugs] = useState([]);
  const [saleAt, setSaleAt] = useState(initial().saleAt);
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
    if (isModalForEdit && modalData?.id) {
      setSaleAt(
        modalData.saleAt
          ? new Date(modalData.saleAt).toISOString().slice(0, 16)
          : initial().saleAt
      );
      setItems(itemsFromModal(modalData));
    } else {
      setSaleAt(initial().saleAt);
      setItems(initial().items);
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  const updateItem = (idx, patch) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const addRow = () => setItems((prev) => [...prev, blankItem()]);
  const removeRow = (idx) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const bill = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.mrp) || 0),
    0
  );

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      saleAt: new Date(saleAt),
      drugs: items.map((it) => ({
        drug: it.drug,
        quantity: Number(it.quantity),
        mrp: Number(it.mrp),
      })),
      bill: Number(bill.toFixed(2)),
    };
    const validation = validateData(saleSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/sales/${modalData.id}`, validation.data);
      } else {
        await postHandler("/sales", validation.data);
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
        <label className="form-label">Sale Date</label>
        <Input
          type="datetime-local"
          value={saleAt}
          onChange={(e) => setSaleAt(e.target.value)}
        />
        {errors.saleAt && <span className="text-sm text-error-600 mt-1">{errors.saleAt}</span>}
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
                  <option key={d.id} value={d.id}>
                    {d.generic?.name ?? d.brandId ?? d.id}
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
                placeholder="MRP"
                value={it.mrp}
                onChange={(e) => updateItem(idx, { mrp: Number(e.target.value) })}
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
