import axios from 'axios';
import { returnErrors } from './errorActions';
import { returnSuccess } from './successActions';

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';

// Check token and load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// Register User
export const register = ({
  name,
  email,
  password,
  repeatPassword
}) => dispatch => {
  //Simple validation
  if (!name || !email || !password || !repeatPassword) {
    dispatch(
      returnErrors({ msg: 'Please enter all fields' }, 400, 'REGISTER_FAIL')
    );
    return;
  }

  if (password.length < 6) {
    dispatch(
      returnErrors(
        { msg: 'Password needs to be at least 6 characters' },
        400,
        'REGISTER_FAIL'
      )
    );
    return;
  }

  if (password !== repeatPassword) {
    dispatch(
      returnErrors({ msg: 'Passwords do not match!' }, 400, 'REGISTER_FAIL')
    );
    return;
  }

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, password });

  axios
    .post('/api/users', body, config)
    .then(res => {
      dispatch(returnSuccess(res.data, res.status, 'REGISTER_SUCCESS'));
      dispatch({
        type: REGISTER_SUCCESS
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

// Login User
export const login = ({ email, password }) => dispatch => {
  // Simple validation
  if (!email || !password) {
    dispatch(
      returnErrors({ msg: 'Please enter all fields' }, 400, 'LOGIN_FAIL')
    );
    return;
  }

  if (password.length < 6) {
    dispatch(
      returnErrors(
        { msg: 'Passwords cannot be shorter than 6 characters' },
        400,
        'LOGIN_FAIL'
      )
    );
    return;
  }

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post('/api/auth', body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// Setup config/headers and token
export const tokenConfig = getState => {
  // Get token from localStorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
