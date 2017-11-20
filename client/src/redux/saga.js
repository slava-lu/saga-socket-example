import {all} from 'redux-saga/effects';
import {startStopChannel} from '../modules/task';

export default function* rootSaga() {
  yield all([
    startStopChannel(),
  ]);
}
