import authReducer from "@/reducers/authSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    auth: authReducer
});
