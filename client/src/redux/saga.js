import {all} from 'redux-saga/effects';
import {startStopChannel, listenDisconnectSaga, listenConnectSaga} from '../modules/task';

export default function* rootSaga() {
  yield all([
    startStopChannel(),
    listenDisconnectSaga(),
    listenConnectSaga()
  ])
};