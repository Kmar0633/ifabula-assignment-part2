import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/loginSlice";
import createUserSlice from "../features/createUserSlice";
import getBookSlice from "../features/getBookSlice";
import updateBookSlice from "../features/updateBookSlice";
import getAllCustomersSlice from "../features/getAllCustomersSlice";
import getTableSlice from "../features/getTableSlice";
import createTableSlice from "../features/createTableSlice";
export const store = configureStore({
  reducer: {
    login: loginSlice,
    createUser: createUserSlice,
    updateBook:updateBookSlice,
    getBook: getBookSlice,
    createTable: createTableSlice,
    getTable: getTableSlice,
    getAllCustomers: getAllCustomersSlice,
  },
});
