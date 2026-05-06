import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/NotificationView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { notificationSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const TYPES = [
  "INVENTORY_ALERT",
  "EXPIRY_ALERT",
  "REFILL_REMINDER",
  "PRESCRIPTION_EXPIRY",
  "PAYMENT_DUE",
  "SYSTEM_ALERT",
  "CUSTOMER_BIRTHDAY",
  "ORDER_STATUS",
  "NEW_CUSTOMER",
  "REGULATORY_REMINDER",
  "STAFF_REMINDER",
  "CUSTOM",
];

const initial = () => ({
  type: "SYSTEM_ALERT",
  title: "",
  message: "",
  priority: "MEDIUM",
});

export default function NotificationForm() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.user.userId);
  const isModalForEdit = useSelector((s) => s.notificationView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.notificationView.isModalVisible);
  const modalData = useSelector((s) => s.notificationView.modalData);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      setForm({ ...initial(), ...modalData });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(notificationSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const body = {
        ...validation.data,
      };
      if (!isModalForEdit) {
        body.recipients = [
          {
            recipientType: "ADMIN",
            recipientId: userId,
            channel: "IN_APP",
          },
        ];
        body.action = { type: "NONE" };
      }
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/notifications/${modalData._id}`, body);
      } else {
        await postHandler("/notifications", body);
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
      <Field label="Type" error={errors.type}>
        <select className="txt-input" value={form.type} onChange={(e) => set("type", e.target.value)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Title" error={errors.title}>
        <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Message" error={errors.message}>
        <Input value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
      <Field label="Priority" error={errors.priority}>
        <select className="txt-input" value={form.priority} onChange={(e) => set("priority", e.target.value)}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
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
