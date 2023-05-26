import { Fragment } from "react";
import { useImmer } from "use-immer";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";
import "../App.css"

function Task(id, title="", description="", subNum=0, parentId=null) {
	this.id = id
    this.title = title;
    this.description = description;
	this.subNum = subNum
	this.parentId = parentId;
}

export default function TaskList() {
	// TODO: idToTask, getNewTaskId()
	document.addEventListener("keydown", handleKeyDown);
	// idToTask maps taskId to Task object
	const idToTask = new Map();
	// subtaskTreeMap maps parentTaskId to Array<subtaskId>. Task only in subtaskTreeMap if it has children
	const subtaskTreeMap = new Map();

    const [taskList, setTaskList] = useImmer([]);
	const [idCounter, setIdCounter] = useImmer(0);
	const [newTask, setNewTask] = useImmer(new Task("task" + idCounter));
	const [selectedTaskId, setSelectedTaskId] = useImmer(null);

	function handleNewTaskChange(e) {
		e.preventDefault();
		setNewTask({
			...newTask,
			[e.target.name]: e.target.value
		});
	}

	function handleNewTaskSubmit(e) {
		e.preventDefault();
		if (! newTask.title) {
			return;
		}
		setTaskList([newTask].concat(taskList))
		setNewTask(new Task("task" + (idCounter + 1)));
		setIdCounter(idCounter + 1);
	}

	function handleSelectTask(taskId) {
		console.log(taskId)
		setSelectedTaskId(taskId);
	}

	function handleKeyDown(e) {
		// console.log('keydown', selectedTaskId)
		// if (e.key === "ArrowRight" && (selectedTaskId !== null)) {
		// 	console.log('selected', selectedTaskId)
		// 	convertToSubtask(selectedTaskId)
		// }
	}

	function getTaskById(taskId) {
		return taskList.find((t) => t.id === taskId);
	}

	function convertToSubtask(taskId) {
		// TODO: optimization, store max subNum, only check all parents when previous subNum = max
		const taskIx = taskList.findIndex((t) => t.id === taskId)
		const task = taskList[taskIx];
		if (taskIx > 0) { // Cannot make subtask of first task in list
			// Search backwards from taskIx for the first "parent" task that has an equal subNum
			let newParentTaskId;
			let childIx;
			if (task.parentId !== null) { 	// If task has parentId, it's already a subtask
				// Can only subtask if parent has a child to the left of task (to become task's new parent)
				childIx = subtaskTreeMap[task.parentId].findIndex(taskId);
				if (childIx === 0) {
					return;
				} else {
					newParentTaskId = subtaskTreeMap[task.parentId][childIx - 1];
				}
			} else { 						// Else, task is a root (subNum=0), so parent is next root above
				newParentTaskId = [...taskList].slice(0, taskIx).reverse().find((t) => t.subNum === 0).id;
				// If task.subNum = 0 and taskIx != 0, free to subtask
			}

			// Adjust children of old parent
			if (task.parentId !== null) {
				const oldChildren = subtaskTreeMap[task.parentId]
				subtaskTreeMap[task.parentId] = oldChildren.slice(0, childIx) + oldChildren.slice(childIx + 1);
			}
			// Adjust children of new parent
			if (subtaskTreeMap.has(newParentTaskId)) {
				const newChildren = subtaskTreeMap[newParentTaskId];
				// Find index at which to insert task in children
				let insertIx = newChildren.length;
				for (const child of newChildren) {
					if (taskList.findIndex((t) => t.id === child.id) > taskIx) {
						insertIx = newChildren.findIndex(child.id);
						break;
					}
				}
				subtaskTreeMap[newParentTaskId] = newChildren.slice(0, insertIx) + [taskId] + newChildren.slice(insertIx);
			} else {
				subtaskTreeMap[newParentTaskId] = [taskId];
			}

			const newChildren = subtaskTreeMap[newParentTaskId];
			let insertIx = newChildren.length;
			for (const child of newChildren) {
				if (taskList.findIndex((t) => t.id === child.id) > taskIx) {
					insertIx = newChildren.findIndex(child.id);
				}
			}
			// Adjust parent and subNum of task
			const newTask = {
				...task,
				parentId: newParentTaskId,
				subNum: task.subNum + 1
			}
			// TODO: update idToTask too

			setTaskList(taskList.slice(0, taskIx).concat(newTask).concat(taskList.slice(taskIx + 1)));
		}
	}

    return (
        <div className="taskListContainer">
			<TaskInput
				newTask={newTask}
				handleNewTaskChange={handleNewTaskChange}
				handleNewTaskSubmit={handleNewTaskSubmit} />
            <ul className="taskList">
                {taskList.map((task) => (
					<Fragment key={task.id}>
						<TaskItem 
							task={task}
							handleSelectTask={handleSelectTask}
							convertToSubtask={convertToSubtask} />
					</Fragment>))}
            </ul>
        </div>
    );
}