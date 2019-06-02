import { GET_SUCCESS, CLEAR_SUCCESS } from './types';

// RETURN SUCCESS
export const returnSuccess = (msg, status, id = null) => {
  return {
    type: GET_SUCCESS,
    payload: { msg, status, id }
  };
};

// CLEAR SUCCESS
export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
