import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewGroupStyle from '../styles/AddNewGroupStyle';

const AddNewProject = () => {
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
    <div style={AddNewGroupStyle.container}>
      <TopNavBar />
      <div style={AddNewGroupStyle.layout}>
        <SideBar />
        <main style={AddNewGroupStyle.main}>
          <div style={AddNewGroupStyle.formPanel}>
            <h2 style={AddNewGroupStyle.title}>Add New Group</h2>

            <label style={AddNewGroupStyle.label}>Group Name</label>
            <input
              type="text"
              style={AddNewGroupStyle.input}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />

            <label style={AddNewGroupStyle.label}>Teacher Email (optional)</label>
            <input
              type="email"
              style={AddNewGroupStyle.input}
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="Enter teacher email"
            />

            <label style={AddNewGroupStyle.label}>Groupmate Emails</label>
            <textarea
              style={{ ...AddNewGroupStyle.input, height: '80px' }}
              value={groupmateEmails}
              onChange={(e) => setGroupmateEmails(e.target.value)}
              placeholder="Enter emails separated by commas"
            />

            <div style={AddNewGroupStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={handleCancel} />
              <PrimaryButton text="Create" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>

      {showCancelPopup && (
        <div style={AddNewGroupStyle.overlay}>
          <div style={AddNewGroupStyle.popup}>
            <p style={AddNewGroupStyle.popupText}>
              Are you sure you want to cancel?
            </p>
            <div style={AddNewGroupStyle.popupButtons}>
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
        <div style={AddNewGroupStyle.overlay}>
          <div style={AddNewGroupStyle.popup}>
            <p style={AddNewGroupStyle.popupText}>Group creation cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProject;
