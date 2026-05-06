import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import NotificationForm from "../components/modals/NotificationForm";
import NotificationTbl from "../components/tabularViews/NotificationTbl";
import { toggleModal } from "../redux/slices/NotificationView";

export default function Notifications() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.notificationView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.notificationView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Notifications" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Notification`}
      >
        <NotificationForm />
      </ModalWrapper>
      <NotificationTbl />
    </div>
  );
}
