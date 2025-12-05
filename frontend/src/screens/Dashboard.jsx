import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import TimeTracking from "./TimeTracking";
import DashboardStyle from "../styles/DashboardStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import AddNewTask from "./AddNewTask";
import ModalWrapper from "../components/ModalWrapper";

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedProject, loadingProject } = useProject();

  const [report, setReport] = useState({ total: 0, completed: 0 });
  const [tasks, setTasks] = useState([]);
  const [showTimeTracking, setShowTimeTracking] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

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
  
  // Get task with soonest due date that is not Done
  const upcomingTask = tasks
    .filter((t) => t.status !== "Done" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0] || 
    tasks.find((t) => t.status !== "Done");
  
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

  const handleTaskAdded = () => {
    setShowAddTaskModal(false);
    // Refresh data
    if (selectedProject?._id) {
      api.get(`/api/task/${selectedProject._id}/getreport`).then(res => setReport(res.data));
      api.get(`/api/task/${selectedProject._id}`).then(res => setTasks(res.data));
    }
  };

  return (
    <MainLayout>
      <div style={DashboardStyle.container}>
        {/* Header Section */}
        <div style={DashboardStyle.header}>
          <h1 style={DashboardStyle.projectTitle}>{selectedProject?.name}</h1>
          <button
            style={{
              ...DashboardStyle.editProjectBtn,
              backgroundColor: hoveredBtn === 'editProject' ? "#f5f5f5" : "#fff",
            }}
            onMouseEnter={() => setHoveredBtn('editProject')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Edit Project
          </button>
        </div>

        {/* Stats Grid */}
        <div style={DashboardStyle.statsContainer}>
          <div style={DashboardStyle.statCard}>
            <div style={DashboardStyle.statLabel}>Project Due Date</div>
            <div style={DashboardStyle.statValue}>{projectDueDate}</div>
            {dueWarning && (
              <div style={DashboardStyle.dueWarning}>{dueWarning}</div>
            )}
          </div>

          <div style={DashboardStyle.statCard}>
            <div style={DashboardStyle.statLabel}>Overall Progress</div>
            <div style={DashboardStyle.statValue}>{progress}%</div>
            <div style={DashboardStyle.progressBarContainer}>
              <div
                style={{
                  ...DashboardStyle.progressBar,
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div style={DashboardStyle.statCard}>
            <div style={DashboardStyle.statLabel}>Total Tasks</div>
            <div style={DashboardStyle.statValue}>{total}</div>
          </div>

          <div style={DashboardStyle.statCard}>
            <div style={DashboardStyle.statLabel}>Completed</div>
            <div style={DashboardStyle.statValue}>{completed}</div>
          </div>

          <div style={DashboardStyle.statCard}>
            <div style={DashboardStyle.statLabel}>Next Task</div>
            <div style={DashboardStyle.statValueSmall}>
              {upcomingTask ? upcomingTask.name : "All caught up!"}
            </div>
            <div style={DashboardStyle.statSubtext}>
              {upcomingTask?.dueDate
                ? new Date(upcomingTask.dueDate).toLocaleDateString()
                : "No deadline"}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={DashboardStyle.quickActions}>
          <div style={DashboardStyle.sectionTitle}>Quick Actions</div>
          <div style={DashboardStyle.actionCardsGrid}>
            <div
              style={{
                ...DashboardStyle.actionCard,
                backgroundColor: hoveredBtn === 'addTask' ? "#f0f9ff" : "#fff",
              }}
              onClick={() => setShowAddTaskModal(true)}
              onMouseEnter={() => setHoveredBtn('addTask')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <div style={DashboardStyle.actionCardTitle}>Add Task</div>
              <div style={DashboardStyle.actionCardDesc}>Create a new task for this project</div>
            </div>

            <div
              style={{
                ...DashboardStyle.actionCard,
                backgroundColor: hoveredBtn === 'stats' ? "#f0f9ff" : "#fff",
              }}
              onClick={() => navigate("/stats")}
              onMouseEnter={() => setHoveredBtn('stats')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <div style={DashboardStyle.actionCardTitle}>Detailed Stats</div>
              <div style={DashboardStyle.actionCardDesc}>View analytics and reports</div>
            </div>

            <div
              style={{
                ...DashboardStyle.actionCard,
                backgroundColor: hoveredBtn === 'time' ? "#f0f9ff" : "#fff",
              }}
              onClick={() => setShowTimeTracking(true)}
              onMouseEnter={() => setHoveredBtn('time')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <div style={DashboardStyle.actionCardTitle}>Track Time</div>
              <div style={DashboardStyle.actionCardDesc}>Log hours you spend on tasks</div>
            </div>

            <div
              style={{
                ...DashboardStyle.actionCard,
                backgroundColor: hoveredBtn === 'zoom' ? "#f0f9ff" : "#fff",
              }}
              onClick={() => navigate("/zoom")}
              onMouseEnter={() => setHoveredBtn('zoom')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <div style={DashboardStyle.actionCardTitle}>Schedule Meeting</div>
              <div style={DashboardStyle.actionCardDesc}>Set up a Zoom call</div>
            </div>
          </div>
        </div>
      </div>

      <TimeTracking 
        isOpen={showTimeTracking} 
        onClose={() => setShowTimeTracking(false)} 
      />

      {showAddTaskModal && (
        <ModalWrapper onClose={() => setShowAddTaskModal(false)}>
          <AddNewTask
            onClose={handleTaskAdded}
            projectId={selectedProject?._id}
          />
        </ModalWrapper>
      )}
    </MainLayout>
  );
};

export default Dashboard;
