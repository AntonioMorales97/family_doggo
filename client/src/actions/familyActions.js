import axios from 'axios';
import {
  REGISTER_FAMILY_SUCCESS,
  REGISTER_FAMILY_FAIL,
  LEAVE_FAMILY_SUCCESS,
  LEAVE_FAMILY_FAIL,
  INVITE_TO_FAMILY_SUCCESS,
  INVITE_TO_FAMILY_FAIL
} from './types';
import { returnErrors } from './errorActions';
import { returnSuccess } from './successActions';

export const registerFamily = familyName => dispatch => {
  axios
    .post('api/dashboard/family', { name: familyName })
    .then(res =>
      dispatch({
        type: REGISTER_FAMILY_SUCCESS
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          REGISTER_FAMILY_FAIL
        )
      );
      dispatch({
        type: REGISTER_FAMILY_FAIL
      });
    });
};

export const leaveFamily = () => dispatch => {
  axios
    .get('api/dashboard/family/leave')
    .then(res =>
      dispatch({
        type: LEAVE_FAMILY_SUCCESS
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, LEAVE_FAMILY_FAIL)
      );
      dispatch({
        type: LEAVE_FAMILY_FAIL
      });
    });
};

export const inviteToFamily = email => dispatch => {
  axios
    .post('api/dashboard/family/invite', { email })
    .then(res => {
      dispatch(returnSuccess(res.data, res.status, INVITE_TO_FAMILY_SUCCESS));
      dispatch({
        type: INVITE_TO_FAMILY_SUCCESS
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          INVITE_TO_FAMILY_FAIL
        )
      );
      dispatch({
        type: INVITE_TO_FAMILY_FAIL
      });
    });
};
