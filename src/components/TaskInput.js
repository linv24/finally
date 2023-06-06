import '../styles/TaskList.css';

export default function TaskInput({ newTask, handleNewTaskChange, handleNewTaskSubmit }) {
  return (
    <form
      className="newTaskForm"
      onSubmit={handleNewTaskSubmit}>
      <input
        className="newTaskTitle"
        type="text"
        placeholder="Task"
        value={newTask.title}
        onChange={handleNewTaskChange} />
      <button type="submit" hidden></button>
    </form>
  );
}