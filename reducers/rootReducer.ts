import authReducer from "@/reducers/slices/authSlice";
import adminSubscriptionReducer from "@/reducers/slices/adminSubscriptionSlice";
import flatReducer from "@/reducers/slices/flatSlice";
import billingReducer from "@/reducers/slices/billingSlice";
import adminPaymentReducer from "@/reducers/slices/adminPaymentSlice";
import residentBillingReducer from "@/reducers/slices/residentBillingSlice";
import dashboardReducer from "@/reducers/slices/dashboardSlice";
import reportsReducer from "@/reducers/slices/reportSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const rootReducer = combineReducers({
    auth: authReducer,
    adminSubscription: adminSubscriptionReducer,
    flat: flatReducer,
    billing: billingReducer,
    adminPayment: adminPaymentReducer,
    residentSubscriptionBilling: residentBillingReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "billing", "adminPayment", "residentSubscriptionBilling", "dashboard", "reports"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;