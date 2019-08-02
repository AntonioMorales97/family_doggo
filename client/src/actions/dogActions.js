import axios from 'axios';
import {
  GET_DOGS,
  ADD_DOG,
  ADD_DOG_FAIL,
  DELETE_DOG,
  DOGS_LOADING,
  DOGS_LOADING_FAIL,
  DELETE_DOG_FAIL
} from './types';
import { returnErrors } from './errorActions';
import { returnSuccess } from './successActions';

export const getDogs = () => dispatch => {
  dispatch(setDogsLoading());
  axios
    .get('api/dashboard/dogs')
    .then(res =>
      dispatch({
        type: GET_DOGS,
        payload: res.data.dogs
      })
    )
    .catch(err => dispatch({ type: DOGS_LOADING_FAIL }));
};

export const addDog = name => dispatch => {
  dispatch(setDogsLoading());
  axios
    .post('api/dashboard/dogs', { name })
    .then(res => {
      dispatch({
        type: ADD_DOG,
        payload: res.data.newDog
      });
      dispatch(
        returnSuccess(
          { msg: `Successfully added ${name} to the family!` },
          res.status,
          ADD_DOG
        )
      );
    })
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, ADD_DOG_FAIL)
      )
    );
};

export const deleteDog = id => dispatch => {
  dispatch(setDogsLoading());
  axios
    .delete('api/dashboard/dogs', { data: { dog: id } })
    .then(res => {
      dispatch({
        type: DELETE_DOG,
        payload: id
      });
      dispatch(returnSuccess({ msg: res.data.msg }, res.status, DELETE_DOG));
    })
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, DELETE_DOG_FAIL)
      )
    );
};

export const setDogsLoading = () => {
  return {
    type: DOGS_LOADING
  };
};
