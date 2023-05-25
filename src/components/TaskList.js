import { Fragment, useState } from "react";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";
import "../App.css"

function Task(id, title, description, subNum, parent=null) {
	this.id = id
    this.title = title;
    this.description = description;
	this.subNum = subNum
	this.parent = parent;
}

export default function TaskList() {
	document.addEventListener("keydown", handleKeyDown);

    const [taskList, setTaskList] = useState([]);
	const [idCounter, setIdCounter] = useState(0);
	const [newTask, setNewTask] = useState(new Task(idCounter, "", "", 0));
	const [selectedTaskId, setSelectedTaskId] = useState(null);

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
		setNewTask(new Task(idCounter + 1, "", "", 0));
		setIdCounter(idCounter + 1);
	}

	function handleSelectTask(taskId) {
		console.log(taskId)
		setSelectedTaskId(taskId);
	}

	function handleKeyDown(e) {
		console.log('keydown', selectedTaskId)
		if (e.key === "ArrowRight" && (selectedTaskId !== null)) {
			console.log('selected', selectedTaskId)
			convertToSubtask(selectedTaskId)
		}
	}

	function convertToSubtask(taskId) {
		console.log('subtask', taskId)
		const taskIx = taskList.findIndex((task) => task.id === taskId)
		const task = taskList[taskIx];
		if (taskIx > 0) { // Cannot make subtask of first task in list
			// Search backwards from taskIx for the first "parent" task that has an equal subNum
			const parentTask = [...taskList.slice(0, taskIx)].reverse().find(
				(pt) => pt.subNum === task.subNum
			)
			// Create new subtask
			const newSubtask = {
				...task,
				subNum: task.subNum + 1,
				parent: parentTask
			}
			setTaskList(taskList.slice(taskIx).concat(newSubtask).concat(taskList.slice(taskIx + 1)));
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
							handleSelectTask={handleSelectTask} />
					</Fragment>))}
            </ul>
        </div>
    );
}