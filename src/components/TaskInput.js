import "../App.css"

export default function TaskInput({ newTask, handleNewTaskChange, handleNewTaskSubmit }) {
    return (
        <form 
            className="newTaskForm"
            onSubmit={handleNewTaskSubmit}>
            <input 
                name="title"
                type="text" 
                placeholder="Task title" 
                value={newTask.title} 
                onChange={handleNewTaskChange} />
            <input 
                name="description"
                type="text" 
                placeholder="Task description" 
                value={newTask.description} 
                onChange={handleNewTaskChange} />
            <button type="submit" hidden></button>
        </form>
    );
}