import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import ProfileCircle from "../components/ProfileCircle";
import PrimaryButton from "../components/PrimaryButton";
import MyTasksStyle from "../styles/MyTasksStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const swimlanes = ["Not Started", "In Progress", "Under Review", "Done"];

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { selectedProject } = useProject();

  useEffect(() => {
    if (!selectedProject?._id) {
      navigate("/home");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/api/task/${selectedProject._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [selectedProject, navigate]);

  const getTasksByStatus = (lane) =>
    tasks.filter((task) => task.status === lane);

  return (
    <div style={MyTasksStyle.container}>
      <TopNavBar />
      <div style={MyTasksStyle.layout}>
        <SideBar />

        <main style={MyTasksStyle.main}>
          <div style={MyTasksStyle.header}>
            <h2>My Tasks ({selectedProject?.name})</h2>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <PrimaryButton
                text="Add Task"
                onClick={() => navigate("/add-task")}
              />
              <ProfileCircle
                size={48}
              />
            </div>
          </div>

          <div style={MyTasksStyle.swimlaneContainer}>
            {swimlanes.map((lane) => (
              <div key={lane} style={MyTasksStyle.swimlane}>
                <h3 style={MyTasksStyle.swimlaneTitle}>{lane}</h3>

                {getTasksByStatus(lane).length === 0 && (
                  <p style={{ fontStyle: "italic", opacity: 0.6 }}>
                    No tasks yet
                  </p>
                )}

                {getTasksByStatus(lane).map((task) => (
                  <div key={task._id} style={MyTasksStyle.taskCard}>
                    <h4 style={MyTasksStyle.taskTitle}>{task.name}</h4>
                    <p style={MyTasksStyle.taskDescription}>
                      {task.description}
                    </p>
                    {task.dueDate && (
                      <p style={MyTasksStyle.taskDueDate}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTasks;
