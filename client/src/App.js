import React from 'react';
import TaskList from './components/TaskList';
import Buttons from './components/Buttons';

const App = () => (
  <div style={{margin: 20}}>
    <Buttons/>
    <TaskList/>
  </div>
);

export default App;
