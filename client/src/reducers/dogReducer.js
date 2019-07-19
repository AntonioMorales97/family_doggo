import {
  GET_DOGS,
  ADD_DOG,
  DELETE_DOG,
  DOGS_LOADING,
  DOGS_LOADING_FAIL
} from '../actions/types';

const initialState = {
  dogs: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_DOGS:
      return {
        ...state,
        dogs: [...action.payload],
        loading: false
      };
    case ADD_DOG:
      return {
        ...state,
        dogs: [action.payload, ...state.dogs],
        loading: false
      };
    case DELETE_DOG:
      return {
        ...state,
        dogs: state.dogs.filter(dog => dog._id !== action.payload),
        loading: false
      };
    case DOGS_LOADING:
      return {
        ...state,
        loading: true
      };
    case DOGS_LOADING_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
