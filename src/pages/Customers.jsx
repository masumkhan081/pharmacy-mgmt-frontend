import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import CustomerForm from "../components/modals/CustomerForm";
import CustomerTbl from "../components/tabularViews/CustomerTbl";
import { toggleModal } from "../redux/slices/CustomerView";

export default function Customers() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.customerView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.customerView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Customers" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Customer`}
      >
        <CustomerForm />
      </ModalWrapper>
      <CustomerTbl />
    </div>
  );
}
