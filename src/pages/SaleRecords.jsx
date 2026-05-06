import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import SaleForm from "../components/modals/SaleForm";
import SaleTbl from "../components/tabularViews/SaleTbl";
import { toggleModal } from "../redux/slices/saleView";

export default function SaleRecords() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.saleView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.saleView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Sales" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Sale`}
      >
        <SaleForm />
      </ModalWrapper>
      <SaleTbl />
    </div>
  );
}
