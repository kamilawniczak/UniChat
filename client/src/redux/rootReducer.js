import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import appReducer from "./slices/app";
import authReducer from "./slices/auth";
import conversationReducer from "./slices/conversation";

const customStorage = {
  setItem: (key, value) => Promise.resolve(),
  getItem: (key) => Promise.resolve(null),
  removeItem: (key) => Promise.resolve(),
};

const rootPersistConfig = {
  key: "root",
  storage: storage,
  keyPrefix: "redux-",
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  coversations: conversationReducer,
});

export { rootPersistConfig, rootReducer };
