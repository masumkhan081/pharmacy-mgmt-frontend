import { useSelector, useDispatch } from "react-redux";
import Button from "../components/common-ui/Button";
import PageTitle from "../components/common-ui/PageTitle";
import ViewFilterDrugs from "../components/tabularViews/ViewFilterDrugs";
import SearchFilter from "../components/common-ui/SearchFilter";
import { AiOutlinePlus } from "react-icons/ai";
//
import { Outlet } from "react-router-dom";
import DrugForm from "../components/modals/DrugForm";
import MFRForm from "../components/modals/MFRForm";
import UnitForm from "../components/modals/UnitForm";
import GroupForm from "../components/modals/GroupForm";
import GenericForm from "../components/modals/GenericForm";
import BrandForm from "../components/modals/BrandForm";
import FormulationForm from "../components/modals/FormulationForm";
import ModalWrapper from "../components/modals/ModalWrapper";
import { toggleModal } from "../redux/slices/DrugsView";

export default function Drugs() {
  //
  const dispatch = useDispatch();
  const isModalVisible = useSelector((state) => state.drugsView.isModalVisible);
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const currentView = useSelector((state) => state.drugsView.currentView);

  const getModalTitle = () => {
    if (!currentView) return "";
    const action = isModalForEdit ? "Edit" : "Add";
    return `${action} ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`;
  };

  return (
    <div className="w-full flex flex-col gap-1.25 md:px-0.38 pt-1.5">
      <PageTitle title={currentView} />
      <div className="flex justify-between md:flex-row flex-col gap-2">
        <ViewFilterDrugs />

        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt={` ${currentView}`}
          onClick={() => {
            dispatch(
              toggleModal({ isModalForEdit: false, isModalVisible: true })
            );
          }}
          style={`btn_primary`}
        />

        <ModalWrapper
          isVisible={isModalVisible}
          onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
          title={getModalTitle()}
        >
          {currentView == "brands" && <BrandForm />}
          {currentView == "stock" && <DrugForm />}
          {currentView == "formulations" && <FormulationForm />}
          {currentView == "generics" && <GenericForm />}
          {currentView == "groups" && <GroupForm />}
          {currentView == "units" && <UnitForm />}
          {currentView == "manufacturers" && <MFRForm />}
        </ModalWrapper>
      </div>
      <SearchFilter />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
