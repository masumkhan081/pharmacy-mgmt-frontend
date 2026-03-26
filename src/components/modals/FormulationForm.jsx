import React, { useEffect, useState } from "react";
import { setFormulations, toggleModal } from "../../redux/slices/DrugsView";
import { getHandler, postHandler } from "../../utils/handlerReqRes";
import { useDispatch, useSelector } from "react-redux";
import { formulationSchema } from "../../schemas/drug.schema";
import { validateData } from "../../utils/validation";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function FormulationForm({ visible, setDropDown }) {
  //
  const dispatch = useDispatch();
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const modalData = useSelector((state) => state.drugsView.modalData);
  const formulations = useSelector((state) => state.drugsView.formulations);
  const [name, setName] = useState(
    isModalForEdit == true ? modalData.name : ""
  );
  const [errors, setErrors] = useState({});

  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/formulations/all");
      dispatch(setFormulations({ data: data?.data?.formulations }));
    };
    fetch();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    
    // Validate form data
    const validation = validateData(formulationSchema, { name });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    const response = await postHandler("/formulations", { name });
    console.log("resp: - formulations-- ", JSON.stringify(response));
    
    // Reset form on success
    if (response?.success) {
      setName("");
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSave}>
      <div className="flex flex-col">
        <label className="lbl_form">Formulation Name</label>
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
      
      <div className="flex flex-col mt-4">
        <label className="lbl_form">Existing Formulations</label>
        <select className="txt_inp_form">
          <option disabled>Existing Formulations</option>
          {formulations &&
            formulations?.map((frm, ind) => {
              return (
                <option key={ind} disabled>
                  {frm.name}
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
        <Button type="submit" className="btn_primary">
          {isModalForEdit ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
