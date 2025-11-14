import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import PrimaryButton from "../components/PrimaryButton";
import TimeTrackingStyle from "../styles/TimeTrackingStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const TimeTracking = () => {
  const navigate = useNavigate();
  const { selectedProject } = useProject();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [minutes, setMinutes] = useState("");
  const [completed, setCompleted] = useState(false);
  const [popup, setPopup] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/api/task/${selectedProject._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        showPopup("Error loading tasks.");
      }
    };

    fetchTasks();
  }, [selectedProject]);

  const showPopup = (msg) => {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTask || !minutes) {
      showPopup("Please select task & minutes");
      return;
    }

    try {
      await api.post(`/api/time-tracking`, {
        userId: user._id,
        projectId: selectedProject._id,
        taskId: selectedTask,
        minutes: Number(minutes),
        completed,
      });

      showPopup("Time logged");
      setMinutes("");
      setCompleted(false);
      setSelectedTask("");
    } catch (err) {
      console.error("Failed to log time:", err);
      showPopup("Error logging time");
    }
  };

  return (
    <MainLayout>
      <div style={TimeTrackingStyle.formPanel}>
            <h2 style={TimeTrackingStyle.title}>
              Time Tracking ({selectedProject?.name})
            </h2>

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
              style={{ ...TimeTrackingStyle.input, width: "100px" }}
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

      {popup && (
        <div style={TimeTrackingStyle.popupContainer}>
          <div style={TimeTrackingStyle.popupMessage}>{popup}</div>
        </div>
      )}
    </MainLayout>
  );
};

export default TimeTracking;
