import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import PrimaryButton from "../components/PrimaryButton";
import TimeTrackingStyle from "../styles/TimeTrackingStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const TimeTracking = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [minutes, setMinutes] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch tasks for current project
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject?._id || !user?._id) return;

      try {
        const res = await api.get(`/api/task/${currentProject._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to load tasks for this project.");
      }
    };

    fetchTasks();
  }, [currentProject, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedTask || !minutes) {
      setError("Please select a task and enter minutes.");
      return;
    }

    try {
      await api.post(`/api/time-tracking`, {
        taskId: selectedTask,
        minutes: Number(minutes),
        completed,
      });

      setSuccessMsg("Time successfully logged!");
      setMinutes("");
      setCompleted(false);
      setSelectedTask("");
    } catch (err) {
      console.error("Failed to log time:", err);
      setError("Failed to submit time.");
    }
  };

  return (
    <div style={TimeTrackingStyle.container}>
      <TopNavBar />
      <div style={TimeTrackingStyle.layout}>
        <SideBar />
        <main style={TimeTrackingStyle.main}>
          <div style={TimeTrackingStyle.formPanel}>
            <h2 style={TimeTrackingStyle.title}>
              Time Tracking ({currentProject?.name})
            </h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <label style={TimeTrackingStyle.label}>Select Task</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">-- Select Task --</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.name}
                </option>
              ))}
            </select>

            <label style={TimeTrackingStyle.label}>Minutes</label>
            <input
              type="number"
              style={{ ...TimeTrackingStyle.input, width: "80px" }} // smaller width
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />

            <div style={TimeTrackingStyle.row}>
              <label style={TimeTrackingStyle.switchLabel}>Completed?</label>
              <div
                style={{
                  ...TimeTrackingStyle.toggle,
                  backgroundColor: completed ? "#1e3a8a" : "#ccc",
                }}
                onClick={() => setCompleted(!completed)}
              >
                <div
                  style={{
                    ...TimeTrackingStyle.toggleCircle,
                    left: completed ? 28 : 3,
                  }}
                />
              </div>
            </div>

            <div style={TimeTrackingStyle.actionButtons}>
              <PrimaryButton
                text="Cancel"
                onClick={() => navigate("/dashboard")}
              />
              <PrimaryButton text="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeTracking;