import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask }]);
      setNewTask("");
    }
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const editTask = (taskId, newText) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
  };

  const handlePriorityChange = (hoverIndex) => {
    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks[draggedIndex];

    // Reorder tasks
    updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(hoverIndex, 0, draggedTask);

    setTasks(updatedTasks);
    setDraggedIndex(null);
  };

  return (
    <div>
      <p className="heading">Todo App</p>
      <div className="input-box">
        <textarea
          type="text"
          cols="40"
          rows="10"
          placeholder="Click here to add a task"
          value={newTask}
          className="input-area"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <p className="drag-text">Drag and drop to reorder tasks</p>
      <div className="todo-cards-container">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="todo-card"
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handlePriorityChange(index)}
          >
            <div className="todo-text">{task.text}</div>
            <div className="action-buttons">
              <button
                className="delete-button"
                onClick={() => removeTask(task.id)}
              >
                Delete
              </button>
              <button
                className="edit-button"
                onClick={() =>
                  editTask(task.id, prompt("Edit task:", task.text))
                }
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
