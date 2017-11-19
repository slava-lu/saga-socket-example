import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';
import {take, call, put, fork, race, cancel, cancelled, all} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {createSelector} from 'reselect';

const ADD_TASK = 'ADD_TASK';
const START_CHANNEL = 'START_CHANNEL';
const STOP_CHANNEL = 'STOP_CHANNEL';
const CHANNEL_ON = 'CHANNEL_ON';
const CHANNEL_OFF = 'CHANNEL_OFF';
const SERVER_ON = 'SERVER_ON';
const SERVER_OFF = 'SERVER_OFF';

const initialState = {
  taskList: [],
  channelStatus: 'off',
  serverStatus: 'unknown',
};

//We will keep list of tasks in this reducer
export default (state = initialState, action) => {
  const {taskList, error} = state;
  switch (action.type) {
    case CHANNEL_ON:
      return {...state, channelStatus: 'on'};
    case CHANNEL_OFF:
      return {...state, channelStatus: 'off', serverStatus: 'unknown'};
    case ADD_TASK:
      const updatedTaskList = [...taskList, action.payload];
      return {...state, taskList: updatedTaskList};
    case SERVER_OFF:
      return {...state, serverStatus: 'off'};
    case SERVER_ON:
      return {...state, serverStatus: 'on'};
    default:
      return state;
  }
};

export const startChannel = () => ({type: START_CHANNEL});
export const stopChannel = () => ({type: STOP_CHANNEL});

//sorting function to show the latest tasks first
const sortTasks = (task1, task2) => task2.taskID - task1.taskID;

//selector to get only first 5 latest tasks
const taskSelector = state => state.taskReducer.taskList;
const topTask = (allTasks) => allTasks.sort(sortTasks).slice(0, 5);
export const topTaskSelector = createSelector(taskSelector, topTask);

let socket;

//Since  saga works with Promises we wrap socket connection function in Promise
const connect = () => {
  socket = io('http://localhost:3000');
  return new Promise((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

const disconnect = () => {
  socket = io('http://localhost:3000');
  return new Promise((resolve) => {
    socket.on('disconnect', () => {
      resolve(socket);
    });
  });
};

const reconnect = () => {
  socket = io('http://localhost:3000');
  return new Promise((resolve) => {
    socket.on('reconnect', () => {
      resolve(socket);
    });
  });
};

//This is how channel is created
const createSocketChannel = (socket) => eventChannel(
  emit => {
    const handler = (data) => {
      emit(data);
    };
    socket.on('newTask', handler);
    return () => {
      socket.off('newTask', handler);
    }
  }
);

//Saga to switch on channel.
const listenServerSaga = function*() {
  try {
    yield put({type: CHANNEL_ON});
    const {timeout} = yield race({
      connected: call(connect),
      timeout: delay(2000)
    });
    if (timeout) {
      yield put({type: SERVER_OFF});
    }
    const socket = yield call(connect);
    const socketChannel = yield call(createSocketChannel, socket);
    yield put({type: SERVER_ON});

    while (true) {
      const payload = yield take(socketChannel);
      yield put({type: ADD_TASK, payload})
    }
  } catch (error) {
    console.log(error)
  }
  finally {
    if (yield cancelled()) {
      socket.disconnect(true);
      yield put({type: CHANNEL_OFF});
    }
  }
};

export const listenDisconnectSaga = function*() {
  yield call(disconnect);
  yield put({type: SERVER_OFF});
};

export const listenConnectSaga = function*() {
  yield call(reconnect);
  yield put({type: SERVER_ON});
};

//saga listens for start stop actions which can pe put in componentDidMount
export const startStopChannel = function*() {
  let task;
  while (true) {
    yield take(START_CHANNEL);
    const task = yield race({
      task: call(listenServerSaga),
      cancel: take(STOP_CHANNEL)
    });
  }
};