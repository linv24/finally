import { Fragment } from "react"

export default function TaskItem({ task }) {
    return (
        <li className="taskItem">
            <input className="taskItemCheckbox" type="checkbox" />
            <div className="taskItemText">
                <p className="taskTitle">{task.title}</p>
                <p className="taskDescription">{task.description}</p>
            </div>
        </li>
    )
}