import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewTaskStyle from '../styles/AddNewTaskStyle';
import api from '../api';
import { useProject } from "../context/ProjectContext";

const AddNewTask = () => {
  const navigate = useNavigate();

  const { currentProject } = useProject();
  const user = JSON.parse(localStorage.getItem('user'));

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentProject) {
      alert("Please select a project first.");
      navigate('/home');
    }
  }, [currentProject, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!taskName) {
      setError('Task Name is required');
      return;
    }

    try {
      await api.post(`/api/task/${currentProject._id}`, {
        name: taskName,
        description,
        assignedTo: user._id,
        dueDate: dueDate || null,
        status: "Not Started",
      });

      alert('Task added successfully!');
      navigate('/tasks');
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
            <h2 style={AddNewTaskStyle.title}>
              Add Task to: {currentProject?.name}
            </h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label style={AddNewTaskStyle.label}>Task Name</label>
            <input
              type="text"
              style={AddNewTaskStyle.input}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />

            <label style={AddNewTaskStyle.label}>Description</label>
            <textarea
              style={{ ...AddNewTaskStyle.input, height: '80px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task"
            />

            <label style={AddNewTaskStyle.label}>Due Date</label>
            <input
              type="date"
              style={AddNewTaskStyle.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div style={AddNewTaskStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={() => navigate('/tasks')} />
              <PrimaryButton text="Create Task" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddNewTask;