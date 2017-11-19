import React from 'react';
import {connect} from 'react-redux';
import {topTaskSelector} from '../modules/task';

const TaskList = (props) => {
  const {serverStatus, channelStatus} = props;
  const taskList = props.tasks.map((task) => {
    return <li key={task.taskID}>{task.taskName}</li>
  });
  return (
    <div style={{display: 'flex',  width: '400px', justifyContent: 'space-between', borderTop: '1px solid grey'}}>
      <div style={{width: '200px'}}>
        <h3>Task List</h3>
        <ul style={{padding: 0}}>
          {taskList}
        </ul>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', width: '200px'}}>
        <h3>Connection Info</h3>
        <div style={{paddingBottom: 10}}>Server Status: <b>{ serverStatus}</b></div>
        <div>Channel Status: <b>{ channelStatus}</b></div>
      </div>



    </div>
  )
};

const mapStateToProps = state => ({
  tasks: topTaskSelector(state),
  serverStatus: state.taskReducer.serverStatus,
  channelStatus: state.taskReducer.channelStatus
});

export default connect(mapStateToProps)(TaskList);