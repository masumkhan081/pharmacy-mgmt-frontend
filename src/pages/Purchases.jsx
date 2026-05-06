import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import PurchaseForm from "../components/modals/PurchaseForm";
import PurchTbl from "../components/tabularViews/PurchTbl";
import { toggleModal } from "../redux/slices/purchView";

export default function Purchases() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.purchView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.purchView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Purchases" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Purchase`}
      >
        <PurchaseForm />
      </ModalWrapper>
      <PurchTbl />
    </div>
  );
}
