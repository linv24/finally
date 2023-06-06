import './App.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="appContainer">
      <Header />
      <div className="contentContainer">
        <Sidebar />
        <TaskList />
      </div>
    </div>
  )
}