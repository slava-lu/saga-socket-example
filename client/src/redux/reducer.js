import {combineReducers} from 'redux';
import taskReducer from '../modules/task';

const rootReducer = combineReducers({
  taskReducer,
});

export default rootReducer;
