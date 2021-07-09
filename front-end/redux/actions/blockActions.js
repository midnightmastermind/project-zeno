import axios from "axios";
import {
  REQUEST_BLOCKS,
  RECEIVE_BLOCKS,
  GET_ERRORS
} from "../types";


export const fetchBlocks = dispatch => {
  return dispatch => {
    dispatch(requestBlocks())
    return axios
    .get(`${process.env.NEXT_PUBLIC_API}/blocks`, {withCredentials: true})
    .then(res => {
      const blocks = res.data;
      dispatch(receiveBlocks(blocks.blocks));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: null
    })
    );
   }
};

export const updateBlock = block => dispatch => {
  let requestUrl;
  if (block._id) {
        requestUrl = '/blocks/' + block._id + '/update';
  } else {
       requestUrl = '/blocks/create';
  }
  axios
    .post(`${process.env.NEXT_PUBLIC_API}${requestUrl}`, block, {withCredentials: true})
    .then(res => {
      dispatch(fetchBlocks());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );

};

export const deleteBlock = blockId => dispatch => {
  axios
    .delete(`${process.env.NEXT_PUBLIC_API}/blocks/${blockId}`, {withCredentials: true})
    .then(res => {
      dispatch(fetchBlocks());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );

};

export const receiveBlocks = blocks => {
  return {
    type: RECEIVE_BLOCKS,
    blocks
  };
};

export const requestBlocks = () => {
    return {
        type: REQUEST_BLOCKS
    };
};

export default {
  fetchBlocks,
  updateBlock,
  deleteBlock
};
