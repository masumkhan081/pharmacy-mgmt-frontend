import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import ViewFilterFinance from "../components/tabularViews/ViewFilterFinance";
import InvoiceForm from "../components/modals/InvoiceForm";
import PaymentForm from "../components/modals/PaymentForm";
import { toggleModal } from "../redux/slices/FinanceView";
import { ENTITIES } from "../ui-config/entities";

export default function Finance() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.financeView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.financeView.isModalForEdit);
  const currentView = useSelector((s) => s.financeView.currentView);

  const title = currentView === ENTITIES.payment ? "Payment" : "Invoice";

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title={`${title}s`} />
      <ViewFilterFinance />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} ${title}`}
      >
        {currentView === ENTITIES.payment ? <PaymentForm /> : <InvoiceForm />}
      </ModalWrapper>
      <Outlet />
    </div>
  );
}
