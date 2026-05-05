import React, { useEffect, useState } from "react";
import {
  setGroups,
  setGenerics,
  setManufacturers,
  toggleModal,
} from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { useDispatch, useSelector } from "react-redux";
import { drugSchema } from "../../schemas/drug.schema";
import { validateData } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function DrugForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const modalData = useSelector((state) => state.drugsView.modalData);
  const formulations = useSelector((state) => state.drugsView.formulations);
  const groups = useSelector((state) => state.drugsView.groups);
  const generics = useSelector((state) => state.drugsView.generics);
  const manufacturers = useSelector((state) => state.drugsView.manufacturers);

  const [name, setName] = useState(
    isModalForEdit == true ? modalData.name : ""
  );
  const [selectedGroup, setSelectedGroup] = useState("select-one");
  const [selectedGeneric, setSelectedGeneric] = useState("select-one");
  const [selectedMFR, setSelectedMFR] = useState("select-one");
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    const validation = validateData(drugSchema, {
      name,
      genericId: selectedGeneric,
      mfrId: selectedMFR !== "select-one" ? selectedMFR : undefined,
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    try {
      await postHandler("/drugs", {
        name,
        genericId: selectedGeneric,
        mfrId: selectedMFR !== "select-one" ? selectedMFR : undefined,
      });
      setName("");
      setSelectedGroup("select-one");
      setSelectedGeneric("select-one");
      setSelectedMFR("select-one");
    } catch (err) {
      setErrors(
        err.errors?.reduce((a, e) => ({ ...a, [e.field]: e.message }), {}) ?? {
          _form: err.message,
        }
      );
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/generics?group=" + selectedGroup);
        dispatch(setGenerics(data));
      } catch (err) {
        console.error("Failed to fetch generics:", err.message);
      }
    };
    if (selectedGroup !== "select-one") {
      fetch();
    }
  }, [selectedGroup]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
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
        {errors.name && (
          <span className="text-sm text-error-600 mt-1">{errors.name}</span>
        )}
      </div>
      
      <div className="mt-4">
        <label className="form-label">Select Group</label>
        <select
          className="txt-input"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option disabled value="select-one">
            Select One
          </option>
          {groups &&
            groups?.map((grp, ind) => {
              return (
                <option key={ind} value={grp._id}>
                  {grp.name}
                </option>
              );
            })}
        </select>
      </div>

      <div className="mt-4">
        <label className="form-label">Select Generic</label>
        <select
          className="txt-input"
          value={selectedGeneric}
          onChange={(e) => {
            setSelectedGeneric(e.target.value);
            setErrors({ ...errors, genericId: null });
          }}
        >
          <option disabled value="select-one">
            Select One
          </option>
          {generics &&
            generics?.map((gen, ind) => {
              return (
                <option key={ind} value={gen._id}>
                  {gen.name}
                </option>
              );
            })}
        </select>
        {errors.genericId && (
          <span className="text-sm text-error-600 mt-1">{errors.genericId}</span>
        )}
      </div>

      <div className="mt-4">
        <label className="form-label">Select Manufacturer</label>
        <select
          className="txt-input"
          value={selectedMFR}
          onChange={(e) => setSelectedMFR(e.target.value)}
        >
          <option disabled value="select-one">
            Select One
          </option>
          {manufacturers &&
            manufacturers?.map((mfr, ind) => {
              return (
                <option key={ind} value={mfr._id}>
                  {mfr.name}
                </option>
              );
            })}
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <Button
          type="button"
          onClick={() => dispatch(toggleModal({ isModalVisible: false }))}
          className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
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
