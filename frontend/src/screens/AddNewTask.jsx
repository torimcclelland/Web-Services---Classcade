import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import PrimaryButton from "../components/PrimaryButton";
import api from "../api";
import AddNewTaskStyle from "../styles/AddNewTaskStyle";

const AddNewTask = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all projects for the logged-in user
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user?._id) return;

        const res = await api.get(`/api/project/user/${user._id}`);
        setProjects(res.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Could not load projects.");
      }
    };

    fetchProjects();
  }, [user]);

  // Fetch members for selected project
  const handleProjectChange = async (projectId) => {
    setSelectedProject(projectId);
    setMembers([]);
    setAssignedTo("");

    try {
      const projectRes = await api.get(`/api/project/${projectId}`);
      setMembers(projectRes.data.members || []);
    } catch (err) {
      console.error("Error fetching project members:", err);
      setError("Could not load project members.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProject || !taskName || !assignedTo) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      await api.post("/api/task/create", {
        projectId: selectedProject,
        name: taskName,
        description: taskDescription,
        dueDate,
        assignedTo,
      });

      alert("Task created successfully!");
      navigate("/tasks");
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.response?.data?.error || "Failed to create task.");
    }
  };

  return (
    <div style={AddNewTaskStyle.container}>
      <TopNavBar />
      <div style={AddNewTaskStyle.layout}>
        <SideBar />
        <main style={AddNewTaskStyle.main}>
          <div style={AddNewTaskStyle.formPanel}>
            <h2 style={AddNewTaskStyle.title}>Add New Task</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <label style={AddNewTaskStyle.label}>Select a Project</label>
            <select
              style={AddNewTaskStyle.select}
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <label style={AddNewTaskStyle.label}>Task Name</label>
            <input
              type="text"
              style={AddNewTaskStyle.input}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <label style={AddNewTaskStyle.label}>Task Description</label>
            <textarea
              style={{ ...AddNewTaskStyle.input, height: "80px" }}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />

            <label style={AddNewTaskStyle.label}>Due Date</label>
            <input
              type="date"
              style={AddNewTaskStyle.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <label style={AddNewTaskStyle.label}>Assign To</label>
            <select
              style={AddNewTaskStyle.select}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={!members.length}
            >
              <option value="">Select a Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.username || member.email}
                </option>
              ))}
            </select>

            <div style={AddNewTaskStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={() => navigate("/tasks")} />
              <PrimaryButton text="Create Task" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddNewTask;