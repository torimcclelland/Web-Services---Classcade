import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewGroupStyle from '../styles/AddNewGroupStyle';

const AddNewProject = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);        // store groups
  const [selectedGroup, setSelectedGroup] = useState('');
  const [projectName, setProjectName] = useState('');
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // 🔹 Fetch groups for the current user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Replace with your actual API call or context
        const response = await fetch('/api/groups'); 
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = () => {
    alert(
      `Project Created:\nGroup: ${selectedGroup}\nProject Name: ${projectName}`
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
            <h2 style={AddNewGroupStyle.title}>Add New Project</h2>

            {/* 🔹 Dropdown for groups */}
            <label style={AddNewGroupStyle.label}>Select Group</label>
            <select
              style={AddNewGroupStyle.select}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">-- Choose a group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>

            <label style={AddNewGroupStyle.label}>Project Name</label>
            <input
              type="text"
              style={AddNewGroupStyle.input}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
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
            <p style={AddNewGroupStyle.popupText}>Project creation cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProject;

