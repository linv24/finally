export default function TaskItem({ task, handleSelectTask, convertToSubtask }) {
    return (
        <li className="taskItem" onClick={(e) => handleSelectTask(task.id)}>
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemText">
                <p className="taskTitle">{task.title}</p>
                <p className="taskDescription">{task.description}</p>
            </div>
            <button type="button" onClick={(e) => convertToSubtask(task.id)}>sub</button>
            <span>
                id = {task.id}, subNum = {task.subNum}, parent = {task.parentId}
            </span>
        </li>
    )
}