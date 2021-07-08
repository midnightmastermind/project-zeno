import {
  RECEIVE_BLOCKS, REQUEST_BLOCKS
} from "../types";
import {getTreeFromFlatData} from "react-sortable-tree";
const isEmpty = require("is-empty");
const initialState = {
  blocks: [],
  retrievingBlocks: false
};
const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_BLOCKS:
      return {
          ...state,
          retrievingBlocks: true
      }
    case RECEIVE_BLOCKS:
      return {
        ...state,
        blocks: action.blocks,
        retrievingBlocks: false
      }
    default:
      return state;
  }
}

export default blockReducer;
