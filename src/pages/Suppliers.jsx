import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import SupplierForm from "../components/modals/SupplierForm";
import SupplierTbl from "../components/tabularViews/SupplierTbl";
import { toggleModal } from "../redux/slices/SupplierView";

export default function Suppliers() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.supplierView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.supplierView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Suppliers" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Supplier`}
      >
        <SupplierForm />
      </ModalWrapper>
      <SupplierTbl />
    </div>
  );
}
