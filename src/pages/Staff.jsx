
import PageTitle from "../components/common-ui/PageTitle";
import ViewFilterStaff from "../components/tabularViews/ViewFilterStaff";
import Button from "../components/common-ui/Button";
import SearchFilter from "../components/common-ui/SearchFilter";
import { Outlet } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import SalaryForm from "../components/staff/SalaryForm";
import AttendanceForm from "../components/staff/AttendanceForm";
import MemberForm from "../components/staff/MemberForm";
import { useDispatch, useSelector } from "react-redux";
import { tblOptionsStaffPage } from "../ui-config/table";
import { toggleModal } from "../redux/slices/StaffView";
import { ENTITIES } from "../ui-config/entities";

export default function Staff() {
  //
  const dispatch = useDispatch();
  // const toggleModal = useSelector((state) => state.drugsView.toggleModal)
  // const modalData = useSelector((state) => state.drugsView.modalData)
  const currentView = useSelector((state) => state.staffView.currentView);
  const isModalVisible = useSelector((state) => state.staffView.isModalVisible);

  //
  return (
    <div className="w-full  flex flex-col gap-1.5 md:px-0.38 pt-1.5">
      <PageTitle title={currentView} />
      <div className="flex justify-between md:flex-row flex-col gap-3">
        <ViewFilterStaff />

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
          {currentView === ENTITIES.salary && <SalaryForm />}
          {currentView === ENTITIES.attendance && <AttendanceForm />}
          {currentView === ENTITIES.member && <MemberForm />}
        </div>
      </div>

      <SearchFilter />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
