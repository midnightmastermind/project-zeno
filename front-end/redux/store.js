import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import { persistStore } from 'redux-persist';
import {HYDRATE} from 'next-redux-wrapper';

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    return Object.assign({}, { ...action.payload }, state);
  } else {
    return combinedReducer(state, action)
  }
}
export function initializeStore(initialState = {}) {
  let store;

  const isClient = typeof window !== 'undefined';
  if (isClient) {
    const { persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
      key: 'root',
      storage
    };

    store = createStore(
      persistReducer(persistConfig, rootReducer),
      initialState,
      composeWithDevTools(applyMiddleware(thunk))
    );
     store.__PERSISTOR = persistStore(store);
  } else {
    store =  createStore(
      rootReducer,
      initialState,
      composeWithDevTools(applyMiddleware(thunk))
    );
  }
  return store;
}
