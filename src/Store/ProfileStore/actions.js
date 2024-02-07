import {API} from '../../ApiService';
import {endPoints} from '../../Config';
import {helperLog} from '../../Helper/Utils';
import {apiLoadingStart, apiLoadingStop} from '../Global';
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * FetchUserProfile
 * @param {*} userId
 * @param {*} param1
 * @returns
 */
export const FetchUserProfile = (
  isLoading,
  userId,
  {SuccessCallback, FailureCallback},
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.fetchProfile);
    objEndpoint.endpoint = objEndpoint.endpoint + userId;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_FetchUserProfile', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_FetchUserProfile', response);
      },
    });
  };
};

/**
 * UploadDocument
 * @param {*} param
 * @param {*} param1
 * @returns
 */
export const UploadDocument = (param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(endPoints.uploaddoc, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_UploadDocument', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_UploadDocument', response);
      },
    });
  };
};

export const UpdateUserLanguage = (
  param,
  {SuccessCallback, FailureCallback},
) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(
      endPoints.updateWorkerLanguage,
      defaultHeaders,
      param,
      {
        SuccessCallback: response => {
          dispatch(apiLoadingStop());
          SuccessCallback(response);
          helperLog('SuccessCallback_UpdateLanguage', response);
        },
        FailureCallback: response => {
          dispatch(apiLoadingStop());
          FailureCallback(response);
          helperLog('FailureCallback_UpdateLanguage', response);
        },
      },
    );
  };
};
