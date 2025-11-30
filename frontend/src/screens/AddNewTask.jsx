import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import AddNewTaskStyle from "../styles/AddNewTaskStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const swimlanes = ["Not Started", "In Progress", "Under Review", "Done"];

const AddNewTaskModal = ({ task, onClose, onSuccess }) => {
  const { selectedProject } = useProject();
  const user = JSON.parse(localStorage.getItem("user"));

  const [taskName, setTaskName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [status, setStatus] = useState(task?.status || "Not Started");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!taskName.trim()) {
      setError("Task Name is required");
      return;
    }

    try {
      if (task) {
        //editing existing task
        await api.put(`/api/task/${selectedProject._id}/${task._id}`, {
          name: taskName.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
          status,
        });
      } else {
        //creating new task
        await api.post(`/api/task/${selectedProject._id}`, {
          name: taskName.trim(),
          description: description.trim(),
          assignedTo: user._id,
          dueDate: dueDate || null,
          status,
        });
      }

      onSuccess?.(); //refresh task list
      onClose();     //close modal
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Failed to save task."
      );
    }
  };

  return (
    <div style={AddNewTaskStyle.formPanel}>
      <h2 style={AddNewTaskStyle.title}>
        {task ? "Edit Task" : `Add Task to: ${selectedProject?.name}`}
      </h2>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <label style={AddNewTaskStyle.label}>Task Name</label>
      <input
        type="text"
        style={AddNewTaskStyle.input}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value.slice(0, 50))}
        placeholder="Enter task name"
        maxLength={50}
      />
      <small style={{ color: "#666", fontSize: "0.8rem", marginTop: "-0.5rem", marginBottom: "0.5rem" }}>
        {taskName.length}/50 characters
      </small>

      <label style={AddNewTaskStyle.label}>Description</label>
      <textarea
        style={{ ...AddNewTaskStyle.input, height: "80px" }}
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, 200))}
        placeholder="Describe the task"
        maxLength={200}
      />
      <small style={{ color: "#666", fontSize: "0.8rem", marginTop: "-0.5rem", marginBottom: "0.5rem" }}>
        {description.length}/200 characters
      </small>

      <label style={AddNewTaskStyle.label}>Due Date</label>
      <input
        type="date"
        style={AddNewTaskStyle.input}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />

      <label style={AddNewTaskStyle.label}>Status</label>
      <select
        style={AddNewTaskStyle.select}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {swimlanes.map((lane) => (
          <option key={lane} value={lane}>
            {lane}
          </option>
        ))}
      </select>

      <div style={AddNewTaskStyle.actionButtons}>
        <PrimaryButton text="Cancel" onClick={onClose} />
        <PrimaryButton
          text={task ? "Update Task" : "Create Task"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddNewTaskModal;
