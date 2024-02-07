import AsyncStorage from '@react-native-community/async-storage';
import {Method} from './ApiService';
import {AUTH_TOKEN, IS_LOGIN, REFRESH_TOKEN} from './Helper/Storage';
import {
  MED_DURATION,
  showSWWToast,
  showToast,
  LONG_DURATION,
} from './Helper/Utils';
import {navigateAndSimpleReset} from './Navigators/NavigationUtils';

export const apiConfig = {
  productionBaseURL: 'https://api.theclearvue.co.uk' /*release build*/,
  testingBaseURL: 'https://api.test.theclearvue.co.uk' /*inteneal testing*/,
  developmentBaseURL: 'https://api.test.theclearvue.co.uk' /*for client test*/,
  alphaBaseURL: 'https://api.test.theclearvue.co.uk',
};

export const endPoints = {
  checkWorkerAvailibility: {
    endpoint: '/api/v1/worker/check-availability',
    method: Method.POST,
  },
  login: {
    endpoint: '/api/v1/worker/login',
    method: Method.POST,
  },
  signup: {
    endpoint: '/api/v1/worker/sign-up',
    method: Method.POST,
  },
  forgotpwd: {
    endpoint: '/api/v1/forgot-password',
    method: Method.POST,
  },
  uploaddoc: {
    endpoint: '/api/v1/worker/documents',
    method: Method.POST,
  },
  fetchProfile: {
    endpoint: '/api/v2/worker/user/',
    method: Method.GET,
  },
  refreshTok: {
    endpoint: '/api/v1/token',
    method: Method.POST,
  },
  feeds: {
    endpoint: '/api/v1/users/',
    method: Method.GET,
  },
  detailMessage: {
    endpoint: '/api/v1/messages/',
    method: Method.GET,
  },
  trainingMessage: {
    endpoint: '/api/v1/workers/training/messages/',
    method: Method.GET,
  },
  surveyCategory: lanCode => {
    return {
      endpoint: `/api/v1/survey/categories?language=${lanCode}`,
      method: Method.GET,
    };
  },
  surveyQuestion: {
    endpoint: '/api/v1/survey/questions/',
    method: Method.GET,
  },
  addSurvey: {
    endpoint: '/api/v1/survey/response',
    method: Method.POST,
  },
  workerUpdateProfile: {
    endpoint: '/api/v1/workers/users/',
    method: Method.PUT,
  },
  trackWorkerTraining: {
    endpoint: '/api/v1/messages/',
    method: Method.PUT,
  },
  faqs: {
    endpoint: '/api/v1/support/faq?page=1&limit=100',
    method: Method.GET,
  },
  linkToSupport: {
    endpoint: '/api/v1/support/link-to-support?page=1&limit=100',
    method: Method.GET,
  },
  messageRead: {
    endpoint: '/api/v1/message-read/',
    method: Method.PUT,
  },
  deleteAccount: {
    endpoint: '/api/v1/workers/',
    method: Method.DELETE,
  },
  signupV2: {
    endpoint: '/api/v2/worker/sign-up',
    method: Method.POST,
  },
  updateWorkerLanguage: {
    endpoint: '/api/v1/workers/language',
    method: Method.POST,
  },
  updateWorker: workerId => {
    return {
      endpoint: '/api/v2/worker',
      method: Method.PUT,
    };
  },
  addReaction: (user_id, message_id) => {
    return {
      endpoint: `/api/v1/users/${user_id}/messages/${message_id}/reaction`,
      method: Method.POST,
    };
  },
  addComment: (user_id, message_id) => {
    return {
      endpoint: `/api/v1/users/${user_id}/messages/${message_id}/comment`,
      method: Method.POST,
    };
  },
  fetchComment: (user_id, message_id) => {
    return {
      endpoint: `/api/v1/users/${user_id}/messages/${message_id}/comments`,
      method: Method.POST,
    };
  },
};

export function checkForCode(status) {
  if (status === 401 || status == 403) {
    AsyncStorage.getAllKeys().then(keys => {
      AsyncStorage.setItem(AUTH_TOKEN, '');
      AsyncStorage.setItem(REFRESH_TOKEN, '');
      AsyncStorage.setItem(IS_LOGIN, JSON.stringify(false));
    });
    navigateAndSimpleReset('LoginScreen');
  }
}

export function handleFailureCallback(response, value = true) {
  checkForCode(response.status != null && response.status);
  if (response.data) {
    let isArray = Array.isArray(response?.data?.message);
    if (response.data) {
      if (value) {
        let message = isArray
          ? response?.data?.message?.[0]?.message
          : response?.data?.message;
        showToast(message, LONG_DURATION);
      }
    } else {
      if (value) {
        showSWWToast();
      }
    }
  } else {
    showSWWToast();
  }
}
