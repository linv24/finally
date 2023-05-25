export default function TaskItem({ task, handleSelectTask }) {
    return (
        <li className="taskItem" onClick={(e) => handleSelectTask(task.id)}>
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemText">
                <p className="taskTitle">{task.title}</p>
                <p className="taskDescription">{task.description}</p>
            </div>
        </li>
    )
}