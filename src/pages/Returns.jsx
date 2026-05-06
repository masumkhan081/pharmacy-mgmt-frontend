import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/common-ui/PageTitle";
import ModalWrapper from "../components/modals/ModalWrapper";
import ReturnForm from "../components/modals/ReturnForm";
import ReturnTbl from "../components/tabularViews/ReturnTbl";
import { toggleModal } from "../redux/slices/ReturnView";

export default function Returns() {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((s) => s.returnView.isModalVisible);
  const isModalForEdit = useSelector((s) => s.returnView.isModalForEdit);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Returns" />
      <ModalWrapper
        isVisible={isModalVisible}
        onClose={() => dispatch(toggleModal({ isModalVisible: false }))}
        title={`${isModalForEdit ? "Edit" : "Add"} Return`}
      >
        <ReturnForm />
      </ModalWrapper>
      <ReturnTbl />
    </div>
  );
}
