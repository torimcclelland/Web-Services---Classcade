import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import ProfileCircle from "../components/ProfileCircle";
import PrimaryButton from "../components/PrimaryButton";
import DashboardStyle from "../styles/DashboardStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedProject, loadingProject } = useProject();

  const [report, setReport] = useState({ total: 0, completed: 0 });
  const [tasks, setTasks] = useState([]);

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

  return (
    <div style={DashboardStyle.container}>
      <TopNavBar />

      <div style={DashboardStyle.layout}>
        <SideBar />

        <main style={DashboardStyle.main}>
          <div style={DashboardStyle.profileHeader}>
            <ProfileCircle
              avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
              size={48}
            />
          </div>

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
                <span>{projectDueDate}</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Next Task</label>
                <span>
                  {upcomingTask ? upcomingTask.name : "All caught up!"}
                </span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>
                  Next Task Due Date
                </label>
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
                onClick={() => navigate("/timetracking")}
              />
              <PrimaryButton
                text="Schedule Meeting"
                onClick={() => navigate("/zoom")}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
