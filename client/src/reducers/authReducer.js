import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CONFIRMATION_SUCCESS,
  CONFIRMATION_FAIL,
  LEAVE_FAMILY_SUCCESS,
  HAS_FAMILY,
  REGISTER_FAMILY_SUCCESS
} from '../actions/types';

const initalState = {
  isAuthenticated: null,
  isLoading: false,
  hasFamily: false,
  user: null
};

export default function(state = initalState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false
      };
    case CONFIRMATION_SUCCESS:
      return {
        ...state,
        isAuthenticated: false
      };
    case HAS_FAMILY:
    case REGISTER_FAMILY_SUCCESS:
      return {
        ...state,
        hasFamily: true
      };
    case LEAVE_FAMILY_SUCCESS:
      return {
        ...state,
        hasFamily: false
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
    case CONFIRMATION_FAIL:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasFamily: false
      };
    default:
      return state;
  }
}
