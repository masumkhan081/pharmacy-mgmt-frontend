import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  bumpRefresh,
} from "../../redux/slices/NotificationView";
import { postHandler, patchHandler } from "../../utils/handlerReqRes";
import { notificationSchema } from "../../schemas/common.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

const initial = () => ({
  title: "",
  message: "",
  userId: "",
  isRead: false,
});

export default function NotificationForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalForEdit = useSelector((s) => s.notificationView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.notificationView.isModalVisible);
  const modalData = useSelector((s) => s.notificationView.modalData);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      setForm({
        ...initial(),
        title: modalData.title ?? "",
        message: modalData.message ?? "",
        userId: modalData.userId ?? "",
        isRead: Boolean(modalData.isRead),
      });
    } else {
      setForm(initial());
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const validation = validateData(notificationSchema, form);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      const payload = { ...validation.data };
      if (!payload.userId) delete payload.userId;
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/notifications/${modalData.id}`, payload);
      } else {
        await postHandler("/notifications", payload);
      }
      toast.success(`Notification ${isModalForEdit ? "updated" : "created"}`);
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <Field label="Title" error={errors.title}>
        <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Message" error={errors.message}>
        <Input value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
      <Field label="User ID (optional)" error={errors.userId}>
        <Input value={form.userId} onChange={(e) => set("userId", e.target.value)} placeholder="UUID of target user" />
      </Field>
      <Field label="Read" error={errors.isRead}>
        <select className="txt-input" value={form.isRead ? "yes" : "no"} onChange={(e) => set("isRead", e.target.value === "yes")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
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
