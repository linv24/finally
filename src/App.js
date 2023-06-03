import "./App.css";
import Header from "./components/Header";
import TaskList from "./components/TaskList";

export default function App() {
  return (
    <div className="appContainer">
      <Header />
      <TaskList />
    </div>
  )
}