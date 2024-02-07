import {API} from '../../ApiService';
import {endPoints} from '../../Config';
import {helperLog} from '../../Helper/Utils';
import {apiLoadingStart, apiLoadingStop} from '../Global';
const defaultHeaders = {'Content-Type': 'application/json'};

/**
 * checkWorkerAvailibility
 * @param {*} param
 * @param {*} param1
 * @returns
 */
export const checkWorkerAvailibility = (
  param,
  {SuccessCallback, FailureCallback},
) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(
      endPoints.checkWorkerAvailibility,
      defaultHeaders,
      param,
      {
        SuccessCallback: response => {
          dispatch(apiLoadingStop());
          SuccessCallback(response);
          helperLog('SuccessCallback_CheckWorkerAvailibility', response);
        },
        FailureCallback: response => {
          dispatch(apiLoadingStop());
          FailureCallback(response);
          helperLog('FailureCallback_CheckWorkerAvailibility', response);
        },
      },
    );
  };
};

/**
 * Login
 * @param {*} param
 * @param {*} param1
 * @returns
 */
export const loginUser = (param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(endPoints.login, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_Login', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_Login', response);
      },
    });
  };
};

/**
 * Signup
 * @param {*} param
 * @param {*} param1
 * @returns
 */
export const registerUser = (param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(endPoints.signup, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_Signup', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_Signup', response);
      },
    });
  };
};

/**
 * ForgotPassword
 * @param {*} param
 * @param {*} param1
 * @returns
 */
export const ForgotPassword = (param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(endPoints.forgotpwd, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_ForgotPassword', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_ForgotPassword', response);
      },
    });
  };
};

/**
 * Signup
 * @param {*} param
 * @param {*} param1
 * @returns
 */
export const registerUserV2 = (param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(endPoints.signupV2, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_SignupV2', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_SignupV2', response);
      },
    });
  };
};

export const updateWorker = (workerId,param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(endPoints.updateWorker(workerId), defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_updateWorker', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_updateWorker', response);
      },
    });
  };
};