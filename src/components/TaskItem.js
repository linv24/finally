export default function TaskItem({ task, handleSelectTask, convertToSubtask, convertToSupertask }) {
    const tabMarginPx = 20;

    return (
        <li className="taskItem" 
            onClick={(e) => handleSelectTask(task.id)} 
            style={{marginLeft: (task.subNum * tabMarginPx) + "px"}}>
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemText">
                <p className="taskTitle">{task.title}</p>
                <p className="taskDescription">{task.description}</p>
            </div>
            <button type="button" onClick={(e) => convertToSubtask(task.id)}>sub</button>
            <button type="button" onClick={(e) => convertToSupertask(task.id)}>super</button>
            <span className="spanTest">
                id = {task.id}, 
                subNum = {task.subNum}, 
                parent = {task.parent}, 
                children = {task.children}
            </span>
        </li>
    )
}