import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const createView = createAsyncThunk("View/Create", async (model) => {
  if (model.action !== "reset") {
    try {
        console.log("API URL:",  process.env.REACT_APP_HOST);
      const response = await axios({
        method: "POST",
        url: process.env.REACT_APP_HOST + `/create-view`,
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

const createViewSlice = createSlice({
  name: "createView",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createView.pending, (state) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(createView.fulfilled, (state, action) => {
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
      .addCase(createView.rejected, (state) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const createViewSelectors = (state) => state.createView; // Export a selector to access the state
export default createViewSlice.reducer;
