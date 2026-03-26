import React, { useEffect, useState } from "react";
import {
  setGroups,
  setGenerics,
  setManufacturers,
  toggleModal,
} from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { useDispatch, useSelector } from "react-redux";
import { genericSchema } from "../../schemas/drug.schema";
import { validateData } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function GenericForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const modalData = useSelector((state) => state.drugsView.modalData);
  const groups = useSelector((state) => state.drugsView.groups);
  const generics = useSelector((state) => state.drugsView.generics);
  const [selectedGroup, setSelectedGroup] = useState(
    isModalForEdit == true ? modalData.groupId : "select-one"
  );
  const [name, setName] = useState(
    isModalForEdit == true ? modalData.name : ""
  );
  const [errors, setErrors] = useState({});
  //

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form data
    const validation = validateData(genericSchema, { name, groupId: selectedGroup });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    const response = await postHandler("/generic", { name, groupId: selectedGroup });
    console.log("resp: - generic-- ", JSON.stringify(response));
    
    // Reset form on success
    if (response?.success) {
      setName("");
      setSelectedGroup("select-one");
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/generics/" + selectedGroup);
      dispatch(setGenerics(data.data.generics));
    };
    if (selectedGroup !== "select-one") {
      fetch();
    }
  }, [selectedGroup]);
  //
  useEffect(() => {
    const fetch = async () => {
      let data = await getHandler("/groups/all");
      dispatch(setGroups({ data: data?.data?.groups }));
    };
    fetch();
  }, []);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col">
        <label className="lbl_form">Select Group</label>
        <select
          className="txt_inp_form"
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

      <div className="flex flex-col mt-4">
        <label className="lbl_form">Existing Generics</label>
        <select className="txt_inp_form">
          <option disabled>Select existing generic</option>
          {generics &&
            generics?.map((gen, ind) => {
              return <option key={ind}>{gen.name}</option>;
            })}
        </select>
      </div>
      
      <div className="flex flex-col mt-4">
        <label className="lbl_form">New Generic Name</label>
        <Input
          className="txt_inp_form"
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

      <div className="flex items-center justify-end gap-3 mt-6">
        <Button
          type="button"
          onClick={() => dispatch(toggleModal({ isModalVisible: false }))}
          className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        >
          Cancel
        </Button>
        <Button type="submit" className="btn_primary">
          {isModalForEdit ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
