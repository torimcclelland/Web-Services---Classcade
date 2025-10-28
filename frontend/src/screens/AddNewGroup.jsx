import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewGroupStyle from '../styles/AddNewGroupStyle';

const AddNewGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [groupmateEmails, setGroupmateEmails] = useState('');
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSubmit = () => {
    alert(
      `Group Created:\nName: ${groupName}\nTeacher Email: ${teacherEmail}\nGroupmate Emails: ${groupmateEmails}`
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

  return (
    <div style={TimeTrackingStyle.container}>
      <TopNavBar />
      <div style={TimeTrackingStyle.layout}>
        <SideBar />
        <main style={TimeTrackingStyle.main}>
          <div style={TimeTrackingStyle.formPanel}>
            <h2 style={TimeTrackingStyle.title}>Add New Group</h2>

            <label style={TimeTrackingStyle.label}>Group Name</label>
            <input
              type="text"
              style={TimeTrackingStyle.input}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />

            <label style={TimeTrackingStyle.label}>Teacher Email (optional)</label>
            <input
              type="email"
              style={TimeTrackingStyle.input}
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="Enter teacher email"
            />

            <label style={TimeTrackingStyle.label}>Groupmate Emails</label>
            <textarea
              style={{ ...TimeTrackingStyle.input, height: '80px' }}
              value={groupmateEmails}
              onChange={(e) => setGroupmateEmails(e.target.value)}
              placeholder="Enter emails separated by commas"
            />

            <div style={TimeTrackingStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={handleCancel} />
              <PrimaryButton text="Create" onClick={handleSubmit} />
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
            <p style={TimeTrackingStyle.popupText}>Group creation cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewGroup;
