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
        walks: insertToWalkList(action.payload, state.walks)
      };
    case DELETE_WALK:
      return {
        ...state,
        walks: state.walks.filter(walk => walk._id !== action.payload)
      };
    case INITIAL_WALKS:
      return {
        ...state,
        walks: action.payload.sort((firstWalk, secondWalk) => {
          return sortWalkList(firstWalk, secondWalk);
        }),
        loading: false
      };
    default:
      return state;
  }
}

function sortWalkList(firstWalk, secondWalk) {
  const firstWalkDateArray = firstWalk.date.split('-');
  const secondWalkDateArray = secondWalk.date.split('-');
  const firstWalkYear = Number(firstWalkDateArray[0]);
  const secondWalkYear = Number(secondWalkDateArray[0]);
  const firstWalkMonth = Number(firstWalkDateArray[1]);
  const secondWalkMonth = Number(secondWalkDateArray[1]);
  const firstWalkDay = Number(firstWalkDateArray[2]);
  const secondWalkDay = Number(secondWalkDateArray[2]);

  if (firstWalkYear > secondWalkYear) return -1;
  if (firstWalkYear < secondWalkYear) return 1;
  if (firstWalkMonth > secondWalkMonth) return -1;
  if (firstWalkMonth < secondWalkMonth) return 1;
  if (firstWalkDay > secondWalkDay) return -1;
  if (firstWalkDay < secondWalkDay) return 1;

  const firstWalkTimeArray = firstWalk.time.split(':');
  const secondWalkTimeArray = secondWalk.time.split(':');
  const firstWalkHour = Number(firstWalkTimeArray[0]);
  const secondWalkHour = Number(secondWalkTimeArray[0]);
  const firstWalkMinute = Number(firstWalkTimeArray[1]);
  const secondWalkMinute = Number(secondWalkTimeArray[1]);

  if (firstWalkHour > secondWalkHour) return -1;
  if (firstWalkHour < secondWalkHour) return 1;
  if (firstWalkMinute > secondWalkMinute) return -1;
  if (firstWalkMinute < secondWalkMinute) return 1;

  return 0;
}

function insertToWalkList(newWalk, walkList) {
  let newWalkList = walkList.slice();
  if (newWalkList.length === 0) {
    newWalkList.splice(0, 0, newWalk);
    return newWalkList;
  }

  const newWalkDateArray = newWalk.date.split('-');
  const newWalkYear = Number(newWalkDateArray[0]);
  const newWalkMonth = Number(newWalkDateArray[1]);
  const newWalkDay = Number(newWalkDateArray[2]);
  const newWalkTimeArray = newWalk.time.split(':');
  const newWalkHour = Number(newWalkTimeArray[0]);
  const newWalkMinute = Number(newWalkTimeArray[1]);

  let i = 0;
  for (i; i < newWalkList.length; i++) {
    const walkDateArray = newWalkList[i].date.split('-');
    const walkYear = Number(walkDateArray[0]);
    const walkMonth = Number(walkDateArray[1]);
    const walkDay = Number(walkDateArray[2]);

    if (newWalkYear > walkYear) {
      newWalkList.splice(i, 0, newWalk);
      return newWalkList;
    } else if (newWalkYear < walkYear) {
      continue;
    } else if (newWalkMonth > walkMonth) {
      newWalkList.splice(i, 0, newWalk);
      return newWalkList;
    } else if (newWalkMonth < walkMonth) {
      continue;
    } else if (newWalkDay > walkDay) {
      newWalkList.splice(i, 0, newWalk);
      return newWalkList;
    } else if (newWalkDay < walkDay) {
      continue;
    }

    const walkTimeArray = newWalkList[i].time.split(':');
    const walkHour = Number(walkTimeArray[0]);
    const walkMinute = Number(walkTimeArray[1]);

    if (newWalkHour > walkHour) {
      newWalkList.splice(i, 0, newWalk);
      return newWalkList;
    } else if (newWalkHour < walkHour) {
      continue;
    } else if (newWalkMinute > walkMinute) {
      newWalkList.splice(i, 0, newWalk);
      return newWalkList;
    } else if (newWalkMinute < walkMinute) {
      continue;
    }
  }
  newWalkList.splice(i, 0, newWalk);
  return newWalkList;
}
