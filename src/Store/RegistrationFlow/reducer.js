import * as types from './actionTypes';
const initialState = {
  data: {},
  loading: false,
};

export default function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case types.LOGIN_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: '',
      };
    case types.LOGIN_FETCH_FAIL:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: '',
      };
    default:
      return state;
  }
}
