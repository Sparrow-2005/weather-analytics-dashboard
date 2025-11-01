
import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    unit: "C", // Default: Celsius
  },
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === "C" ? "F" : "C";
    },
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
  },
});

export const { toggleUnit, setUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
