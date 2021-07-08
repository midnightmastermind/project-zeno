import {
  RECEIVE_EVENTS, REQUEST_EVENTS
} from "../types";
const isEmpty = require("is-empty");
const initialState = {
  events: [],
  retrievingEvents: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case REQUEST_EVENTS:
      return {
          ...state,
          retrievingEvents: true
      }
    case RECEIVE_EVENTS:
      return {
        ...state,
        events: action.events,
        retrievingEvents: false
      };

    default:
      return state;
  }
}
