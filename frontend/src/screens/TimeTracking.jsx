import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import TimeTrackingStyle from '../styles/TimeTrackingStyle';

const TimeTracking = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [minutes, setMinutes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSubmit = () => {
    alert(
      `Form Submitted:\nClass: ${selectedClass}\nTask: ${selectedTask}\nMinutes: ${minutes}\nCompleted: ${completed}`
    );
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

            <label style={TimeTrackingStyle.label}>Select a Class</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a Class</option>
              <option value="SWENG">SWENG</option>
              <option value="COMPSCI">COMPSCI</option>
              <option value="GROUP 3">GROUP 3</option>
            </select>

            <label style={TimeTrackingStyle.label}>Select a Task</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select a Task</option>
              <option value="Homework">Homework</option>
              <option value="Project">Project</option>
              <option value="Meeting">Meeting</option>
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
                ></div>
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
            <p style={TimeTrackingStyle.popupText}>
              Are you sure you want to cancel?
            </p>
            <div style={TimeTrackingStyle.popupButtons}>
              <PrimaryButton text="Yes" onClick={confirmCancel} />
              <PrimaryButton
                text="No"
                onClick={() => setShowCancelPopup(false)}
              />
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


