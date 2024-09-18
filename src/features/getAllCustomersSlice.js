import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const getAllCustomers = createAsyncThunk("user/getAllCustomers", async (model) => {
  if (model.action !== "reset") {
    try {
      const response = await axios({
        method: "GET",
        url: process.env.REACT_APP_HOST + `/customers`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("test",response.data)
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        return error.response.data; // Adjust according to your API error structure
      }
      throw error;
    }
  }

  return { data: "reset" };
});

const getAllCustomersSlice = createSlice({
  name: "getAllCustomers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomers.pending, (state) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        const record = action.payload;
        console.log("record",record)
        if (record.status === 200) {
          state.status = "loaded";
          state.code = record.status;
          state.data = record.data;
        } else {
          if (record.data === "reset") {
            state.status = "idle";
            state.data = "";
            state.code = "";
          } else {
            state.status = "error";
            state.code = record.status;
            state.data = record.data;
          }
        }
      })
      .addCase(getAllCustomers.rejected, (state) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const getAllCustomersSelectors = (state) => state.getAllCustomers; // Export a selector to access the state
export default getAllCustomersSlice.reducer;
