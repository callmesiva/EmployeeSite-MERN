import { configureStore } from "@reduxjs/toolkit";
import EmployeeSlice from "./EmployeeSlice";
const Store = configureStore({
  reducer: {
    employee: EmployeeSlice,
  },
});

export default Store;
