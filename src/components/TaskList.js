import { Fragment, useState } from "react";
import TaskInput from "./TaskInput";
import "../App.css"

function Task(title, description) {
    this.title = title;
    this.description = description;
}

export default function TaskList() {
    const [taskList, setTaskList] = useState([]);
	const [idCounter, setIdCounter] = useState(0);
	const [newTask, setNewTask] = useState({id: idCounter, title: "", description: ""});

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
		setNewTask({id: idCounter + 1, title: "", description: ""});
		setIdCounter(idCounter + 1);
	}

    return (
        <>
			<TaskInput 
				newTask={newTask}
				handleNewTaskChange={handleNewTaskChange}
				handleNewTaskSubmit={handleNewTaskSubmit} />
            <ul className="taskList">
                {taskList.map((task) => (
					<Fragment key={task.id}>
						<li className="taskItem">
							<p className="taskTitle">{task.title}</p>
							<p className="taskDescription">{task.description}</p>
						</li>
					</Fragment>
				))}
            </ul>
        </>
    );
}