import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer, { handleLogout } from "./user/userSlice";
import createrReducer from "./creater/createrSlice";
import assignerReducer from "./assigner/assignerSlice";

const rootReducer = combineReducers({
  user: userReducer,
  creater: createrReducer,
  assigner: assignerReducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Token Middleware
const tokenMiddleware = (store) => (next) => async (action) => {
  if (action.type.endsWith("/rejected")) {
    const { statusCode } = action.payload || {};
    if (statusCode === 401) {
      store.dispatch(handleLogout());
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(tokenMiddleware),
});

export const persistor = persistStore(store);
