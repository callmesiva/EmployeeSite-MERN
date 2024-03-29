import { createSlice } from "@reduxjs/toolkit";

const EmployeeSlice = createSlice({
  name: "employee",
  initialState: {
    employeeData: [],
  },
  reducers: {
    addEmployeeData: (state, actions) => {
      const newData = actions.payload;
      if (Array.isArray(newData)) {
        state.employeeData = newData;
      } else {
        state.employeeData.push(newData);
      }
    },

    updateEmployeeData: (state, actions) => {
      const index = state.employeeData.findIndex(
        (employee) => employee._id == actions.payload._id
      );
      if (index !== -1) {
        state.employeeData[index] = actions.payload;
      }
    },

    deleteEmployeeData: (state, actions) => {
      let arr = [
        ...state.employeeData.filter((data) => data._id != actions.payload._id),
      ];
      if (arr.length === 0) state.employeeData = ["empty"];
      else state.employeeData = arr;
    },
  },
});

export const { addEmployeeData, deleteEmployeeData, updateEmployeeData } =
  EmployeeSlice.actions;
export default EmployeeSlice.reducer;
