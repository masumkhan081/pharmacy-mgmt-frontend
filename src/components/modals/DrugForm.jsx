import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/DrugsView";
import {
  getHandler,
  postHandler,
  patchHandler,
} from "../../utils/handlerReqRes";
import { drugSchema } from "../../schemas/drug.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

// Aligned to BE drugSchema:
//   { brand(uuid), formulation(uuid), strength(number), unit(uuid),
//     mrp(number), purchasePrice?(number), status?("ACTIVE"|"INACTIVE") }
//
// The BE service denormalizes `Drug.name` from brand + strength + unit, so we
// don't accept a free-form name in this form. Update path translates the
// short keys (brand/formulation/unit) to Prisma column names (brandId/...)
// before PATCH, matching what drug.service.updateDrug consumes.

const STATUSES = ["ACTIVE", "INACTIVE"];

const initial = () => ({
  brand: "",
  formulation: "",
  strength: 0,
  unit: "",
  mrp: 0,
  purchasePrice: 0,
  status: "ACTIVE",
});

export default function DrugForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalForEdit = useSelector((s) => s.drugsView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.drugsView.isModalVisible);
  const modalData = useSelector((s) => s.drugsView.modalData);
  const [brands, setBrands] = useState([]);
  const [formulations, setFormulations] = useState([]);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [b, f, u] = await Promise.all([
          getHandler("/brands?limit=1000"),
          getHandler("/formulations?limit=1000"),
          getHandler("/units?limit=1000"),
        ]);
        setBrands(Array.isArray(b.data) ? b.data : []);
        setFormulations(Array.isArray(f.data) ? f.data : []);
        setUnits(Array.isArray(u.data) ? u.data : []);
      } catch (err) {
        toast.error(`Failed to fetch lookups: ${err.message}`);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      const idOf = (v) => (typeof v === "object" ? v?.id ?? "" : v ?? "");
      setForm({
        brand: idOf(modalData.brand ?? modalData.brandId),
        formulation: idOf(modalData.formulation ?? modalData.formulationId),
        strength: Number(modalData.strength) || 0,
        unit: idOf(modalData.unit ?? modalData.unitId),
        mrp: Number(modalData.mrp) || 0,
        purchasePrice: Number(modalData.purchasePrice) || 0,
        status: modalData.status ?? "ACTIVE",
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      brand: form.brand,
      formulation: form.formulation,
      strength: Number(form.strength),
      unit: form.unit,
      mrp: Number(form.mrp),
      ...(form.purchasePrice
        ? { purchasePrice: Number(form.purchasePrice) }
        : {}),
      status: form.status,
    };
    const validation = validateData(drugSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?.id) {
        // drug.service.updateDrug reads Prisma column names; translate short keys.
        const updatePayload = {
          brandId: validation.data.brand,
          formulationId: validation.data.formulation,
          unitId: validation.data.unit,
          strength: validation.data.strength,
          mrp: validation.data.mrp,
          ...(validation.data.purchasePrice !== undefined
            ? { purchasePrice: validation.data.purchasePrice }
            : {}),
          ...(validation.data.status
            ? { status: validation.data.status }
            : {}),
        };
        await patchHandler(`/drugs/${modalData.id}`, updatePayload);
      } else {
        await postHandler("/drugs", validation.data);
      }
      toast.success(`Drug ${isModalForEdit ? "updated" : "created"}`);
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      {errors._form && (
        <div className="text-sm text-error-600">{errors._form}</div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Brand" error={errors.brand}>
          <select
            className="txt-input"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Formulation" error={errors.formulation}>
          <select
            className="txt-input"
            value={form.formulation}
            onChange={(e) => set("formulation", e.target.value)}
          >
            <option value="">Select formulation</option>
            {formulations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Strength" error={errors.strength}>
          <Input
            type="number"
            step="0.01"
            value={form.strength}
            onChange={(e) => set("strength", e.target.value)}
          />
        </Field>
        <Field label="Unit" error={errors.unit}>
          <select
            className="txt-input"
            value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
          >
            <option value="">Select unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="MRP" error={errors.mrp}>
          <Input
            type="number"
            step="0.01"
            value={form.mrp}
            onChange={(e) => set("mrp", e.target.value)}
          />
        </Field>
        <Field label="Purchase price" error={errors.purchasePrice}>
          <Input
            type="number"
            step="0.01"
            value={form.purchasePrice}
            onChange={(e) => set("purchasePrice", e.target.value)}
          />
        </Field>
        <Field label="Status" error={errors.status}>
          <select
            className="txt-input"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3 mt-3">
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
