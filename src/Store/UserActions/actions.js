import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { API } from '../../ApiService';
import { endPoints, handleFailureCallback } from '../../Config';
import { SURVEY_CODE } from '../../Helper/Storage';
import { helperLog, showToast } from '../../Helper/Utils';
import { apiLoadingStart, apiLoadingStop } from '../Global';
import * as types from './actionTypes';
const defaultHeaders = { 'Content-Type': 'application/json' };

/**
 * FetchUserFeed
 * @param {userId}
 * @param {'general','client','agency'} viewType
 * @param {*} param2
 * @returns
 */
export const FetchUserFeed = (
  isLoading,
  userId,
  viewType,
  offset,
  maxResult,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.feeds);
    objEndpoint.endpoint =
      objEndpoint.endpoint +
      userId +
      `/messages?page=${offset}&limit=${maxResult}&type=feed&view=` +
      viewType;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);

        if (response?.logo !== null && response?.logo !== '') {
          viewType === 'agency'
            ? dispatch({
                type: types.SET_AGENCY_IMAGE,
                payload: response?.logo,
              })
            : null;

          viewType === 'client'
            ? dispatch({
                type: types.SET_COMPANY_IMAGE,
                payload: response?.logo,
              })
            : null;
        }
        // helperLog('SuccessCallback_FetchUserFeed', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        handleFailureCallback(response);
        helperLog('FailureCallback_FetchUserFeed', response);
      },
    });
  };
};

/**
 * FetchUserMessage
 * @param {userId}
 * @param {'general','award','badge','kudos','feed','training'}
 * @param {*} param2
 * @returns
 */
export const FetchUserMessage = (
  isLoading,
  userId,
  type,
  lanCode,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.feeds);
    objEndpoint.endpoint =
      objEndpoint.endpoint +
      userId +
      '/messages?page=1&limit=10000&type=' +
      type +
      `&language_code=${lanCode}`;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        // helperLog('SuccessCallback_FetchUserMessage', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        // helperLog('FailureCallback_FetchUserMessage', response);
      },
    });
  };
};

/**
 *
 * @param {messageId}
 * @param {message_receiver_worker_id }
 * @param {*} param2
 * @returns
 */
export const GetMessageDetails = (
  messageId,
  message_receiver_worker_id,
  lanCode,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.detailMessage);
    objEndpoint.endpoint = message_receiver_worker_id
      ? objEndpoint.endpoint +
        messageId +
        `?message_receiver_worker_id=${message_receiver_worker_id}&language_code=${lanCode}`
      : objEndpoint.endpoint + messageId + `?language_code=${lanCode}`;
    dispatch(apiLoadingStart());
    console.log('objEndpoint : ', objEndpoint);
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_GetMessageDetails', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_GetMessageDetails', response);
        handleFailureCallback(response);
      },
    });
  };
};

/**
 * GetTrainingMessage
 * @param {messageId}
 * @param {message_receiver_worker_id}
 * @param {*} param1
 * @returns
 */
export const GetTrainingMessage = (
  messageId,
  message_receiver_worker_id,
  lanCode,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.trainingMessage);
    objEndpoint.endpoint = message_receiver_worker_id
      ? objEndpoint.endpoint +
        messageId +
        `?message_receiver_worker_id=${message_receiver_worker_id}&language_code=${lanCode}`
      : objEndpoint.endpoint + messageId + `?language_code=${lanCode}`;
    dispatch(apiLoadingStart());
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_GetTrainingMessage', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_GetTrainingMessage', response);
      },
    });
  };
};

/**
 * GetSurveyCategory
 * @param {isLoading}
 * @param {*} param1
 * @returns
 */
// export const GetSurveyCategory = async (
//   isLoading,
//   {SuccessCallback, FailureCallback},
// ) => {
//   return dispatch => {
//     isLoading ? dispatch(apiLoadingStart()) : null;
//     API.getInstance().Fetch(endPoints.surveyCategory, defaultHeaders, '', {
//       SuccessCallback: response => {
//         dispatch(apiLoadingStop());
//         SuccessCallback(response);
//         helperLog('SuccessCallback_GetSurveyCategory', response);
//       },
//       FailureCallback: response => {
//         dispatch(apiLoadingStop());
//         FailureCallback(response);
//         helperLog('FailureCallback_GetSurveyCategory', response);
//       },
//     });
//   };
// };

/**
 * GetSurveyQuestions
 * @param {*} surveyType
 * @param {*} param1
 * @returns
 */
export const GetSurveyQuestions = (
  isLoading,
  surveyType,
  language,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.surveyQuestion);
    objEndpoint.endpoint =
      objEndpoint.endpoint + surveyType + `?language=${language}`;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_GetSurveyQuestions', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_GetSurveyQuestions', response);
      },
    });
  };
};

