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
import { genericSchema } from "../../schemas/drug.schema";
import { validateData, apiErrorsToFields } from "../../utils/validation";
import { useToast } from "../common-ui/Toast";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function GenericForm() {
  const dispatch = useDispatch();
  const toast = useToast();
  const isModalForEdit = useSelector((s) => s.drugsView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.drugsView.isModalVisible);
  const modalData = useSelector((s) => s.drugsView.modalData);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("select-one");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHandler("/groups?limit=1000");
        setGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(`Failed to fetch groups: ${err.message}`);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?.id) {
      setName(modalData.name ?? "");
      setSelectedGroup(
        typeof modalData.groupId === "object"
          ? modalData.groupId?.id ?? "select-one"
          : modalData.groupId ?? "select-one"
      );
    } else {
      setName("");
      setSelectedGroup("select-one");
    }
    setErrors({});
  }, [isModalVisible, modalData?.id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = { name, groupId: selectedGroup === "select-one" ? undefined : selectedGroup };
    const validation = validateData(genericSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?.id) {
        await patchHandler(`/generics/${modalData.id}`, validation.data);
      } else {
        await postHandler("/generics", validation.data);
      }
      toast.success(`Generic ${isModalForEdit ? "updated" : "created"}`);
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form onSubmit={handleSave}>
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <div className="flex flex-col">
        <label className="form-label">Select Group</label>
        <select
          className="txt-input"
          value={selectedGroup}
          onChange={(e) => {
            setSelectedGroup(e.target.value);
            setErrors({ ...errors, groupId: null });
          }}
        >
          <option disabled value="select-one">Select One</option>
          {groups.map((grp) => (
            <option key={grp.id} value={grp.id}>{grp.name}</option>
          ))}
        </select>
        {errors.groupId && <span className="text-sm text-error-600 mt-1">{errors.groupId}</span>}
      </div>

      <div className="flex flex-col mt-4">
        <label className="form-label">Generic Name</label>
        <Input
          className="txt-input"
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({ ...errors, name: null });
          }}
        />
        {errors.name && <span className="text-sm text-error-600 mt-1">{errors.name}</span>}
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
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
