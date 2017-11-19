import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';
import {take, call, put, fork, cancel, cancelled} from 'redux-saga/effects';
import {createSelector} from 'reselect';

const ADD_TASK = 'ADD_TASK';
const START_CHANNEL = 'START_CHANNEL';
const STOP_CHANNEL = 'STOP_CHANNEL';
const SERVER_ERROR = 'SERVER_ERROR';

const initialState = {
    taskList: [],
    error: false,
};

//We will keep list of tasks in this reducer
export default (state = initialState, action) => {
    const {taskList, error} = state;
    switch (action.type) {
        case ADD_TASK:
            const updatedTaskList = [...taskList, action.payload];
            return {...state, taskList: updatedTaskList};
        case SERVER_ERROR:
            return {...state, error: action.payload};
        default:
            return state;
    }
};

export const startChannel = () => ({type: START_CHANNEL});
export const stopChannel = () => ({type: STOP_CHANNEL});

//sorting function to show the latest tasks first
const sortTasks = (task1, task2) => task2.taskID - task1.taskID;

//selector to get only first 10 latest tasks
const taskSelector = state => state.taskReducer.taskList;
const topTask = (allTasks) => allTasks.sort(sortTasks).slice(0, 10);
export const topTaskSelector = createSelector(taskSelector, topTask);

//Since  saga works with Promises we wrap socket connection function in Promise
const connect = async () => {
    const socket = io('http://localhost:3000');
        return new Promise((resolve, reject) => {
            socket.on('connect', () => {
                console.log(socket)
                resolve(socket);
                reject(socket)
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
const listenServerSaga = function* () {
    try {
        const socket = yield call(connect);

        const socketChannel = yield call(createSocketChannel, socket);
        while (true) {
            const payload = yield take(socketChannel);
            yield put({type: ADD_TASK, payload})
        }
    } catch (error) {
        yield put({type: SERVER_ERROR, payload: error});

    }
    finally {
        if (yield cancelled()) {
            yield socketChannel.close();
        }
    }
};


//saga listens for start stop actions which can pe put in componentDidMount
export const startStopChannel = function* () {
    let task;
    while (true) {
        const {type} = yield take([START_CHANNEL, STOP_CHANNEL]);
        if (!task && type === START_CHANNEL) {
            try {
                task = yield call(listenServerSaga);
            }
            catch (error) {
                task = yield cancel(task);
            }
        }
        if (task && type === STOP_CHANNEL) {
            task = yield cancel(task);
        }
    }
};