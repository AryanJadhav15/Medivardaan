"use client";

import { configureStore,combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

import authreducer from "@/store/slices/authSlice";
import parameterTypeReducer from "@/store/slices/parameterType";
import headerData from "@/store/slices/headerSlice";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";




const rootReducer = combineReducers({
 auth:authreducer,
        parameterType:parameterTypeReducer,
        headerData:headerData,
})


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["parameterType", "headerData"], // only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
