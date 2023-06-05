export default function TaskItem({
    task, selectedTaskId, editingTask,
    handleSelectTask, handleDrag, handleEditingTaskChange, handleEditingTaskSelect
}) {
    const tabMarginPx = 20;

    return (
        <li className={"taskItem " + (selectedTaskId === task.id ? "selectedTask" : "")}
            onClick={(e) => handleSelectTask(task.id)}
            style={{marginLeft: (task.subNum * tabMarginPx) + "px"}}
            draggable="true"
            onDrag={handleDrag}>
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemTextContainer">
                {(editingTask !== undefined && editingTask.id === task.id ?
                    <input
                        className="taskTitle"
                        type="text"
                        value={task.title}
                        onChange={(e) => handleEditingTaskChange(e, task.id, 'title')}
                        autoFocus
                        style={{width: task.title.length + 'ch'}} /> :
                    <p className="taskTitle"
                        onClick={(e) => handleEditingTaskSelect(task.id, 'title')}>
                        {task.title}
                    </p>
                )}
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