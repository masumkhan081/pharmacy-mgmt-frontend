
import PageTitle from "../components/common-ui/PageTitle";
import ViewFilterStaff from "../components/tabularViews/ViewFilterStaff";
import Button from "../components/common-ui/Button";
import SearchFilter from "../components/common-ui/SearchFilter";
import { Outlet } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import SalaryForm from "../components/modals/SalaryForm";
import AttendanceForm from "../components/modals/AttendanceForm";
import MemberForm from "../components/modals/MemberForm";
import ModalWrapper from "../components/modals/ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import { tblOptionsStaffPage } from "../ui-config/table";
import { toggleModal } from "../redux/slices/StaffView";
import { ENTITIES } from "../ui-config/entities";

export default function Staff() {
  //
  const dispatch = useDispatch();
  const currentView = useSelector((state) => state.staffView.currentView);
  const isModalVisible = useSelector((state) => state.staffView.isModalVisible);
  const isModalForEdit = useSelector((state) => state.staffView.isModalForEdit);

  const getModalTitle = () => {
    if (!currentView) return "";
    const action = isModalForEdit ? "Edit" : "Add";
    return `${action} ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`;
  };

  //
  return (
    <div className="w-full  flex flex-col gap-6 md:px-6 pt-6">
      <PageTitle title={currentView} />
      <div className="flex justify-between md:flex-row flex-col gap-3">
        <ViewFilterStaff />

        <Button
          icon={<AiOutlinePlus className="inline text-white" />}
          txt={` ${currentView}`}
          onClick={() => {
            dispatch(
              toggleModal({ isModalForEdit: false, isModalVisible: true })
            );
          }}
          style={`btn-primary`}
        />
        
        <ModalWrapper
          isVisible={isModalVisible}
          onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
          title={getModalTitle()}
        >
          {currentView === ENTITIES.salary && <SalaryForm />}
          {currentView === ENTITIES.attendance && <AttendanceForm />}
          {currentView === ENTITIES.member && <MemberForm />}
        </ModalWrapper>
      </div>

      <SearchFilter />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
