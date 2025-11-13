import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import AddNewTaskStyle from "../styles/AddNewTaskStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const swimlanes = ["Not Started", "In Progress", "Under Review", "Done"];

const AddNewTaskModal = ({ onClose, onSuccess }) => {
  const { selectedProject } = useProject();
  const user = JSON.parse(localStorage.getItem("user"));

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!taskName.trim()) {
      setError("Task Name is required");
      return;
    }

    try {
      await api.post(`/api/task/${selectedProject._id}`, {
        name: taskName.trim(),
        description: description.trim(),
        assignedTo: user._id,
        dueDate: dueDate || null,
        status,
      });

      alert("Task added successfully!");
      onSuccess?.(); // refresh task list in parent
      onClose();     // close modal
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(err.response?.data?.error || "Failed to create task.");
    }
  };

  return (
    <div style={AddNewTaskStyle.formPanel}>
      <h2 style={AddNewTaskStyle.title}>
        Add Task to: {selectedProject?.name}
      </h2>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <label style={AddNewTaskStyle.label}>Task Name</label>
      <input
        type="text"
        style={AddNewTaskStyle.input}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
      />

      <label style={AddNewTaskStyle.label}>Description</label>
      <textarea
        style={{ ...AddNewTaskStyle.input, height: "80px" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the task"
      />

      <label style={AddNewTaskStyle.label}>Due Date</label>
      <input
        type="date"
        style={AddNewTaskStyle.input}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
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
        <PrimaryButton text="Create Task" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default AddNewTaskModal;
