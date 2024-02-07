import AsyncStorage from '@react-native-community/async-storage';
import httpClient from 'axios';
import { endPoints } from '../Config';
import { AUTH_TOKEN, REFRESH_TOKEN } from '../Helper/Storage';
import { appName } from './Config';

export let apiConfig = {};
const axios = httpClient.create();
axios.defaults.timeout = 10000;

// const axios = require('axios');
let instance = null;

export const DevelopmentMode = {
  PRODUCTION: 'PRODUCTION',
  TESTING: 'TESTING',
  DEVELOPMENT: 'DEVELOPMENT',
  ALPHA: 'ALPHA',
};
export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  OPTIONS: 'OPTIONS',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  GETBODY: 'GETBODY',
};

export const Headers = {
  AUTHORIZATION: 'Authorization',
};

class API {
  _baseURL;
  _DevMode;
  _method;
  _endPoint;
  _Headers;
  _params;

  constructor() {}

  static getInstance() {
    if (!instance) {
      instance = new API();
    }
    return instance;
  }

  build(mode, apiConfig) {
    this._DevMode = mode;
    if (this._DevMode === DevelopmentMode.PRODUCTION) {
      this._baseURL = apiConfig.productionBaseURL;
    } else if (this._DevMode === DevelopmentMode.TESTING) {
      this._baseURL = apiConfig.testingBaseURL;
    } else if (this._DevMode === DevelopmentMode.DEVELOPMENT) {
      this._baseURL = apiConfig.developmentBaseURL;
    } else if (this._DevMode === DevelopmentMode.ALPHA) {
      this._baseURL = apiConfig.alphaBaseURL;
    } else {
      this._baseURL = apiConfig.developmentBaseURL;
    }
    // this.setupResponseInterceptor(this._baseURL);
  }

  setHeader(key, value) {
    axios.defaults.headers.common[key] = value;
  }

  setupResponseInterceptor(baseURL) {
    axios.interceptors.response.use(
      async response => {
        // console.log('refreshToken___', JSON.stringify(response));
        return response;
      },
      async function (error) {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);

        const originalRequest = error.config;
        const baseurl = baseURL;

        //case to avoid calling /refresh on login endpoint throwing 401
        if (
          (error.response.status === 400 || error.response.status === 401) &&
          originalRequest.url === baseurl + endPoints.login.endpoint
        ) {
          // console.log('refreshToken___reject<<');

          return Promise.reject(error);
        }

        //Case to avoid infinite fetching on /refresh endpoint throwing 401
        if (
          (error.response.status === 401 || error.response.status === 400) &&
          originalRequest.url === baseurl + endPoints.refreshTok.endpoint
        ) {
          // console.log('refreshToken___reject>>');

          return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(
                baseurl + endPoints.refreshTok.endpoint,
                {
                  refresh_token: refreshToken,
                },
              );
              if (refreshResponse.status === 200) {
                await AsyncStorage.setItem(
                  AUTH_TOKEN,
                  refreshResponse.data.access_token,
                );
                axios.defaults.headers.common['Authorization'] =
                  'Bearer ' + refreshResponse.data.access_token;
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
                return axios(originalRequest);
              }
            } catch (error) {
              console.log('REFRESH REQUEST ERROR', error);
            }
          }
        }

