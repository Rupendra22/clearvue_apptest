import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';

const configureStore = () => {
  const middleware = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger();
    middleware.push(logger);
  }
  return createStore(reducer, applyMiddleware(...middleware));
};

export {configureStore};
