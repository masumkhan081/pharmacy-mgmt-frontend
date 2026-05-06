import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import ViewFilterInventory from "../components/tabularViews/ViewFilterInventory";
import InventoryBatchForm from "../components/modals/InventoryBatchForm";
import InventoryAlertForm from "../components/modals/InventoryAlertForm";
import { toggleModal } from "../redux/slices/InventoryView";
import { ENTITIES } from "../ui-config/entities";

export default function Inventory() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.inventoryView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.inventoryView.isModalForEdit);
  const currentView = useSelector((s) => s.inventoryView.currentView);

  const title = currentView === ENTITIES.inventoryAlert ? "Alert" : "Batch";

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title={`Inventory ${title}s`} />
      <ViewFilterInventory />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} ${title}`}
      >
        {currentView === ENTITIES.inventoryAlert ? (
          <InventoryAlertForm />
        ) : (
          <InventoryBatchForm />
        )}
      </ModalWrapper>
      <Outlet />
    </div>
  );
}
