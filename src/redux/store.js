import { configureStore } from "@reduxjs/toolkit";

import purchSlice from "./slices/purchView";
import saleSlice from "./slices/saleView";
import staffSlice from "./slices/StaffView";
import drugsViewSlice from "./slices/DrugsView";
import userSlice from "./slices/User";
import supplierSlice from "./slices/SupplierView";
import customerSlice from "./slices/CustomerView";
import doctorSlice from "./slices/DoctorView";
import prescriptionSlice from "./slices/PrescriptionView";
import inventorySlice from "./slices/InventoryView";
import financeSlice from "./slices/FinanceView";
import returnSlice from "./slices/ReturnView";
import notificationSlice from "./slices/NotificationView";

export default configureStore({
  reducer: {
    user: userSlice,
    drugsView: drugsViewSlice,
    purchView: purchSlice,
    saleView: saleSlice,
    staffView: staffSlice,
    supplierView: supplierSlice,
    customerView: customerSlice,
    doctorView: doctorSlice,
    prescriptionView: prescriptionSlice,
    inventoryView: inventorySlice,
    financeView: financeSlice,
    returnView: returnSlice,
    notificationView: notificationSlice,
  },
});
