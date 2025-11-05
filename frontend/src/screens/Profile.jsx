import React, { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import PrimaryButton from '../components/PrimaryButton';
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

  const handleStoreClick = () => {
    navigate('/store');
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  }

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
              <PrimaryButton
                text="Edit Info"
                onClick={() => handleButtonClick('Editing Info')}
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
    </div>
  );
};

export default Profile;
