import {
  ADD_WALK,
  DELETE_WALK,
  INITIAL_WALKS,
  WALKS_LOADING
} from '../actions/types';

const initialState = {
  walks: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case WALKS_LOADING:
      return {
        ...state,
        loading: true
      };
    case ADD_WALK:
      return {
        ...state,
        walks: [action.payload, ...state.walks]
      };
    case DELETE_WALK:
      return {
        ...state,
        walks: state.walks.filter(walk => walk._id !== action.payload)
      };
    case INITIAL_WALKS:
      return {
        ...state,
        walks: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
