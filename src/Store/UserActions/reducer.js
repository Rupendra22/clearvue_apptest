import * as types from './actionTypes';
const initialState = {
  data: {},
  loading: false,
  companyImage: '',
  agencyImage:''
};

export default function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_COMPANY_IMAGE:
      return {
        ...state,
        loading: true,
        error: '',
        companyImage: action.payload,
      };
    case types.SET_AGENCY_IMAGE:
      return {
        ...state,
        loading: true,
        error: '',
        agencyImage: action.payload,
      };
    default:
      return state;
  }
}
