import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import PrescriptionForm from "../components/modals/PrescriptionForm";
import PrescriptionTbl from "../components/tabularViews/PrescriptionTbl";
import { toggleModal } from "../redux/slices/PrescriptionView";

export default function Prescriptions() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.prescriptionView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.prescriptionView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Prescriptions" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Prescription`}
      >
        <PrescriptionForm />
      </ModalWrapper>
      <PrescriptionTbl />
    </div>
  );
}
