import axios from 'axios';
import {
  INITIAL_WALKS,
  ADD_WALK,
  DELETE_WALK,
  DELETE_WALK_FAIL,
  WALKS_LOADING,
  ADD_WALK_FAIL
} from './types';
import { returnErrors } from './errorActions';
import { returnSuccess } from './successActions';

// This is called to listen for the init walks after the socket connection
// has been established and the server sends the walks
export const loadInitWalks = socket => dispatch => {
  dispatch({
    type: WALKS_LOADING
  });
  socket.on('initWalks', walks => {
    dispatch({
      type: INITIAL_WALKS,
      payload: walks
    });
  });
};

// Add walk and sends the added walk through socket
export const addWalk = (walk, socket) => dispatch => {
  const { dogs, date, time, duration, pee, poop } = walk;
  if (
    !dogs ||
    !date ||
    !time ||
    !duration ||
    pee === undefined ||
    poop === undefined
  )
    return dispatch(
      returnErrors(
        { msg: 'You must enter all mandatory fields' },
        400,
        ADD_WALK_FAIL
      )
    );

  axios
    .post('api/dashboard/walks', walk)
    .then(res => {
      const { newWalk } = res.data;
      socket.emit('addedWalk', newWalk);
      dispatch({
        type: ADD_WALK,
        payload: newWalk
      });
      dispatch(
        returnSuccess(
          { msg: 'Walk was successfully added!' },
          res.status,
          ADD_WALK
        )
      );
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, ADD_WALK_FAIL)
      );
    });
};

// Delete walk and sends the deleted walk id through socket
export const deleteWalk = (walkId, socket) => dispatch => {
  axios
    .delete('api/dashboard/walks', { data: { id: walkId } })
    .then(res => {
      const { deletedWalkId } = res.data;
      if (!deletedWalkId) {
        return dispatch({
          type: DELETE_WALK,
          payload: walkId
        });
      }

      socket.emit('deletedWalk', walkId);
      dispatch({
        type: DELETE_WALK,
        payload: walkId
      });
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch(
        returnErrors(err.response.data, err.response.status, DELETE_WALK_FAIL)
      );
    });
};

// Listen to added walks on the socket room (family)
export const addedWalks = socket => dispatch => {
  socket.on('addedWalk', walk => {
    dispatch({
      type: ADD_WALK,
      payload: walk
    });
  });
};

// Listen to deleted walks on the socket room (family)
export const deletedWalks = socket => dispatch => {
  socket.on('deletedWalk', walkId => {
    dispatch({
      type: DELETE_WALK,
      payload: walkId
    });
  });
};
