import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import TimeTrackingStyle from '../styles/TimeTrackingStyle';
import axios from 'axios'; // added axios

const TimeTracking = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [minutes, setMinutes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Updated portion: fetch projects for logged-in user
  useEffect(() => {
    axios.get(`${apiUrl}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProjects(res.data))
    .catch(err => console.error(err));
  }, []);

  // Updated portion: fetch tasks when project changes
  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      setSelectedTask('');
      return;
    }
    axios.get(`${apiUrl}/projects/${selectedProject}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setTasks(res.data))
    .catch(err => console.error(err));
  }, [selectedProject]);

  const handleSubmit = async () => {
    if (!selectedProject || !selectedTask || !minutes) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await axios.post(`${apiUrl}/time-tracking`, {
        projectId: selectedProject,
        taskId: selectedTask,
        minutes: parseInt(minutes),
        completed,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Time entry submitted!');
      setSelectedProject('');
      setSelectedTask('');
      setMinutes('');
      setCompleted(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit time entry.');
    }
  };

  const handleCancel = () => setShowCancelPopup(true);

  const confirmCancel = () => {
    setShowCancelPopup(false);
    setShowConfirmPopup(true);
    setTimeout(() => {
      setShowConfirmPopup(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleToggle = () => setCompleted(!completed);

  return (
    <div style={TimeTrackingStyle.container}>
      <TopNavBar />
      <div style={TimeTrackingStyle.layout}>
        <SideBar />
        <main style={TimeTrackingStyle.main}>
          <div style={TimeTrackingStyle.formPanel}>
            <h2 style={TimeTrackingStyle.title}>Time Tracking</h2>

            <label style={TimeTrackingStyle.label}>Select Project</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select a Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <label style={TimeTrackingStyle.label}>Select Task</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              disabled={!selectedProject}
            >
              <option value="">Select a Task</option>
              {tasks.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            <label style={TimeTrackingStyle.label}>Minutes</label>
            <input
              type="number"
              style={TimeTrackingStyle.input}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />

            <div style={TimeTrackingStyle.row}>
              <label style={TimeTrackingStyle.switchLabel}>Completed?</label>
              <div
                style={{
                  ...TimeTrackingStyle.toggle,
                  backgroundColor: completed ? '#1e3a8a' : '#ccc',
                }}
                onClick={handleToggle}
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
              <PrimaryButton text="Cancel" onClick={handleCancel} />
              <PrimaryButton text="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>

      {showCancelPopup && (
        <div style={TimeTrackingStyle.overlay}>
          <div style={TimeTrackingStyle.popup}>
            <p style={TimeTrackingStyle.popupText}>Are you sure you want to cancel?</p>
            <div style={TimeTrackingStyle.popupButtons}>
              <PrimaryButton text="Yes" onClick={confirmCancel} />
              <PrimaryButton text="No" onClick={() => setShowCancelPopup(false)} />
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div style={TimeTrackingStyle.overlay}>
          <div style={TimeTrackingStyle.popup}>
            <p style={TimeTrackingStyle.popupText}>Form cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;


