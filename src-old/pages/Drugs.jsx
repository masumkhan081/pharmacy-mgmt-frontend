import { useSelector, useDispatch } from "react-redux";
import Button from "../common-ui/Button";
import PageTitle from "../common-ui/PageTitle";
import ViewFilterDrugs from "../components/tabularViews/ViewFilterDrugs";
import SearchFilter from "../components/SearchFilter";
import { AiOutlinePlus } from "react-icons/ai";
//
import { Outlet } from "react-router-dom";
import { useState } from "react";
import DrugForm from "../components/drugs/DrugForm";
import MFRForm from "../components/drugs/MFRForm";
import UnitForm from "../components/drugs/UnitForm";
import GroupForm from "../components/drugs/GroupForm";
import GenericForm from "../components/drugs/GenericForm";
import BrandForm from "../components/drugs/BrandForm";
import FormulationForm from "../components/drugs/FormulationForm";
import { initModal } from "../redux/slices/DrugsView";


export default function Drugs() {
  //
  const dispatch = useDispatch();
  // const [isModalVisible, setDropDown] = useState(false);
  // const [menuFolded, setMenuFolded] = useState(true);

  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const isModalVisible = useSelector((state) => state.drugsView.isModalVisible);
  const currentView = useSelector((state) => state.drugsView.currentView);

  return (
    <div className="w-full flex flex-col gap-1.25 md:px-0.38 pt-1.5">
      <PageTitle title={currentView} />
      <div className="flex justify-between md:flex-row flex-col gap-2">

        <ViewFilterDrugs />

        <Button
          icon={<AiOutlinePlus className="inline text-red-700" />}
          txt={` ${currentView}`}
          onClick={() => { dispatch(initModal({ isModalForEdit: false, isModalVisible: true })) }}
          style={`btn_test_data`}
        />

        <div className={isModalVisible ? "nav_drop_down" : `hidden`}>
          {currentView == "brands" && <BrandForm />}
          {currentView == "drugs" && <DrugForm />}
          {currentView == "formulations" && <FormulationForm />}
          {currentView == "generics" && <GenericForm />}
          {currentView == "groups" && <GroupForm />}
          {currentView == "units" && <UnitForm />}
          {currentView == "manufacturers" && <MFRForm />}
        </div>
      </div>
      <SearchFilter />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
