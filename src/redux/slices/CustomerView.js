import { makeGenericViewSlice } from "./GenericView";

const slice = makeGenericViewSlice("customerView");
export const {
  toggleModal,
  setModaldata,
  checkSingle,
  checkAll,
  bumpRefresh,
} = slice.actions;
export default slice.reducer;
