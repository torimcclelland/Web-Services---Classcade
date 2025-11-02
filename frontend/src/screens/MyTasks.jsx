import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import ProfileCircle from '../components/ProfileCircle';
import PrimaryButton from '../components/PrimaryButton';
import MyTasksStyle from '../styles/MyTasksStyle';
import api from '../api';
import { useProject } from '../context/ProjectContext';

const swimlanes = ['Not Started', 'In Progress', 'Under Review', 'Done'];

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const { currentProject } = useProject();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject?._id || !user?._id) return;

      try {
        const res = await api.get(`/api/task/${currentProject._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    fetchTasks();
  }, [currentProject, user]);

  const getTasksByStatus = (status) =>
    tasks.filter(task => task.status === status);

  return (
    <div style={MyTasksStyle.container}>
      <TopNavBar />
      <div style={MyTasksStyle.layout}>
        <SideBar />

        <main style={MyTasksStyle.main}>
          <div style={MyTasksStyle.header}>
            <h2>My Tasks ({currentProject?.name})</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PrimaryButton text="Add Task" onClick={() => navigate('/add-task')} />
              <ProfileCircle
                avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
                size={48}
              />
            </div>
          </div>

          <div style={MyTasksStyle.swimlaneContainer}>
            {swimlanes.map((lane) => (
              <div key={lane} style={MyTasksStyle.swimlane}>
                <h3 style={MyTasksStyle.swimlaneTitle}>{lane}</h3>

                {getTasksByStatus(lane).map((task) => (
                  <div key={task._id} style={MyTasksStyle.taskCard}>
                    <h4 style={MyTasksStyle.taskTitle}>{task.name}</h4>
                    <p style={MyTasksStyle.taskDescription}>{task.description}</p>
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