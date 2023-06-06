export default function TaskItem({
    task, selectedTaskId, editingTask,
    handleSelectTask, handleEditingTaskChange, handleEditingTaskSelect,
    handleDragStart, handleDragEnd
}) {
    const tabMarginPx = 20;

    return (
        <li className="taskItem"
            id={task.id}
            onClick={handleSelectTask}
            style={{marginLeft: (task.subNum * tabMarginPx) + "px"}}
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemTextContainer">
                {/* taskTitle */}
                {(editingTask !== undefined &&
                  editingTask.id === task.id &&
                  editingTask.prop === 'title' ?
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEditingTaskSelect(undefined, undefined);
                        }}>
                        <input
                            className="taskTitle"
                            type="text"
                            value={task.title}
                            placeholder="Title"
                            onChange={(e) => handleEditingTaskChange(e, task.id, 'title')}
                            autoFocus
                            style={{width: (task.title.length > 0 ? task.title.length : 5) + 'ch'}} />
                        <button type="submit" hidden></button>
                    </form>
                        :
                    <p className="taskTitle"
                        onClick={(e) => handleEditingTaskSelect(task.id, 'title')}>
                        {task.title}
                    </p>
                )}
                {/* taskDescription */}
                {(editingTask !== undefined &&
                  editingTask.id === task.id &&
                  editingTask.prop === 'description' ?
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEditingTaskSelect(undefined, undefined);
                        }}>
                        <input
                            className="taskDescription"
                            type="text"
                            value={task.description}
                            placeholder="Description"
                            onChange={(e) => handleEditingTaskChange(e, task.id, 'description')}
                            autoFocus
                            style={{width: (task.description.length > 0 ? task.description.length : 12) + 'ch'}} />
                        <button type="submit" hidden></button>
                    </form>
                        :
                    <p className="taskDescription"
                        onClick={(e) => handleEditingTaskSelect(e, task.id, 'description')}>
                        {task.description}
                    </p>
                )}
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