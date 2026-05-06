import { makeGenericViewSlice } from "./GenericView";

const slice = makeGenericViewSlice("prescriptionView");
export const {
  toggleModal,
  setModaldata,
  checkSingle,
  checkAll,
  bumpRefresh,
} = slice.actions;
export default slice.reducer;
