export default function TaskItem({ task, handleSelectTask, convertToSubtask, toChildrenMap, toParentMap }) {
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
            <span className="spanTest">
                id = {task.id}, 
                subNum = {task.subNum}, 
                parent = {toParentMap.get(task.id)}, 
                children = {toChildrenMap.get(task.id)}
            </span>
        </li>
    )
}