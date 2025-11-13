import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import AddNewTaskStyle from "../styles/AddNewTaskStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const AddNewTaskModal = ({ onClose, onSuccess }) => {
  const { selectedProject } = useProject();
  const user = JSON.parse(localStorage.getItem("user"));

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!taskName) {
      setError("Task Name is required");
      return;
    }

    try {
      await api.post(`/api/task/${selectedProject._id}`, {
        name: taskName,
        description,
        assignedTo: user._id,
        dueDate: dueDate || null,
        status: "Not Started",
      });

      alert("Task added successfully!");
      onSuccess?.(); // optional callback
      onClose();
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

      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <div style={AddNewTaskStyle.actionButtons}>
        <PrimaryButton text="Cancel" onClick={onClose} />
        <PrimaryButton text="Create Task" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default AddNewTaskModal;