        console.log('INSIDE END CASE');
        return Promise.reject(error);
      },
    );
  }

  retry({SuccessCallback, FailureCallback}) {
    this.getResult(this._method, this._endPoint, this._Headers, this._params, {
      SuccessCallback: re => {
        SuccessCallback(re);
      },
      FailureCallback: data => {
        FailureCallback(data);
      },
    });
  }

  Logger(message) {
    if (this._DevMode !== DevelopmentMode.PRODUCTION) {
      console.log(appName, message);
    }
  }

  helperLog(TAG, response) {
    console.log(TAG, JSON.stringify(response));
    if (this._DevMode !== DevelopmentMode.PRODUCTION) {
      console.log(TAG, JSON.stringify(response));
    }
  }

  onClose(reason) {
    //this.retry()
  }

  Fetch(res, headers, params, {SuccessCallback, FailureCallback}) {
    /*
     * assign value to global so it can be reused for retry based on policy.
     */

    this._method = res.method;
    this._endPoint = res.endpoint;
    this._Headers = headers;
    this._params = params;

    this.getResult(res.method, res.endpoint, headers, params, {
      SuccessCallback: res => {
        SuccessCallback(res);
      },
      FailureCallback: res => {
        FailureCallback(res);
      },
    });
  }

  getResult(
    method,
    endPoint,
    headers,
    params,
    {SuccessCallback, FailureCallback},
  ) {
    switch (method) {
      case Method.GET:
        this.helperLog('Param>>', params);
        this.helperLog('URL>>', this._baseURL + endPoint, {headers: headers});
        this.helperLog('Method>>', 'GET');
        const param = params ? '?' + params : '';
        axios
          .get(this._baseURL + endPoint + param, {
            headers: headers,
          })
          .then(res => {
            if (res.status === 200 || res.success) {
              SuccessCallback(res.data);
            } else {
              FailureCallback(res);
              this.helperLog('FailureCallback', JSON.stringify(res));
            }
            return res;
          })
          .catch(err => {
            this.helperLog('FailureCallback', JSON.stringify(err));
            this.helperLog(
              'FailureCallback_response',
              JSON.stringify(err.response),
            );
            FailureCallback(err.response == undefined ? err : err.response);
          });

        break;
      case Method.POST:
        this.helperLog('Param>>', params);
        this.helperLog('URL>>', this._baseURL + endPoint, {headers});
        this.helperLog('Method>>', 'POST');
        axios
          .post(this._baseURL + endPoint, params, {
            headers: headers,
          })
          .then(res => {
            this.helperLog('SuccessCallback', JSON.stringify(res));
            if (res.status === 200) {
              SuccessCallback(res.data);
            } else {
              this.helperLog('FailureCallback', JSON.stringify(res));
              FailureCallback(res);
            }
            return res;
          })
          .catch(err => {
            this.helperLog('FailureCallback', JSON.stringify(err));
            this.helperLog(
              'FailureCallback_response',
              JSON.stringify(err.response),
            );
            FailureCallback(err.response == undefined ? err : err.response);
          });

        break;
      case Method.PUT:
        this.helperLog('Param>>', params);
        this.helperLog('URL>>', this._baseURL + endPoint, {headers});
        this.helperLog('Method>>', 'PUT');
        axios
          .put(this._baseURL + endPoint, params, {headers: headers})
          .then(res => {
            this.helperLog('SuccessCallback', JSON.stringify(res));
            if (res.status === 200) {
              SuccessCallback(res.data);
            } else {
              FailureCallback(res);
            }
            return res;
          })
          .catch(err => {
            this.helperLog('FailureCallback', JSON.stringify(err));
            this.helperLog(
              'FailureCallback_response',
              JSON.stringify(err.response),
            );
            FailureCallback(err.response == undefined ? err : err.response);
          });

        break;
      case Method.OPTIONS:
        break;
      case Method.DELETE:
        this.helperLog('Param>>', params);
        this.helperLog('URL>>', this._baseURL + endPoint, {headers});
        this.helperLog('Method>>', 'DELETE');
        axios
          .delete(this._baseURL + endPoint, params, {headers: headers})
          .then(res => {
            console.log("1231313",res)
            this.helperLog('SuccessCallback', JSON.stringify(res));
            if (res.status === 200) {
              SuccessCallback(res.data);
            } else {
              FailureCallback(res);
            }
            return res;
          })
          .catch(err => {
            console.log("errr_",err)
            this.helperLog('FailureCallback', JSON.stringify(err));
            this.helperLog(
              'FailureCallback_response',
              JSON.stringify(err.response),
            );
            FailureCallback(err.response == undefined ? err : err.response);
          });
        break;
      case Method.PATCH:
        this.helperLog('Param>>', params);
        this.helperLog('URL>>', this._baseURL + endPoint, {headers});
        this.helperLog('Method>>', 'PATCH');
        axios
          .patch(this._baseURL + endPoint, params, {headers: headers})
          .then(res => {
            this.helperLog('SuccessCallback', JSON.stringify(res));
            if (res.status === 200) {
              SuccessCallback(res.data);
            } else {
              FailureCallback(res);
            }
            return res;
          })
          .catch(err => {
            this.helperLog('FailureCallback', JSON.stringify(err));
            this.helperLog(
              'FailureCallback_response',
              JSON.stringify(err.response),
            );
            FailureCallback(err.response == undefined ? err : err.response);
          });
        break;
      case Method.GETBODY:
        this.helperLog('Param>>', params);
        this.helperLog('URL>>', this._baseURL + endPoint, {headers});
        this.helperLog('Method>>', 'GETBODY');
        axios
          .get(this._baseURL + endPoint, params, {headers: headers})
          .then(res => {
            if (res.status === 200 || res.success) {
              SuccessCallback(res.data);
            } else {
              FailureCallback(res);
              this.helperLog('FailureCallback', JSON.stringify(res));
            }
            return res;
          })
          .catch(err => {
            this.helperLog('FailureCallback', JSON.stringify(err));
            this.helperLog(
              'FailureCallback_response',
              JSON.stringify(err.response),
            );
            FailureCallback(err.response == undefined ? err : err.response);
          });

        break;
      default:
        return null;
    }
  }
}

export default API;
