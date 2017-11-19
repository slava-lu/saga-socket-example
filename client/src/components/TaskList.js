import React from 'react';
import {connect} from 'react-redux';
import {topTaskSelector} from '../modules/task';

const TaskList = (props) => {
    const errorView = props.error ? <h3 style={{color: '#931437'}}>{props.error}</h3> : null;
    const taskList = props.tasks.map((task) => {
        return <li key={task.taskID}>{task.taskName}</li>
    });
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  width: '400px', }}>
            <h3>Tasks from the socket will appear below</h3>
            {errorView}
            <ul>
                {taskList}
            </ul>
        </div>
    )
};

const mapStateToProps = state => ({
    tasks: topTaskSelector(state),
    error: state.taskReducer.error
});

export default connect(mapStateToProps)(TaskList);