import { useState } from 'react';
import Header from './components/Header';
import Profile from './components/Profile';
import TaskList from './components/TaskList';
import TimeBox from './components/TimeBox';
import Sidebar from './components/Sidebar';
import './styles/App.css';

const Panes = {
  profile: 'profile',
  taskList: 'taskList',
  timeBox: 'timeBox'
}

export default function App() {
  // TODO: make activePanes a list to display multiple panes?
  const [activePane, setActivePane] = useState(Panes.taskList)

  function handlePaneSelect(e) {
    setActivePane(Panes[e.currentTarget.id]);
  }

  return (
    <div className="appContainer">
      <Header />
      <div className="contentContainer">
        <Sidebar
          handlePaneSelect={handlePaneSelect} />
        {activePane === Panes.profile &&
          <Profile />}
        {activePane === Panes.taskList &&
          <TaskList />}
        {activePane === Panes.timeBox &&
          <TimeBox />}
      </div>
    </div>
  )
}