import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#C9F3D5',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  layout: {
    display: 'flex',
    flex: 1,
  },
  main: {
    flex: 1,
    padding: '40px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formBox: {
    backgroundColor: '#DDF9EA',
    border: '3px solid #35633F',
    borderRadius: 10,
    padding: '40px 60px',
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    color: '#000',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 4,
    border: '1px solid #000',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 4,
    border: '1px solid #000',
    fontSize: 16,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 600,
  },
  toggle: {
    position: 'relative',
    width: 50,
    height: 25,
    backgroundColor: '#ccc',
    borderRadius: 25,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  toggleCircle: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 19,
    height: 19,
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: 'left 0.3s',
  },
  buttonsRow: {
    display: 'flex',
    gap: 20,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E53935',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
  },
  submitBtn: {
    backgroundColor: '#35633F',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '30px 40px',
    textAlign: 'center',
    maxWidth: 350,
  },
  popupText: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 20,
  },
  popupButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
  },
  yesBtn: {
    backgroundColor: '#35633F',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  noBtn: {
    backgroundColor: '#E53935',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

const TimeTracking = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [minutes, setMinutes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSubmit = () => { // should be a pop up when the user clicks the 'submit' button to confirm functionality
    alert(
      `Form Submitted:\nClass: ${selectedClass}\nTask: ${selectedTask}\nMinutes: ${minutes}\nCompleted: ${completed}`
    );
  };

  const handleCancel = () => { // again should give a pop up for the cancel button (this one will double check if they're sure they want to cancel)
    setShowCancelPopup(true);
  };

  const confirmCancel = () => { // this asks if they're sure they want to cancel. if they are, navigates back to dashboard
    setShowCancelPopup(false);
    setShowConfirmPopup(true);
    setTimeout(() => {
      setShowConfirmPopup(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleToggle = () => { // this is the toggle for the 'completed?' button
    setCompleted(!completed);
  };

  return (
    <div style={styles.container}>
      <TopNavBar />
      <div style={styles.layout}>
        <SideBar />
        <main style={styles.main}>
          <div style={styles.formBox}>
            <h2 style={styles.title}>Time Tracking - Enter Time Form</h2>

            <label style={styles.label}>Select a Class</label>
            <select
              style={styles.select}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a Class</option>
              <option value="SWENG">SWENG</option>
              <option value="COMPSCI">COMPSCI</option>
              <option value="GROUP 3">GROUP 3</option>
            </select>

            <label style={styles.label}>Select a Task</label>
            <select
              style={styles.select}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select a Task</option>
              <option value="Homework">Homework</option>
              <option value="Project">Project</option>
              <option value="Meeting">Meeting</option>
            </select>

            <label style={styles.label}>Minutes</label>
            <input
              type="number"
              style={styles.input}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />

            <div style={styles.row}>
              <label style={styles.switchLabel}>Completed?</label>
              <div
                style={{
                  ...styles.toggle,
                  backgroundColor: completed ? '#1976d2' : '#ccc',
                }}
                onClick={handleToggle}
              >
                <div
                  style={{
                    ...styles.toggleCircle,
                    left: completed ? 28 : 3,
                  }}
                ></div>
              </div>
            </div>

            <div style={styles.buttonsRow}>
              <button style={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
              <button style={styles.submitBtn} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <p style={styles.popupText}>Are you sure you want to cancel?</p>
            <div style={styles.popupButtons}>
              <button style={styles.yesBtn} onClick={confirmCancel}>
                Yes
              </button>
              <button
                style={styles.noBtn}
                onClick={() => setShowCancelPopup(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Confirmation Popup */}
      {showConfirmPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <p style={styles.popupText}>Form cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;

