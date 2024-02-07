import {combineReducers} from 'redux';
import global from './Global';
import UserActions from './UserActions';

export default combineReducers({
  global,
  UserActions,
});
