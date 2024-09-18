import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/loginSlice";
import createUserSlice from "../features/createUserSlice";
import getBookSlice from "../features/getBookSlice";
export const store = configureStore({
  reducer: {
    login: loginSlice,
    createUser: createUserSlice,
   getBook: getBookSlice
  },
});
