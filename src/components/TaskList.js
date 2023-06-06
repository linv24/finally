import { Fragment, useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import './TaskList.css'
// TODO add assertions

class Task {
  /**
   *
   * @param {Object}    task              object containing task data
   * @param {string}    task.id           unique ID for task
   * @param {string}    task.title        task title
   * @param {string}    task.description  task description
   * @param {number}    task.subNum       integer denoting the number of
   *                                        indents of the task
   * @param {string}    task.parent       taskId of parent
   * @param {string[]}  task.children     Array of taskIds of children
   */
  constructor ({
    id,
    title='',
    description='',
    subNum=0,
    parent=undefined,
    children=[]
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.subNum = subNum;
    this.parent = parent;
    this.children = children;
  }
}

const testTaskData = new Map([
  ['test0', new Task({id: 'test0', title: 'a', description: '0'})],
  ['test1', new Task({id: 'test1', title: 'b', description: '1'})],
  ['test2', new Task({id: 'test2', title: 'c', description: '2'})],
  ['test3', new Task({id: 'test3', title: 'd', description: '3'})]
]);

const testTaskList = ['test0', 'test1', 'test2', 'test3']

export default function TaskList() {
  // TODO: idToTask, getTaskFromId?
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    const taskListElt = document.getElementsByClassName('taskListContainer')[0]
    taskListElt.addEventListener('dragover', handleDragOver);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
      taskListElt.removeEventListener('dragover', handleDragOver);
    }
  });

  // taskList = array of task IDs
  const [taskList, setTaskList] = useState(testTaskList);
  // taskData = map mapping taskId to task data defined by Task object
  const [taskData, setTaskData] = useState(testTaskData);
  const [idCounter, setIdCounter] = useState(0);
  const [newTask, setNewTask] = useState(new Task({id: 'task' + idCounter}));
  const [selectedTaskId, setSelectedTaskId] = useState(undefined);
  const [editingTask, setEditingTask] = useState(undefined);

  function handleClick(e) {
    // console.log(e.target);

    // If click not in selected task, deselect task
    if (selectedTaskId !== undefined) {
      const selectBox = document.getElementById(selectedTaskId)
                                .getBoundingClientRect();
      if (! (selectBox.left <= e.clientX && e.clientX <= selectBox.right &&
          selectBox.top <= e.clientY && e.clientY <= selectBox.bottom)) {
        handleDeselectTask();
      }
    }

    // TODO: click off deselects editing text
    // TODO: checking box doesn't select, e.stopPropagation()

    // Double click in empty space below
    if (e.detail === 2 &&
      e.target.className.indexOf('taskListBelow') !== -1) {
      const newTask = new Task({id: getNewTaskId()});

      setTaskList(taskList.concat(newTask.id));
      handleEditingTaskSelect(newTask.id, 'title');
      setTaskData(new Map(taskData.set(newTask.id, newTask)));
    }
  }

  function handleNewTaskChange(e) {
    e.preventDefault();
    setNewTask(new Task ({
      ...newTask,
      title: e.target.value
    }));
  }

  function handleNewTaskSubmit(e) {
    e.preventDefault();
    if (newTask.title.length === 0) {
      return;
    }
    setTaskList([newTask.id].concat(taskList));
    setTaskData(new Map(taskData.set(newTask.id, new Task({...newTask}))));
    setNewTask(new Task({id: getNewTaskId()}));
  }

  function handleEditingTaskSelect(taskId, taskProp) {
    if (taskId === undefined) {
      setEditingTask(undefined);
    }
    setEditingTask({id: taskId, prop: taskProp});
  }

  function handleEditingTaskChange(e, taskId, taskProp) {
    const task = taskData.get(taskId);
    switch (taskProp) {
      case 'title':
        task.title = e.target.value; break;
      case 'description':
        task.description = e.target.value; break;
      default:
        break;
    }
    setTaskData(new Map(taskData.set(taskId, task)));
  }

  function handleSelectTask(e) {
    // TODO: <li> has taskId in id now, so just use event
    //       (for other similar funcs too)
    // Remove previous selected task
    if (selectedTaskId !== undefined) {
      handleDeselectTask();
    }
    // Add new selected task
    e.currentTarget.classList.add('selectedTask');
    setSelectedTaskId(e.currentTarget.id);
  }

  function handleDeselectTask() {
    if (selectedTaskId !== undefined) {
      document.getElementById(selectedTaskId).classList.remove('selectedTask');
    }
    setSelectedTaskId(undefined);
  }

  function handleKeyDown(e) {
    if (selectedTaskId !== undefined) {
      switch (e.key) {
        case 'ArrowRight': {
          convertToSubtask(selectedTaskId);
          break;
        }
        case 'ArrowLeft': {
          convertToSupertask(selectedTaskId);
          break;
        }
        case 'ArrowUp': {
          const selectedIx = taskList.indexOf(selectedTaskId);
          if (selectedIx > 0) {
            handleSelectTask(taskList[selectedIx - 1]);
          }
          break;
        }
        case 'ArrowDown': {
          const selectedIx = taskList.indexOf(selectedTaskId);
          if (selectedIx < taskList.length - 1) {
            handleSelectTask(taskList[selectedIx + 1]);
          }
          break;
        }
        default:
          break;
      }
    }
  }

  // Dragging
  // TODO: dragging and subtasking interaction
  function handleDragStart(e) {
    e.target.classList.add('draggingTask');
    handleSelectTask(e);
  }

  function handleDragOver(e) {
    e.preventDefault();
    // Get task before which to insert
    const draggingId = document.getElementsByClassName('draggingTask')[0].id;
    const listIx = taskList.indexOf(draggingId);
    const removedTaskList = taskList.slice(0, listIx)
                                    .concat(taskList.slice(listIx+1));
    const removedTaskElts = removedTaskList.map((taskId) => document.getElementById(taskId));
    const insertTaskElt = removedTaskElts.reduce((closestElt, currElt) => {
      // Get bounding box
      const box = currElt.getBoundingClientRect();
      // Calculate offset between mouseY and halfway down currElt's box
      const offset = e.clientY - (box.top + box.height/2);
      // If offset negative (clientY above taskBox) and offset is
      // the closest, return currElt
      if (offset < 0 && offset > closestElt.offset) {
        return { offset: offset, elt: currElt };
      } else {
        return closestElt;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).elt;

    // Insert as last element
    if (insertTaskElt === undefined) {
      setTaskList(removedTaskList.concat([draggingId]));
    } else {
      const insertIx = removedTaskList.indexOf(insertTaskElt.id);
      setTaskList(removedTaskList.slice(0, insertIx)
                                 .concat(draggingId)
                                 .concat(removedTaskList.slice(insertIx)));
    }
  }

  function handleDragEnd(e) {
    e.target.classList.remove('draggingTask');
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
    const taskIx = taskList.indexOf(taskId);
    const task = taskData.get(taskId);
    if (taskIx > 0) { // Cannot make subtask of first task in list
      // Get index of old parent, new parent, and task's index in old parent's children
      const oldParentTaskId = task.parent;
      let newParentTaskId;
      let childIx;
      // If task has parentId, it's already a subtask
      if (oldParentTaskId !== undefined) {
        // New parent is the child left of task in old parent's children, if it exists
        childIx = taskData.get(oldParentTaskId).children.indexOf(taskId);
        if (childIx === 0) {
          return;
        } else {
          newParentTaskId = taskData.get(oldParentTaskId).children[childIx - 1];
        }
      }
      // Else, task is a root (subNum=0), so parent is next root above
      else {
        newParentTaskId = [...taskList].slice(0, taskIx)
                                       .reverse()
                                       .find((taskId) => taskData.get(taskId).subNum === 0);
        // If task.subNum = 0 and taskIx != 0, free to subtask
      }

      const newTaskData = new Map(taskData);
      // Adjust children of old parent
      if (oldParentTaskId !== undefined) {
        const oldParentTask = newTaskData.get(oldParentTaskId);
        const oldChildren = oldParentTask.children;
        oldParentTask.children = oldChildren.slice(0, childIx).concat(oldChildren.slice(childIx + 1));
      }
      // Adjust children of new parent
      // Combine task and its children, since subtasking task puts it at the same subNum as its direct children
      let taskPlusChildren;
      if (task.children.length > 0) {
        taskPlusChildren = [taskId].concat(task.children);
      } else {
        taskPlusChildren = [taskId]
      }
      const newParentTask = newTaskData.get(newParentTaskId);
      const newChildren = newParentTask.children;
      // Find index at which to insert task in new parent's children, if it has children
      let insertIx = newChildren.length;
      for (const childId of newChildren) {
        if (taskList.indexOf(childId) > taskIx) {
          insertIx = newChildren.indexOf(childId);
          break;
        }
      }
      // Insert task + taskChildren at appropriate index
      newParentTask.children = newChildren.slice(0, insertIx)
                                          .concat(taskPlusChildren)
                                          .concat(newChildren.slice(insertIx));

      // Adjust parent, subNum, and children of task
      const newTask = newTaskData.get(taskId);
      newTask.subNum++;
      newTask.parent = newParentTaskId;
      newTask.children.forEach((childId) => {
        const childTask = newTaskData.get(childId);
        childTask.parent = newParentTaskId;
      });
      newTask.children = []; // Reset children after subtasking
      // TODO: update idToTask too

      setTaskData(newTaskData);
    }
  }

  function convertToSupertask(taskId) {
    const taskIx = taskList.indexOf(taskId);
    const task = taskData.get(taskId);
    if (task.parent !== undefined && taskIx > 0) { // Cannot convert to supertask if unindented or is first task
      // Get index of old parent, new parent, and task's index in old parent's children
      const oldParentTaskId = task.parent;
      // new parent = parent of parent of task
      const newParentTaskId = taskData.get(task.parent).parent;

      const newTaskData = new Map(taskData);
      // Adjust children of old parent
      const oldParentTask = newTaskData.get(oldParentTaskId);
      const oldChildren = newTaskData.get(oldParentTaskId).children;
      const oldChildIx = oldChildren.indexOf(taskId);
      oldParentTask.children = oldChildren.slice(0, oldChildIx).concat(oldChildren.slice(oldChildIx + 1));
      // Adjust children of new parent
      // If newParent != undefined, then adjust newParent's children accordingly
      if (newParentTaskId !== undefined) {
        const newParentTask = newTaskData.get(newParentTaskId);
        const newChildren = newParentTask.children;
        // Find index at which to insert task in children
        let insertIx = newChildren.length;
        for (const childId of newChildren) {
          if (taskList.indexOf(childId) > taskIx) {
            insertIx = newChildren.indexOf(childId);
            break;
          }
        }
        // Insert task at appropriate index
        newParentTask.children = newChildren.slice(0, insertIx)
                                            .concat(taskId)
                                            .concat(newChildren.slice(insertIx));
      }
      // Adjust subNum, parent, and children of task
      const newTask = newTaskData.get(taskId);
      newTask.subNum--;
      newTask.parent = newParentTaskId;
      // Recursively decrement subNum of task's children
      const queue = [...newTask.children];
      while (queue.length > 0) {
        const childId = queue.shift();
        const childTask = newTaskData.get(childId);
        childTask.subNum--;
        queue.push(...childTask.children);
      }

      setTaskData(newTaskData);
    }
  }

    return (
      <div className="taskListContainer">
        <TaskInput
          newTask={newTask}
          handleNewTaskChange={handleNewTaskChange}
          handleNewTaskSubmit={handleNewTaskSubmit} />
        <ul className="taskList">
            {taskList.map((taskId) => (
          <Fragment key={taskId}>
            <TaskItem
              task={taskData.get(taskId)}
              selectedTaskId={selectedTaskId}
              editingTask={editingTask}
              handleSelectTask={handleSelectTask}
              handleEditingTaskChange={handleEditingTaskChange}
              handleEditingTaskSelect={handleEditingTaskSelect}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd} />
          </Fragment>))}
        </ul>
        <div className="taskListBelow"></div>
      </div>
    );
}