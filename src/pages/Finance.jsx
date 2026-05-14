import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import ViewFilterFinance from "../components/tabularViews/ViewFilterFinance";
import PaymentForm from "../components/modals/PaymentForm";
import { toggleModal } from "../redux/slices/FinanceView";
import { ENTITIES } from "../ui-config/entities";

// Invoices are SERVER-DERIVED from completed sales — there is no
// standalone "create invoice" UI. Only the Payment modal opens here.
export default function Finance() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.financeView.isModalVisible);
  const currentView = useSelector((s) => s.financeView.currentView);
  const isPayment = currentView === ENTITIES.payment;

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title={isPayment ? "Payments" : "Invoices"} />
      <ViewFilterFinance />
      {isPayment && (
        <ModalWrapper
          isVisible={isModalVisible}
          onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
          title="Add Payment"
        >
          <PaymentForm />
        </ModalWrapper>
      )}
      <Outlet />
    </div>
  );
}
