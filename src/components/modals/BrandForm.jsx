import React, { useEffect, useState } from "react";
import {
  setGroups,
  setGenerics,
  setManufacturers,
  toggleModal,
} from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { useDispatch, useSelector } from "react-redux";
import { brandSchema } from "../../schemas/drug.schema";
import { validateData } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function BrandForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const toggleModal = useSelector((state) => state.drugsView.toggleModal);
  const modalData = useSelector((state) => state.drugsView.modalData);
  const [selectedGroup, setSelectedGroup] = useState(
    isModalForEdit == true ? modalData.grpId : "select-one"
  );
  const [selectedGeneric, setSelectedGeneric] = useState(
    isModalForEdit == true ? modalData.genId : "select-one"
  );
  const [name, setName] = useState(
    isModalForEdit == true ? modalData.name : ""
  );
  const [selectedMFR, setSelectedMFR] = useState(
    isModalForEdit == true ? modalData.mfrId : "select-one"
  );
  const [errors, setErrors] = useState({});
  //
  const groups = useSelector((state) => state.drugsView.groups);
  const generics = useSelector((state) => state.drugsView.generics);
  const manufacturers = useSelector((state) => state.drugsView.manufacturers);
  //
  async function handleSave(e) {
    e.preventDefault();

    const validation = validateData(brandSchema, {
      name,
      groupId: selectedGroup,
      genericId: selectedGeneric,
      mfrId: selectedMFR,
    });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    try {
      await postHandler("/brands", {
        name,
        groupId: selectedGroup,
        genericId: selectedGeneric,
        mfrId: selectedMFR,
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
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const groupsRes = await getHandler("/groups");
        dispatch(setGroups({ data: groupsRes.data }));
        const mfrsRes = await getHandler("/manufacturers");
        dispatch(setManufacturers({ data: mfrsRes.data }));
      } catch (err) {
        console.error("Failed to fetch lookups:", err.message);
      }
    };
    if (visible) fetch();
  }, []);

  return (
    <form onSubmit={handleSave}>
      <div className="flex flex-col">
        <label className="form-label">Brand Name</label>
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
          onChange={(e) => {
            setSelectedGroup(e.target.value);
            setErrors({ ...errors, groupId: null });
          }}
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
        {errors.groupId && (
          <span className="text-sm text-error-600 mt-1">{errors.groupId}</span>
        )}
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
          onChange={(e) => {
            setSelectedMFR(e.target.value);
            setErrors({ ...errors, mfrId: null });
          }}
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
        {errors.mfrId && (
          <span className="text-sm text-error-600 mt-1">{errors.mfrId}</span>
        )}
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
