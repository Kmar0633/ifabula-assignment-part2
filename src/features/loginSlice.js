import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const login = createAsyncThunk("user/login", async (model) => {
  if (model.action !== "reset") {
    try {
      const response = await axios({
        method: "POST",
        url: process.env.REACT_APP_HOST + `/login`,
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

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(login.fulfilled, (state, action) => {
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
            state.message=record.message
          }
        }
      })
      .addCase(login.rejected, (state) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const loginSelectors = (state) => state.login; // Export a selector to access the state
export default loginSlice.reducer;
