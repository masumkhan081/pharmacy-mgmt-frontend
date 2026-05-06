import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import PageTitle from "../components/common-ui/PageTitle";
import ViewFilterStaff from "../components/tabularViews/ViewFilterStaff";
import SalaryForm from "../components/modals/SalaryForm";
import AttendanceForm from "../components/modals/AttendanceForm";
import MemberForm from "../components/modals/MemberForm";
import ModalWrapper from "../components/modals/ModalWrapper";
import { toggleModal } from "../redux/slices/StaffView";
import { ENTITIES } from "../ui-config/entities";

export default function Staff() {
  const dispatch = useDispatch();
  const currentView = useSelector((state) => state.staffView.currentView);
  const isModalVisible = useSelector((state) => state.staffView.isModalVisible);
  const isModalForEdit = useSelector((state) => state.staffView.isModalForEdit);

  const getModalTitle = () => {
    if (!currentView) return "";
    const action = isModalForEdit ? "Edit" : "Add";
    return `${action} ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`;
  };

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title={currentView} />
      <ViewFilterStaff />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={getModalTitle()}
      >
        {currentView === ENTITIES.salary && <SalaryForm />}
        {currentView === ENTITIES.attendance && <AttendanceForm />}
        {currentView === ENTITIES.member && <MemberForm />}
      </ModalWrapper>
      <Outlet />
    </div>
  );
}
