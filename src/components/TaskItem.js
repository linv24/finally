export default function TaskItem({ task, selectedTaskId, handleSelectTask, convertToSubtask, convertToSupertask, handleDrag }) {
    const tabMarginPx = 20;

    return (
        <li className={"taskItem " + (selectedTaskId === task.id ? "selectedTask" : "")}
            onClick={(e) => handleSelectTask(task.id)}
            style={{marginLeft: (task.subNum * tabMarginPx) + "px"}}
            draggable="true"
            onDrag={handleDrag}>
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemText">
                <p className="taskTitle">{task.title}</p>
                <p className="taskDescription">{task.description}</p>
            </div>
            {/* <span className="spanTest">
                id = {task.id},
                subNum = {task.subNum},
                parent = {task.parent},
                children = {task.children}
            </span> */}
        </li>
    )
}