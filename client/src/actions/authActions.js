import axios from 'axios';
import { returnErrors } from './errorActions';
import { returnSuccess } from './successActions';
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CONFIRMATION_SUCCESS,
  CONFIRMATION_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  HAS_FAMILY,
  FAMILY_JOIN_SUCCESS,
  FAMILY_JOIN_FAIL
} from './types';

// Check token and load user
export const loadUser = () => dispatch => {
  // User loading
  dispatch({ type: USER_LOADING });
  axios
    .get('/api/auth/user')
    .then(res => {
      if (res.data._familyId) dispatch({ type: HAS_FAMILY });
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    })
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
      returnErrors({ msg: 'Please enter all fields' }, 400, REGISTER_FAIL)
    );
    return;
  }

  if (password.length < 6) {
    dispatch(
      returnErrors(
        { msg: 'Password needs to be at least 6 characters' },
        400,
        REGISTER_FAIL
      )
    );
    return;
  }

  if (password !== repeatPassword) {
    dispatch(
      returnErrors({ msg: 'Passwords do not match!' }, 400, REGISTER_FAIL)
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
      dispatch(returnSuccess(res.data, res.status, REGISTER_SUCCESS));
      dispatch({
        type: REGISTER_SUCCESS
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, REGISTER_FAIL)
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
    dispatch(returnErrors({ msg: 'Please enter all fields' }, 400, LOGIN_FAIL));
    return;
  }

  if (password.length < 6) {
    dispatch(
      returnErrors(
        { msg: 'Passwords cannot be shorter than 6 characters' },
        400,
        LOGIN_FAIL
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
      dispatch(
        returnSuccess(
          { msg: `Welcome ${res.data.user.name}` },
          res.status,
          LOGIN_SUCCESS
        )
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    })
    .catch(err => {
      let { msg } = err.response.data;
      const remainingAttempts = err.response.headers['x-ratelimit-remaining'];
      if (remainingAttempts) {
        msg = msg + '. Remaining attempts: ' + remainingAttempts;
      }
      dispatch(returnErrors({ msg }, err.response.status, LOGIN_FAIL));
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// Logout User
export const logout = () => dispatch => {
  axios
    .post('/api/auth/logout')
    .then(res => {
      dispatch({ type: LOGOUT_SUCCESS });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: LOGOUT_FAIL });
    });
};

// Confirm User
export const confirm = token => dispatch => {
  axios
    .get(`/api/users/confirmation/${token}`)
    .then(res => {
      dispatch(returnSuccess(res.data, res.status, CONFIRMATION_SUCCESS));
      dispatch({
        type: CONFIRMATION_SUCCESS
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, CONFIRMATION_FAIL)
      );
      dispatch({
        type: CONFIRMATION_FAIL
      });
    });
};

// Accept invitation to family
export const acceptFamilyInvite = token => dispatch => {
  axios
    .get(`/api/dashboard/family/join-family/${token}`)
    .then(res => {
      dispatch(returnSuccess(res.data, res.status, FAMILY_JOIN_SUCCESS));
      dispatch({
        type: FAMILY_JOIN_SUCCESS
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, FAMILY_JOIN_FAIL)
      );
      dispatch({
        type: FAMILY_JOIN_FAIL
      });
    });
};

export const forgotPassword = email => dispatch => {
  // Simple validation
  if (!email) {
    dispatch(returnErrors({ msg: 'Please enter all fields' }, 400, LOGIN_FAIL));
    return;
  }

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email });

  axios
    .post('/api/users/forgot', body, config)
    .then(res => {
      dispatch(returnSuccess(res.data, res.status, FORGOT_PASSWORD_SUCCESS));
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS
      });
    })
    .catch(err => {
      let { msg } = err.response.data;
      const remainingAttempts = err.response.headers['x-ratelimit-remaining'];
      if (remainingAttempts) {
        msg = msg + '. Remaining attempts: ' + remainingAttempts;
      }
      dispatch(
        returnErrors({ msg }, err.response.status, FORGOT_PASSWORD_FAIL)
      );
      dispatch({
        type: FORGOT_PASSWORD_FAIL
      });
    });
};

export const resetPassword = (token, password, confirmPassword) => dispatch => {
  if (!password || !confirmPassword) {
    dispatch(
      returnErrors({ msg: 'Please enter all fields' }, 400, RESET_PASSWORD_FAIL)
    );
    return;
  }

  if (password.length < 6) {
    dispatch(
      returnErrors(
        { msg: 'Password must be longer than 6 characters!' },
        400,
        RESET_PASSWORD_FAIL
      )
    );
    return;
  }

  if (password !== confirmPassword) {
    dispatch(
      returnErrors({ msg: 'Passwords do not match!' }, 400, RESET_PASSWORD_FAIL)
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
  const body = JSON.stringify({ password, confirmPassword });

  axios
    .post(`/api/users/reset/${token}`, body, config)
    .then(res => {
      dispatch(returnSuccess(res.data, res.status, RESET_PASSWORD_SUCCESS));
      dispatch({
        type: RESET_PASSWORD_SUCCESS
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          RESET_PASSWORD_FAIL
        )
      );
      dispatch({
        type: RESET_PASSWORD_FAIL
      });
    });
};
