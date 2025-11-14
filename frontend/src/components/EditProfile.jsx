import React, { useState, useEffect } from 'react';
import TextField from './TextField';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { ALL_ICONS, ALL_BANNERS, ALL_BACKDROPS, DEFAULT_ICON, DEFAULT_BANNER, getUserIcon } from '../constants/storeItems';
import EditProfileStyle from "../styles/EditProfileStyle";
import star from '../assets/star.png';
import flame from '../assets/fire.png';

const EditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'customization'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedBackdrop, setSelectedBackdrop] = useState(null);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' }); // 'success' or 'error'
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        username: userData.username || '',
        password: '',
        confirmPassword: '',
      });
      setSelectedIcon(userData.selectedIcon || 'default');
      setSelectedBanner(userData.selectedBanner || 'default');
      setSelectedBackdrop(userData.selectedBackdrop || null);
      setErrors({});
      setSaveMessage({ type: '', text: '' });
      setActiveTab('personal');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    // Reset all form data to original values
    setFormData({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      username: userData?.username || '',
      password: '',
      confirmPassword: '',
    });
    setSelectedIcon(userData?.selectedIcon || 'default');
    setSelectedBanner(userData?.selectedBanner || 'default');
    setSelectedBackdrop(userData?.selectedBackdrop || null);
    setErrors({});
    setSaveMessage({ type: '', text: '' });
    setActiveTab('personal');
    onClose();
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Clear previous messages
    setSaveMessage({ type: '', text: '' });

    // Always validate personal info before saving, regardless of which tab is active
    if (!validatePersonalInfo()) {
      // If validation fails, switch to personal tab to show errors
      setActiveTab('personal');
      return;
    }

    const updates = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      selectedIcon,
      selectedBanner,
      selectedBackdrop,
    };

    // Only include password if it was changed
    if (formData.password) {
      updates.password = formData.password;
    }

    setIsSaving(true);
    const result = await onSave(updates);
    setIsSaving(false);

    if (result && result.success) {
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1000);
    } else if (result && result.error) {
      setSaveMessage({ type: 'error', text: result.error });
    }
  };

  const getOwnedIcons = () => {
    // Always include the default icon as the first option
    const ownedIcons = ALL_ICONS.filter(icon => userData?.ownedIcons?.includes(icon.id));
    return [DEFAULT_ICON, ...ownedIcons];
  };

  const getOwnedBanners = () => {
    // Always include the default banner as the first option
    const ownedBanners = ALL_BANNERS.filter(banner => userData?.ownedBanners?.includes(banner.id));
    return [DEFAULT_BANNER, ...ownedBanners];
  };

  const getOwnedBackdrops = () => {
    return ALL_BACKDROPS.filter(backdrop => userData?.ownedBackdrops?.includes(backdrop.id));
  };

  // Render backdrop based on type
  const renderBackdrop = (type, color) => {
    const backdropStyle = {
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    switch(type) {
      case 'circle':
        return <div style={{
          ...backdropStyle,
          width: 70,
          height: 70,
          borderRadius: '50%',
          border: `4px solid ${color}`,
        }} />;
      
      case 'star':
        return (
          <img
            src={star}
            alt="star backdrop"
            style={{
              ...backdropStyle,
              width: 100,
              height: 100,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        );
      
      case 'hexagon':
        return <div style={{
          ...backdropStyle,
          width: 80,
          height: 70,
          backgroundColor: color,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          opacity: 0.8,
        }} />;
      
      case 'doublering':
        return <>
          <div style={{
            ...backdropStyle,
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: `3px solid ${color}`,
          }} />
          <div style={{
            ...backdropStyle,
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: `2px solid ${color}`,
          }} />
        </>;
      
      case 'diamond':
        return <div style={{
          ...backdropStyle,
          width: 65,
          height: 65,
          backgroundColor: color,
          transform: 'translate(-50%, -50%) rotate(45deg)',
          opacity: 0.7,
        }} />;
      
      case 'flame':
        return (
          <img
            src={flame}
            alt="fire backdrop"
            style={{
              ...backdropStyle,
              width: 70,
              height: 70,
              transform: 'translate(-50%, calc(-50% - 18px))',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={EditProfileStyle.overlay}>
      <div style={EditProfileStyle.modal}>
        <div style={EditProfileStyle.header}>
          <h2 style={EditProfileStyle.title}>Edit Profile</h2>
          <button style={EditProfileStyle.closeButton} onClick={handleCancel}>×</button>
        </div>

        {/* Save Message Banner */}
        {saveMessage.text && (
          <div style={{
            padding: '1rem',
            backgroundColor: saveMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            color: saveMessage.type === 'success' ? '#155724' : '#721c24',
            borderBottom: `1px solid ${saveMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            textAlign: 'center',
            fontWeight: 500,
          }}>
            {saveMessage.text}
          </div>
        )}

        {/* Tabs */}
        <div style={EditProfileStyle.tabs}>
          <button
            style={{
              ...EditProfileStyle.tab,
              ...(activeTab === 'personal' ? EditProfileStyle.activeTab : {}),
            }}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button
            style={{
              ...EditProfileStyle.tab,
              ...(activeTab === 'customization' ? EditProfileStyle.activeTab : {}),
            }}
            onClick={() => setActiveTab('customization')}
          >
            Customization
          </button>
        </div>

        <div style={EditProfileStyle.content}>
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div style={EditProfileStyle.section}>
              <div style={EditProfileStyle.formGrid}>
                <div style={EditProfileStyle.formGroup}>
                  <label style={EditProfileStyle.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    maxLength={45}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={EditProfileStyle.input}
                  />
                  {errors.firstName && <span style={EditProfileStyle.error}>{errors.firstName}</span>}
                </div>

                <div style={EditProfileStyle.formGroup}>
                  <label style={EditProfileStyle.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    maxLength={45}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={EditProfileStyle.input}
                  />
                  {errors.lastName && <span style={EditProfileStyle.error}>{errors.lastName}</span>}
                </div>

                <div style={EditProfileStyle.formGroup}>
                  <label style={EditProfileStyle.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    maxLength={45}
                    value={formData.email}
                    onChange={handleInputChange}
                    style={EditProfileStyle.input}
                  />
                  {errors.email && <span style={EditProfileStyle.error}>{errors.email}</span>}
                </div>

                <div style={EditProfileStyle.formGroup}>
                  <label style={EditProfileStyle.label}>Username</label>
                  <input
                    type="text"
                    name="username"
                    maxLength={45}
                    value={formData.username}
                    onChange={handleInputChange}
                    style={EditProfileStyle.input}
                  />
                  {errors.username && <span style={EditProfileStyle.error}>{errors.username}</span>}
                </div>

                <div style={EditProfileStyle.formGroup}>
                  <label style={EditProfileStyle.label}>New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    maxLength={45}
                    value={formData.password}
                    onChange={handleInputChange}
                    style={EditProfileStyle.input}
                    placeholder="Leave blank to keep current"
                  />
                  {errors.password && <span style={EditProfileStyle.error}>{errors.password}</span>}
                </div>

                <div style={EditProfileStyle.formGroup}>
                  <label style={EditProfileStyle.label}>Confirm New Password</label>
                  <input
                    type="password"
                    maxLength={45}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    style={EditProfileStyle.input}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <span style={EditProfileStyle.error}>{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Customization Tab */}
          {activeTab === 'customization' && (
            <div style={EditProfileStyle.section}>
              {/* Icons Section */}
              <div style={EditProfileStyle.customizationSection}>
                <h3 style={EditProfileStyle.sectionTitle}>Profile Icons</h3>
                <div style={EditProfileStyle.itemGrid}>
                  {getOwnedIcons().map(icon => (
                    <div
                      key={icon.id}
                      style={{
                        ...EditProfileStyle.itemCard,
                        ...(selectedIcon === icon.id ? EditProfileStyle.selectedItem : {}),
                      }}
                      onClick={() => setSelectedIcon(icon.id)}
                    >
                      <img src={icon.image} alt={icon.name} style={EditProfileStyle.iconImage} />
                      <p style={EditProfileStyle.itemName}>{icon.name}</p>
                      {selectedIcon === icon.id && <div style={EditProfileStyle.checkmark}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Banners Section */}
              <div style={EditProfileStyle.customizationSection}>
                <h3 style={EditProfileStyle.sectionTitle}>Profile Banners</h3>
                <div style={EditProfileStyle.itemGrid}>
                  {getOwnedBanners().map(banner => (
                    <div
                      key={banner.id}
                      style={{
                        ...EditProfileStyle.itemCard,
                        ...(selectedBanner === banner.id ? EditProfileStyle.selectedItem : {}),
                      }}
                      onClick={() => setSelectedBanner(banner.id)}
                    >
                      <div style={{ ...EditProfileStyle.bannerPreview, backgroundColor: banner.color }} />
                      <p style={EditProfileStyle.itemName}>{banner.name}</p>
                      {selectedBanner === banner.id && <div style={EditProfileStyle.checkmark}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Backdrops Section */}
              <div style={EditProfileStyle.customizationSection}>
                <h3 style={EditProfileStyle.sectionTitle}>Profile Backdrops</h3>
                <div style={EditProfileStyle.itemGrid}>
                  {/* None option - always available */}
                  <div
                    style={{
                      ...EditProfileStyle.itemCard,
                      ...(selectedBackdrop === null ? EditProfileStyle.selectedItem : {}),
                    }}
                    onClick={() => setSelectedBackdrop(null)}
                  >
                    <div style={EditProfileStyle.backdropPreviewContainer}>
                      <img 
                        src={getUserIcon(selectedIcon)} 
                        alt="User icon without backdrop" 
                        style={EditProfileStyle.backdropIconPreview}
                      />
                    </div>
                    <p style={EditProfileStyle.itemName}>None</p>
                    {selectedBackdrop === null && <div style={EditProfileStyle.checkmark}>✓</div>}
                  </div>
                  
                  {getOwnedBackdrops().length === 0 ? (
                    <p style={EditProfileStyle.noItems}>No backdrops owned. Visit the store to purchase!</p>
                  ) : (
                    getOwnedBackdrops().map(backdrop => (
                      <div
                        key={backdrop.id}
                        style={{
                          ...EditProfileStyle.itemCard,
                          ...(selectedBackdrop === backdrop.id ? EditProfileStyle.selectedItem : {}),
                        }}
                        onClick={() => setSelectedBackdrop(backdrop.id)}
                      >
                        <div style={EditProfileStyle.backdropPreviewContainer}>
                          {renderBackdrop(backdrop.type, backdrop.color)}
                          <img 
                            src={getUserIcon(selectedIcon)} 
                            alt="User icon with backdrop" 
                            style={EditProfileStyle.backdropIconPreview}
                          />
                        </div>
                        <p style={EditProfileStyle.itemName}>{backdrop.name}</p>
                        {selectedBackdrop === backdrop.id && <div style={EditProfileStyle.checkmark}>✓</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div style={EditProfileStyle.footer}>
          <button style={EditProfileStyle.cancelButton} onClick={handleCancel} disabled={isSaving}>
            Cancel
          </button>
          <button 
            style={{
              ...EditProfileStyle.saveButton,
              ...(isSaving ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
