import { Fragment, useState } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import '../App.css'

const testTasks = [
	new Task('test1', 'a', '1'),
	new Task('test2', 'b', '2'),
	new Task('test3', 'c', '3'),
	new Task('test4', 'd', '4')
]

function Task(id, title='', description='', subNum=0) {
	this.id = id
    this.title = title;
    this.description = description;
	this.subNum = subNum
}

export default function TaskList() {
	// TODO: idToTask, getTaskFromId?
	document.addEventListener('keydown', handleKeyDown);

    const [taskList, setTaskList] = useState(testTasks);
	const [idCounter, setIdCounter] = useState(0);
	const [newTask, setNewTask] = useState(new Task('task' + idCounter));
	const [selectedTaskId, setSelectedTaskId] = useState(null);
	// toChildrenMap maps parentTaskId to Array<subtaskId>. Task only in toChildrenMap if it has children
	const [toChildrenMap, setToChildrenMap] = useState(new Map());
	const [toParentMap, setToParentMap] = useState(new Map());

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
		setNewTask(new Task(getNewTaskId()));
	}

	function handleSelectTask(taskId) {
		setSelectedTaskId(taskId);
	}

	function handleKeyDown(e) {
		// console.log('keydown', selectedTaskId)
		// if (e.key === 'ArrowRight' && (selectedTaskId !== null)) {
		// 	console.log('selected', selectedTaskId)
		// 	convertToSubtask(selectedTaskId)
		// }
	}

	/**
	 * Increments task counter and returns a formatted task ID
	 * 
	 * @returns {string} formatted taskId with incremented counter
	 */
	function getNewTaskId() {
		setIdCounter(idCounter + 1);
		return 'task' + (idCounter + 1);
	}

	/**
	 * Given a taskId, indent the task by 1 (if applicable). Updates taskList and related parent/children maps
	 * 
	 * @param {string} taskId unique ID for task to subtask
	 * @returns {undefined} no value, returns control
	 */
	function convertToSubtask(taskId) {
		// TODO: optimization, store max subNum, only check all parents when previous subNum = max
		const taskIx = taskList.findIndex((t) => t.id === taskId)
		const task = taskList[taskIx];
		if (taskIx > 0) { // Cannot make subtask of first task in list
			// Get index of old parent, new parent, and task's index in old parent's children
			const oldParentTaskId = toParentMap.get(taskId);
			let newParentTaskId;
			let childIx;
			// If task has parentId, it's already a subtask
			if (oldParentTaskId !== undefined) { 	
				// New parent is the child left of task in old parent's children, if it exists
				childIx = toChildrenMap.get(oldParentTaskId).indexOf(taskId);
				if (childIx === 0) {
					return;
				} else {
					newParentTaskId = toChildrenMap.get(oldParentTaskId)[childIx - 1];
				}
			} 
			// Else, task is a root (subNum=0), so parent is next root above
			else {
				newParentTaskId = [...taskList].slice(0, taskIx).reverse().find((t) => t.subNum === 0).id;
				// If task.subNum = 0 and taskIx != 0, free to subtask
			}

			// Adjust children of old parent
			const tempToChildrenMap = new Map(toChildrenMap);
			if (oldParentTaskId !== undefined) {
				const oldChildren = toChildrenMap.get(oldParentTaskId)
				tempToChildrenMap.set(oldParentTaskId, oldChildren.slice(0, childIx).concat(oldChildren.slice(childIx + 1)));
			}
			// Adjust children of new parent
			if (toChildrenMap.has(newParentTaskId)) {
				const newChildren = toChildrenMap.get(newParentTaskId);
				// Find index at which to insert task in children
				let insertIx = newChildren.length;
				for (const child of newChildren) {
					if (taskList.findIndex((t) => t.id === child.id) > taskIx) {
						insertIx = newChildren.findIndex(child.id);
						break;
					}
				}
				// Concat current task's children to new parent
				let taskPlusChildren;
				if (toChildrenMap.has(taskId)) {
					taskPlusChildren = [taskId].concat(toChildrenMap.get(taskId));
				} else {
					taskPlusChildren = [taskId]
				}
				tempToChildrenMap.set(newParentTaskId, 
					newChildren.slice(0, insertIx)
							   .concat(taskPlusChildren)
							   .concat(newChildren.slice(insertIx)));
			} else {
				tempToChildrenMap.set(newParentTaskId, [taskId]);
			}

			const newChildren = tempToChildrenMap.get(newParentTaskId);
			let insertIx = newChildren.length;
			for (const child of newChildren) {
				if (taskList.findIndex((t) => t.id === child.id) > taskIx) {
					insertIx = newChildren.findIndex(child.id);
				}
			}
			// Adjust parent, subNum, and children of task
			const tempToParentMap = new Map(toParentMap);
			const newTask = {
				...task,
				subNum: task.subNum + 1
			}
			tempToParentMap.set(taskId, newParentTaskId);
			tempToChildrenMap.delete(taskId); // Delete children after subtasking 
			// Adjust parent of children of task
			if (toChildrenMap.get(taskId) !== undefined) {
				toChildrenMap.get(taskId).forEach((childId) => {
					tempToParentMap.set(childId, newParentTaskId);
				});
			}
			// TODO: update idToTask too

			setToChildrenMap(tempToChildrenMap);
			setToParentMap(tempToParentMap);
			setTaskList(taskList.slice(0, taskIx).concat(newTask).concat(taskList.slice(taskIx + 1)));
		}
	}

	function convertToSupertask(taskId) {
		const taskIx = taskList.findIndex((t) => t.id === taskId)
		const task = taskList[taskIx];
		if (task.subNum > 0 && taskIx > 0) { // Cannot convert to supertask if unindented or is first task

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
							convertToSubtask={convertToSubtask} 
							toChildrenMap={toChildrenMap}
							toParentMap={toParentMap} />
					</Fragment>))}
            </ul>
        </div>
    );
}