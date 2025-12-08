import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import AddNewTaskStyle from "../styles/AddNewTaskStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import SecondaryButton from "../components/SecondaryButton";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [members, setMembers] = useState([]);
  const [assignedTo, setAssignedTo] = useState(
    (typeof task?.assignedTo === "object" && task.assignedTo?._id) || task?.assignedTo || user?._id || ""
  );

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedProject?._id) return;
      try {
        const res = await api.get(`/api/project/${selectedProject._id}/members`);
        setMembers(res.data || []);
      } catch (err) {
        console.error("Failed to load project members:", err);
      }
    };

    fetchMembers();
  }, [selectedProject]);

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
          assignedTo: assignedTo || null,
        });
      } else {
        //creating new task
        await api.post(`/api/task/${selectedProject._id}`, {
          name: taskName.trim(),
          description: description.trim(),
          assignedTo: assignedTo || user?._id || null,
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

  const handleDelete = async () => {
    try {
      await api.delete(`/api/task/${selectedProject._id}/${task._id}`);
      onSuccess?.(); //refresh task list
      onClose();     //close modal
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Failed to delete task."
      );
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
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

      <label style={AddNewTaskStyle.label}>Assign To</label>
      <select
        style={AddNewTaskStyle.select}
        value={assignedTo || ""}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Unassigned</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.firstName || member.lastName
              ? `${member.firstName || ""} ${member.lastName || ""}`.trim()
              : member.username || member.email || "User"}
          </option>
        ))}
      </select>

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
        {task && (
          <SecondaryButton 
            text="Delete Task" 
            onClick={() => setShowDeleteConfirm(true)}
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
          />
        )}
        <PrimaryButton text="Cancel" onClick={onClose} />
        <PrimaryButton
          text={task ? "Update Task" : "Create Task"}
          onClick={handleSubmit}
        />
      </div>
    </div>

    {showDeleteConfirm && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "400px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        }}>
          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
            Delete Task?
          </h3>
          <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
            Are you sure you want to delete "{taskName}"? This action cannot be undone.
          </p>
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}>
            <PrimaryButton
              text="Cancel"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <SecondaryButton
              text="Delete"
              onClick={handleDelete}
              style={{ backgroundColor: "#dc2626", color: "#fff" }}
            />
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default AddNewTaskModal;
