import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const getTable = createAsyncThunk("table/get", async (model) => {
  if (model.action !== "reset") {
    try {
        console.log("API URL:",  process.env.REACT_APP_HOST);
      const response = await axios({
        method: "GET",
        url: process.env.REACT_APP_HOST + `/get-table`,
        headers: {
          "Content-Type": "application/json",
        },
        data: model.data,
      });
   
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

const getTableSlice = createSlice({
  name: "getTable",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getTable.pending, (state) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(getTable.fulfilled, (state, action) => {
        const record = action.payload;
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
            state.message = record.message;
          }
        }
      })
      .addCase(getTable.rejected, (state) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const getTableSelectors = (state) => state.getTable; // Export a selector to access the state
export default getTableSlice.reducer;
