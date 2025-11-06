import React, { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import EditProfile from '../components/EditProfile';
import ProfileStyle from '../styles/ProfileStyle';
import ProfileCircle from '../components/ProfileCircle';
import SideBar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const [popupMessage, setPopupMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({ totalProjects: 0, completedTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(storedUser);
      
      // Fetch fresh user data from backend
      const userResponse = await api.get(`/api/user/${user._id}`);
      setUserData(userResponse.data);
      
      // Fetch user's projects
      const projectsResponse = await api.get(`/api/project/user/${user._id}`);
      const projects = projectsResponse.data;
      
      // Calculate total completed tasks across all projects
      let totalCompletedTasks = 0;
      for (const project of projects) {
        try {
          const taskReportResponse = await api.get(`/api/task/${project._id}/getreport/${user._id}`);
          totalCompletedTasks += taskReportResponse.data.completed || 0;
        } catch (error) {
          // If user has no tasks in this project, continue
          console.warn(`No tasks found for project ${project._id}:`, error.message);
        }
      }
      
      setUserStats({
        totalProjects: projects.length,
        completedTasks: totalCompletedTasks
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setPopupMessage('Error loading profile data');
      setTimeout(() => setPopupMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatMemberSince = (createdAt) => {
    if (!createdAt) return 'Unknown';
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleButtonClick = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 1200);
  };

  const handleEditInfo = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (updates) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setPopupMessage('No user logged in');
        setTimeout(() => setPopupMessage(''), 3000);
        return;
      }

      const user = JSON.parse(storedUser);

      // Update personal info
      if (updates.firstName || updates.lastName) {
        await api.put(`/api/user/${user._id}/updatename`, {
          firstName: updates.firstName,
          lastName: updates.lastName,
        });
      }

      if (updates.email) {
        await api.put(`/api/user/${user._id}/updateemail`, {
          email: updates.email,
        });
      }

      if (updates.username) {
        await api.put(`/api/user/${user._id}/updateusername`, {
          username: updates.username,
        });
      }

      if (updates.password) {
        await api.put(`/api/user/${user._id}/updatepassword`, {
          password: updates.password,
        });
      }

      // Update selected customizations
      if (updates.selectedIcon !== undefined || updates.selectedBanner !== undefined || updates.selectedBackdrop !== undefined) {
        await api.put(`/api/user/${user._id}/updateselections`, {
          selectedIcon: updates.selectedIcon,
          selectedBanner: updates.selectedBanner,
          selectedBackdrop: updates.selectedBackdrop,
        });
      }

      // Fetch updated user data
      await fetchUserData();

      // Update localStorage
      const updatedUserResponse = await api.get(`/api/user/${user._id}`);
      localStorage.setItem('user', JSON.stringify(updatedUserResponse.data));

      setShowEditModal(false);
      setPopupMessage('Profile updated successfully!');
      setTimeout(() => setPopupMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setPopupMessage(error.response?.data?.error || 'Failed to update profile');
      setTimeout(() => setPopupMessage(''), 3000);
    }
  };

  const handleStoreClick = () => {
    navigate('/store');
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  }

  const handleDeletAccountClick = () => {
    setConfirmDelete(true);
  };

  const performDeleteAccount = async () => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      setPopupMessage('No user logged in.');
      setTimeout(() => setPopupMessage(''), 3000);
      setConfirmDelete(false);
      return;
    }

    let user;
    try {
      user = JSON.parse(currentUser);
    } catch (err) {
      console.error('Invalid user in localStorage', err);
      setPopupMessage('Unable to delete account.');
      setTimeout(() => setPopupMessage(''), 3000);
      setConfirmDelete(false);
      return;
    }

    try {
      await api.delete(`/api/user/${user._id}`);
      localStorage.removeItem('user');
      setPopupMessage('Account successfully deleted.');
      setConfirmDelete(false);
      setTimeout(() => {
        setPopupMessage('');
        navigate('/');
      }, 1200);
    } catch (error) {
      console.error('Error deleting account:', error);
      setPopupMessage('Failed to delete account. Try again later.');
      setConfirmDelete(false);
      setTimeout(() => setPopupMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div style={ProfileStyle.container}>
        <TopNavBar />
        <div style={ProfileStyle.layout}>
          <SideBar />
          <main style={ProfileStyle.main}>
            <div style={ProfileStyle.profilePanel}>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Loading profile...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={ProfileStyle.container}>
        <TopNavBar />
        <div style={ProfileStyle.layout}>
          <SideBar />
          <main style={ProfileStyle.main}>
            <div style={ProfileStyle.profilePanel}>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p style={{ color: 'red' }}>Failed to load profile data</p>
                <PrimaryButton 
                  text="Retry" 
                  onClick={fetchUserData}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={ProfileStyle.container}>
      <TopNavBar />
      <div style={ProfileStyle.layout}>
        <SideBar />
        <main style={ProfileStyle.main}>
          <div style={ProfileStyle.profilePanel}>
            {/* Profile Header with Circle */}
            <div style={ProfileStyle.profileHeader}>
              <ProfileCircle 
                avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500" 
                size={120} 
                alt={`${userData.firstName} ${userData.lastName}`}
              />
              <div style={ProfileStyle.profileHeaderText}>
                <h1 style={ProfileStyle.profileName}>{userData.firstName} {userData.lastName}</h1>
                <p style={ProfileStyle.profileEmail}>{userData.email}</p>
              </div>
            </div>

            {/* Divider */}
            <div style={ProfileStyle.divider} />

            {/* Profile Info Section */}
            <div style={ProfileStyle.infoSection}>
              <h2 style={ProfileStyle.sectionTitle}>Account Information</h2>
              <div style={ProfileStyle.infoGrid}>
                <div style={ProfileStyle.infoCard}>
                  <span style={ProfileStyle.infoLabel}>Member Since</span>
                  <span style={ProfileStyle.infoValue}>{formatMemberSince(userData.createdAt)}</span>
                </div>
                <div style={ProfileStyle.infoCard}>
                  <span style={ProfileStyle.infoLabel}>Total Projects</span>
                  <span style={ProfileStyle.infoValue}>{userStats.totalProjects}</span>
                </div>
                <div style={ProfileStyle.infoCard}>
                  <span style={ProfileStyle.infoLabel}>Tasks Completed</span>
                  <span style={ProfileStyle.infoValue}>{userStats.completedTasks}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={ProfileStyle.actionButtons}>
            <SecondaryButton
                text="Delete Account"
                onClick={() => handleDeletAccountClick()}
              />
              <PrimaryButton
                text="Edit Info"
                onClick={handleEditInfo}
              />
              <PrimaryButton
                text="Store"
                onClick={() => handleStoreClick()}
              />
              <PrimaryButton
                text="Logout"
                onClick={() => handleLogout()}
              />
            </div>
          </div>
        </main>
      </div>

      {popupMessage && (
        <div style={ProfileStyle.overlay}>
          <div style={ProfileStyle.popup}>
            <p style={ProfileStyle.popupText}>{popupMessage}</p>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={ProfileStyle.overlay}>
          <div style={ProfileStyle.popup}>
            <p style={ProfileStyle.popupText}>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
              <PrimaryButton
                text="Cancel"
                onClick={() => setConfirmDelete(false)}
              >
              </PrimaryButton>
              <SecondaryButton
                text="Delete"
                onClick={performDeleteAccount}
              >
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile */}
      <EditProfile
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
