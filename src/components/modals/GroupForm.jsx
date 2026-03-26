import React, { useEffect, useState } from "react";
import {
  setGroups,
  setGenerics,
  setManufacturers,
  toggleModal,
} from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { useDispatch, useSelector } from "react-redux";
import { groupSchema } from "../../schemas/drug.schema";
import { validateData } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function GroupForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const modalData = useSelector((state) => state.drugsView.modalData);
  const groups = useSelector((state) => state.drugsView.groups);
  const [name, setName] = useState(
    isModalForEdit == true ? modalData.name : ""
  );
  const [errors, setErrors] = useState({});
  
  //  
  async function handleSave(e) {
    e.preventDefault();
    
    // Validate form data
    const validation = validateData(groupSchema, { name });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    const response = await postHandler("/groups", { name });
    console.log("resp: - groups-- ", JSON.stringify(response));
    
    // Reset form on success
    if (response?.success) {
      setName("");
    }
  }
  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/groups/all");
      dispatch(setGroups({ data: data?.data?.groups }));
    };
    fetch();
  }, []);

  return (
    <form className="flex flex-col" onSubmit={handleSave}>
      <div className="flex flex-col">
        <label className="lbl_form">Existing Groups</label>
        <select className="txt_inp_form">
          <option disabled>Select existing group</option>
          {groups &&
            groups?.map((grp, ind) => {
              return <option key={ind}>{grp.name}</option>;
            })}
        </select>
      </div>
      
      <div className="flex flex-col mt-4">
        <label className="lbl_form">Group Name</label>
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
