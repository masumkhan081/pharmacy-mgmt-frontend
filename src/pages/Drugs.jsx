import { useSelector, useDispatch } from "react-redux";
import Button from "../components/common-ui/Button";
import PageTitle from "../components/common-ui/PageTitle";
import ViewFilterDrugs from "../components/tabularViews/ViewFilterDrugs";
import SearchFilter from "../components/common-ui/SearchFilter";
import { AiOutlinePlus } from "react-icons/ai";
//
import { Outlet } from "react-router-dom";
import DrugForm from "../components/drugs/DrugForm";
import MFRForm from "../components/drugs/MFRForm";
import UnitForm from "../components/drugs/UnitForm";
import GroupForm from "../components/drugs/GroupForm";
import GenericForm from "../components/drugs/GenericForm";
import BrandForm from "../components/drugs/BrandForm";
import FormulationForm from "../components/drugs/FormulationForm";
import { toggleModal } from "../redux/slices/DrugsView";

export default function Drugs() {
  //
  const dispatch = useDispatch();
  // const [isModalVisible, setDropDown] = useState(false);
  // const [menuFolded, setMenuFolded] = useState(true);

  // const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
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
          onClick={() => {
            dispatch(
              toggleModal({ isModalForEdit: false, isModalVisible: true })
            );
          }}
          style={`btn_test_data`}
        />

        <div
          className={
            isModalVisible
              ? "flex flex-col gap-4 sm:px-4 px-2 py-4 absolute z-10 sm:w-[500px] w-full sm:mx-auto mx-2 right-0 left-0 border border-yellow-800 rounded-md bg-slate-200"
              : `hidden`
          }
        >
          <div className=" flex justify-end">
            <Button
              txt="Close"
              onClick={() => dispatch(toggleModal({ isModalVisible: false }))}
            />
          </div>
          {currentView == "brands" && <BrandForm />}
          {currentView == "stock" && <DrugForm />}
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
