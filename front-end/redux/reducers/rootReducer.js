import { combineReducers } from "redux";
import blockReducer from "./blockReducer";
import errorReducer from "./errorReducer";
import eventReducer from "./eventReducer";
import authReducer from "./authReducer"
export default combineReducers({
  blocks: blockReducer,
  events: eventReducer,
  errors: errorReducer,
  auth: authReducer
});
