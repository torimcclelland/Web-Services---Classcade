import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import PrimaryButton from "../components/PrimaryButton";
import TimeTracking from "./TimeTracking";
import DashboardStyle from "../styles/DashboardStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedProject, loadingProject } = useProject();

  const [report, setReport] = useState({ total: 0, completed: 0 });
  const [tasks, setTasks] = useState([]);
  const [showTimeTracking, setShowTimeTracking] = useState(false);

  useEffect(() => {
    if (!loadingProject && !selectedProject) {
      navigate("/home");
    }
  }, [loadingProject, selectedProject, navigate]);

  useEffect(() => {
    if (loadingProject || !selectedProject?._id) return;

    const fetchData = async () => {
      try {
        const resReport = await api.get(
          `/api/task/${selectedProject._id}/getreport`
        );
        const resTasks = await api.get(`/api/task/${selectedProject._id}`);

        setReport(resReport.data);
        setTasks(resTasks.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, [loadingProject, selectedProject]);

  const total = report?.total || 0;
  const completed = report?.completed || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const upcomingTask = tasks.find((t) => t.status !== "Done");
  const projectDueDate = selectedProject?.dueDate
    ? selectedProject.dueDate.slice(0, 10)
    : "Not set";

  let dueWarning = "";
  if (selectedProject?.dueDate) {
    const due = new Date(selectedProject.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      dueWarning = "Overdue!";
    } else if (diffDays <= 7) {
      dueWarning = `Due in ${diffDays} days`;
    }
  }

  return (
    <MainLayout>
      <div style={DashboardStyle.statsPanel}>
        <h2>{selectedProject?.name} Dashboard</h2>

        <div style={DashboardStyle.statsGrid}>
          <div style={DashboardStyle.statItem}>
            <label style={DashboardStyle.statLabel}>Overall Progress</label>
            <div style={DashboardStyle.progressBar}>
              <div
                style={{
                  ...DashboardStyle.progressFill,
                  width: `${progress}%`,
                  opacity: progress > 0 ? 1 : 0.3,
                }}
              />
            </div>
            <span>{progress}%</span>
          </div>

          <div style={DashboardStyle.statItem}>
            <label style={DashboardStyle.statLabel}>Total Tasks</label>
            <span>{total}</span>
          </div>

          <div style={DashboardStyle.statItem}>
            <label style={DashboardStyle.statLabel}>Completed Tasks</label>
            <span>{completed}</span>
          </div>

          <div style={DashboardStyle.statItem}>
            <label style={DashboardStyle.statLabel}>Project Due Date</label>
            <span>
              {projectDueDate}
              {dueWarning && (
                <span
                  style={{ color: "red", marginLeft: 8, fontWeight: "bold" }}
                >
                  • {dueWarning}
                </span>
              )}
            </span>{" "}
          </div>

          <div style={DashboardStyle.statItem}>
            <label style={DashboardStyle.statLabel}>Next Task</label>
            <span>{upcomingTask ? upcomingTask.name : "All caught up!"}</span>
          </div>

          <div style={DashboardStyle.statItem}>
            <label style={DashboardStyle.statLabel}>Next Task Due Date</label>
            <span>
              {upcomingTask?.dueDate
                ? new Date(upcomingTask.dueDate).toLocaleDateString()
                : "No upcoming deadline"}
            </span>
          </div>
        </div>

        <div style={DashboardStyle.actionButtons}>
          <PrimaryButton
            text="Detailed Stats"
            onClick={() => navigate("/stats")}
          />
          <PrimaryButton
            text="Track Time"
            onClick={() => setShowTimeTracking(true)}
          />
          <PrimaryButton
            text="Schedule Meeting"
            onClick={() => navigate("/zoom")}
          />
        </div>
      </div>

      <TimeTracking 
        isOpen={showTimeTracking} 
        onClose={() => setShowTimeTracking(false)} 
      />
    </MainLayout>
  );
};

export default Dashboard;