/**
 * AddSurveyResponse
 * @param {isLoading}
 * @param {*} param
 * @param {*} param2
 * @returns
 */
export const AddSurveyResponse = (
  isLoading,
  param,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(endPoints.addSurvey, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_AddSurveyResponse', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_AddSurveyResponse', response);
      },
    });
  };
};

/**
 * WorkerUpdateProfile
 * @param {isLoading}
 * @param {userId}
 * @param {*} param
 * @param {*} param3
 * @returns
 */
export const WorkerUpdateProfile = (
  isLoading,
  userId,
  param,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.workerUpdateProfile);
    objEndpoint.endpoint = objEndpoint.endpoint + userId;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_WorkerUpdateProfile', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_WorkerUpdateProfile', response);
      },
    });
  };
};

/**
 * TrackWorkerTraining
 * @param {isLoading}
 * @param {userId}
 * @param {*} param
 * @param {*} param3
 * @returns
 */
export const TrackWorkerTraining = (
  isLoading,
  userId,
  param,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.trackWorkerTraining);
    objEndpoint.endpoint =
      objEndpoint.endpoint + userId + '/training-completed';
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_TrackWorkerTraining', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_TrackWorkerTraining', response);
      },
    });
  };
};

export const GetSurveyCategory = async (
  isLoading,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.surveyCategory);
    objEndpoint.endpoint = objEndpoint.endpoint;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(endPoints.surveyCategory, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_GetSurveyCategory', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_GetSurveyCategory', response);
      },
    });
  };
};

/**
 * FaqsList
 * @param {isLoading}
 * @param {*} param1
 * @returns
 */
export const FaqsList = (isLoading, { SuccessCallback, FailureCallback }) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(endPoints.faqs, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_FaqsList', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_FaqsList', response);
      },
    });
  };
};

/**
 * LinkToSupportList
 * @param {isLoading}
 * @param {*} param1
 * @returns
 */
export const LinkToSupportList = (
  isLoading,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(endPoints.linkToSupport, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_LinkToSupportList', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_LinkToSupportList', response);
      },
    });
  };
};

export const MessageRead = (
  isLoading,
  messageId,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    var objEndpoint = Object.assign({}, endPoints.messageRead);
    objEndpoint.endpoint = objEndpoint.endpoint + messageId;
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(objEndpoint, defaultHeaders, '', {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_MessageRead', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_MessageRead', response);
      },
    });
  };
};

export const setAgencyLogo = logoUrl => ({
  type: types.SET_AGENCY_IMAGE,
  payload: logoUrl,
});

export const deleteAccount = (
  isLoading,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(endPoints.deleteAccount, defaultHeaders, null, {
      SuccessCallback: response => {
        dispatch(apiLoadingStop());
        SuccessCallback(response);
        helperLog('SuccessCallback_deleteAccount', response);
      },
      FailureCallback: response => {
        dispatch(apiLoadingStop());
        FailureCallback(response);
        helperLog('FailureCallback_deleteAccount', response);
      },
    });
  };
};

export const addMessageReaction = (
  isLoading,
  userId,
  messageId,
  param,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(
      endPoints.addReaction(userId, messageId),
      defaultHeaders,
      param,
      {
        SuccessCallback: response => {
          dispatch(apiLoadingStop());
          SuccessCallback(response);
          helperLog('SuccessCallback_addMessageReaction', response);
        },
        FailureCallback: response => {
          dispatch(apiLoadingStop());
          FailureCallback(response);
          helperLog('FailureCallback_addMessageReaction', response);
        },
      },
    );
  };
};

export const addComment = (
  isLoading,
  userId,
  messageId,
  param,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(
      endPoints.addComment(userId, messageId),
      defaultHeaders,
      param,
      {
        SuccessCallback: response => {
          dispatch(apiLoadingStop());
          SuccessCallback(response);
          helperLog('SuccessCallback_addComment', response);
        },
        FailureCallback: response => {
          dispatch(apiLoadingStop());
          FailureCallback(response);
          helperLog('FailureCallback_addComment', response);
        },
      },
    );
  };
};

export const fetchComment = (
  isLoading,
  userId,
  messageId,
  param,
  { SuccessCallback, FailureCallback },
) => {
  return dispatch => {
    isLoading ? dispatch(apiLoadingStart()) : null;
    API.getInstance().Fetch(
      endPoints.fetchComment(userId, messageId),
      defaultHeaders,
      param,
      {
        SuccessCallback: response => {
          dispatch(apiLoadingStop());
          SuccessCallback(response);
          helperLog('SuccessCallback_fetchComment', response);
        },
        FailureCallback: response => {
          dispatch(apiLoadingStop());
          FailureCallback(response);
          helperLog('FailureCallback_fetchComment', response);
        },
      },
    );
  };
};
