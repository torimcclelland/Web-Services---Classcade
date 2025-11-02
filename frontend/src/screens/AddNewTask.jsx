import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewTaskStyle from '../styles/AddNewTaskStyle';
import api from '../api';

const AddNewTask = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  // Load user projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/api/projects/user/${user._id}`);
        setProjects(res.data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Could not load projects.');
      }
    };
    fetchProjects();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedProject || !taskName) {
      setError('Project and Task Name are required');
      return;
    }

    try {
      await api.post(`/api/tasks/create`, {
        projectId: selectedProject,
        name: taskName,
        description,
        assignedTo: user._id,
        dueDate: dueDate || null,
      });

      alert('Task added successfully!');
      navigate('/my-tasks');
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.response?.data?.error || 'Failed to create task.');
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label style={AddNewTaskStyle.label}>Select Project</label>
            <select
              style={AddNewTaskStyle.select}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select a project</option>
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

            <label style={AddNewTaskStyle.label}>Description</label>
            <textarea
              style={{ ...AddNewTaskStyle.input, height: '80px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label style={AddNewTaskStyle.label}>Due Date</label>
            <input
              type="date"
              style={AddNewTaskStyle.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div style={AddNewTaskStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={() => navigate('/my-tasks')} />
              <PrimaryButton text="Create Task" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddNewTask;