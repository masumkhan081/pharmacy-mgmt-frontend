import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import DoctorForm from "../components/modals/DoctorForm";
import DoctorTbl from "../components/tabularViews/DoctorTbl";
import { toggleModal } from "../redux/slices/DoctorView";

export default function Doctors() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.doctorView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.doctorView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Doctors" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Doctor`}
      >
        <DoctorForm />
      </ModalWrapper>
      <DoctorTbl />
    </div>
  );
}
