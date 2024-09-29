import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const createTableApi = createAsyncThunk("TableApi/Create", async (model) => {
  if (model.action !== "reset") {
    try {
        console.log("API URL:",  process.env.REACT_APP_HOST);
      const response = await axios({
        method: "POST",
        url: process.env.REACT_APP_HOST + `/create-table-api`,
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

const createTableApiSlice = createSlice({
  name: "createTableApi",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createTableApi.pending, (state) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(createTableApi.fulfilled, (state, action) => {
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
      .addCase(createTableApi.rejected, (state) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const createTableApiSelectors = (state) => state.createTableApi; // Export a selector to access the state
export default createTableApiSlice.reducer;
