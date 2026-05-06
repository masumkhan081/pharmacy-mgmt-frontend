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
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function DrugForm() {
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((s) => s.drugsView.isModalForEdit);
  const isModalVisible = useSelector((s) => s.drugsView.isModalVisible);
  const modalData = useSelector((s) => s.drugsView.modalData);
  const [groups, setGroups] = useState([]);
  const [generics, setGenerics] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("select-one");
  const [selectedGeneric, setSelectedGeneric] = useState("select-one");
  const [selectedMFR, setSelectedMFR] = useState("select-one");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [g, m] = await Promise.all([
          getHandler("/groups?limit=1000"),
          getHandler("/manufacturers?limit=1000"),
        ]);
        setGroups(Array.isArray(g.data) ? g.data : []);
        setManufacturers(Array.isArray(m.data) ? m.data : []);
      } catch (err) {
        console.error("Failed to fetch lookups:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedGroup === "select-one") {
      setGenerics([]);
      return;
    }
    (async () => {
      try {
        const { data } = await getHandler(`/generics?group=${selectedGroup}&limit=1000`);
        setGenerics(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch generics:", err.message);
      }
    })();
  }, [selectedGroup]);

  useEffect(() => {
    if (!isModalVisible) return;
    if (isModalForEdit && modalData?._id) {
      const idOf = (v) => (typeof v === "object" ? v?._id ?? "select-one" : v ?? "select-one");
      setName(modalData.name ?? "");
      setSelectedGroup(idOf(modalData.groupId));
      setSelectedGeneric(idOf(modalData.genericId ?? modalData.generic));
      setSelectedMFR(idOf(modalData.mfrId ?? modalData.manufacturer));
    } else {
      setName("");
      setSelectedGroup("select-one");
      setSelectedGeneric("select-one");
      setSelectedMFR("select-one");
    }
    setErrors({});
  }, [isModalVisible, modalData?._id, isModalForEdit]);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      name,
      genericId: selectedGeneric === "select-one" ? undefined : selectedGeneric,
      mfrId: selectedMFR === "select-one" ? undefined : selectedMFR,
    };
    const validation = validateData(drugSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    try {
      if (isModalForEdit && modalData?._id) {
        await patchHandler(`/drugs/${modalData._id}`, validation.data);
      } else {
        await postHandler("/drugs", validation.data);
      }
      dispatch(bumpRefresh());
      dispatch(toggleModal({ isModalVisible: false }));
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSave}>
      {errors._form && <div className="text-sm text-error-600">{errors._form}</div>}
      <div className="flex flex-col">
        <label className="form-label">Drug Name</label>
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

      <div className="mt-4">
        <label className="form-label">Group</label>
        <select
          className="txt-input"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option disabled value="select-one">Select One</option>
          {groups.map((grp) => (
            <option key={grp._id} value={grp._id}>{grp.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="form-label">Generic</label>
        <select
          className="txt-input"
          value={selectedGeneric}
          onChange={(e) => {
            setSelectedGeneric(e.target.value);
            setErrors({ ...errors, genericId: null });
          }}
        >
          <option disabled value="select-one">Select One</option>
          {generics.map((gen) => (
            <option key={gen._id} value={gen._id}>{gen.name}</option>
          ))}
        </select>
        {errors.genericId && <span className="text-sm text-error-600 mt-1">{errors.genericId}</span>}
      </div>

      <div className="mt-4">
        <label className="form-label">Manufacturer</label>
        <select
          className="txt-input"
          value={selectedMFR}
          onChange={(e) => setSelectedMFR(e.target.value)}
        >
          <option disabled value="select-one">Select One</option>
          {manufacturers.map((mfr) => (
            <option key={mfr._id} value={mfr._id}>{mfr.name}</option>
          ))}
        </select>
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
