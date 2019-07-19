import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import successReducer from './successReducer';
import walkReducer from './walkReducer';
import dogReducer from './dogReducer';

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  success: successReducer,
  walk: walkReducer,
  dog: dogReducer
});
