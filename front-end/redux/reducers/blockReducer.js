import {
  RECEIVE_BLOCKS, REQUEST_BLOCKS
} from "../types";
import {getTreeFromFlatData} from "react-sortable-tree";
const isEmpty = require("is-empty");

const initialState = {
  blocks: [],
  toolBar: [],
  retrievingBlocks: false
};

function filterTree(element) {
  if(element.children.length != 0) {
    let i;
    let newChildren = [];
    for(i=0; i < element.children.length; i++){
        let newTree = filterTree(element.children[i]);
        if(newTree !== undefined) {
          newChildren.push(newTree);
        }
    }
    element.children = newChildren;
  }
  if(element.type == "HomeBlock" || element.type == "PageBlock") {
    return element;
  }
}

const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_BLOCKS:
      return {
          ...state,
          retrievingBlocks: true
      }
    case RECEIVE_BLOCKS:
      let blocks = JSON.parse(JSON.stringify(action.blocks));
      let filteredTree = filterTree(blocks);
      return {
        ...state,
        blocks: action.blocks,
        toolBar: filteredTree,
        retrievingBlocks: false
      }
    default:
      return state;
  }
}

export default blockReducer;
