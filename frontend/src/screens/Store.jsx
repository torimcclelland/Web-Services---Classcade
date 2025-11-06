import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import TopNavBar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { ALL_ICONS, ALL_BANNERS, ALL_BACKDROPS } from '../constants/storeItems';
import Logo from '../assets/Logo.png';
import icon15 from '../assets/icon15.png'
import iconBlank from '../assets/iconBlank.png'
import star from '../assets/star.png'
import flame from '../assets/fire.png'
import storeStyles from '../styles/StoreStyle'

const Store = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedBackdrop, setSelectedBackdrop] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [availableIcons, setAvailableIcons] = useState([]);
  const [availableBanners, setAvailableBanners] = useState([]);
  const [availableBackdrops, setAvailableBackdrops] = useState([]);

  // Fetch user's owned items and filter available items
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData._id) {
          // show all items by default
          setAvailableIcons(ALL_ICONS);
          setAvailableBanners(ALL_BANNERS);
          setAvailableBackdrops(ALL_BACKDROPS);
          return;
        }

        // Fetch user data
        const response = await api.get(`/api/user/${userData._id}`);
        const user = response.data;

        // Filter out owned items
        const ownedIconIds = user.ownedIcons || [];
        const ownedBannerIds = user.ownedBanners || [];
        const ownedBackdropIds = user.ownedBackdrops || [];

        setAvailableIcons(ALL_ICONS.filter(icon => !ownedIconIds.includes(icon.id)));
        setAvailableBanners(ALL_BANNERS.filter(banner => !ownedBannerIds.includes(banner.id)));
        setAvailableBackdrops(ALL_BACKDROPS.filter(backdrop => !ownedBackdropIds.includes(backdrop.id)));

      } catch (error) {
        console.error('Error fetching user items:', error);
        // On error, show all items
        setAvailableIcons(ALL_ICONS);
        setAvailableBanners(ALL_BANNERS);
        setAvailableBackdrops(ALL_BACKDROPS);
      }
    };

    fetchUserItems();
  }, []);

  // Render backdrop based on type
  const renderBackdrop = (type, color) => {
    const backdropStyle = {
      position: 'absolute',
      zIndex: 1,
    };

    switch(type) {
      case 'circle':
        return <div style={{
          ...backdropStyle,
          width: 60,
          height: 60,
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
              width: 90,
              height: 95,
              top: 0,
              left: -5,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        );
      
      case 'hexagon':
        return <div style={{
          ...backdropStyle,
          width: 70,
          height: 60,
          backgroundColor: color,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          opacity: 0.8,
        }} />;
      
      case 'doublering':
        return <>
          <div style={{
            ...backdropStyle,
            width: 70,
            height: 70,
            borderRadius: '50%',
            border: `3px solid ${color}`,
          }} />
          <div style={{
            ...backdropStyle,
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: `2px solid ${color}`,
          }} />
        </>;
      
      case 'diamond':
        return <div style={{
          ...backdropStyle,
          width: 55,
          height: 55,
          backgroundColor: color,
          transform: 'rotate(45deg)',
          opacity: 0.7,
        }} />;
      
      case 'flame':
        return (
          <img
            src={flame}
            alt="fire backdrop"
            style={{
              ...backdropStyle,
              width: 60,
              height: 60,
              top: -6,
              left: 8,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  const handleIconClick = (icon) => {
    // Toggle selection: if clicking on already selected icon, unselect it
    if (selectedIcon?.id === icon.id) {
      setSelectedIcon(null);
    } else {
      setSelectedIcon(icon);
      setSelectedBanner(null); // Unselect banner when selecting icon
      setSelectedBackdrop(null); // Unselect backdrop when selecting icon
    }
  };

  const handleBannerClick = (banner) => {
    // Toggle selection: if clicking on already selected banner, unselect it
    if (selectedBanner?.id === banner.id) {
      setSelectedBanner(null);
    } else {
      setSelectedBanner(banner);
      setSelectedIcon(null); // Unselect icon when selecting banner
      setSelectedBackdrop(null); // Unselect backdrop when selecting banner
    }
  };

  const handleBackdropClick = (backdrop) => {
    // Toggle selection: if clicking on already selected backdrop, unselect it
    if (selectedBackdrop?.id === backdrop.id) {
      setSelectedBackdrop(null);
    } else {
      setSelectedBackdrop(backdrop);
      setSelectedIcon(null); // Unselect icon when selecting backdrop
      setSelectedBanner(null); // Unselect banner when selecting backdrop
    }
  };

  const handlePurchase = () => {
    if (selectedIcon || selectedBanner || selectedBackdrop) {
      setShowConfirmPopup(true);
    }
  };

  const cancelPurchase = () => {
    setShowConfirmPopup(false);
  };

  const confirmPurchase = async () => {
    try {
      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData._id) {
        setPopupMessage('Please log in to make a purchase');
        setShowConfirmPopup(false);
        setShowSuccessPopup(true);
        return;
      }

      let itemType, itemId, itemName, itemPrice;

      if (selectedIcon) {
        itemType = 'icon';
        itemId = selectedIcon.id;
        itemName = selectedIcon.name;
        itemPrice = selectedIcon.price;
      } else if (selectedBanner) {
        itemType = 'banner';
        itemId = selectedBanner.id;
        itemName = selectedBanner.name;
        itemPrice = selectedBanner.price;
      } else if (selectedBackdrop) {
        itemType = 'backdrop';
        itemId = selectedBackdrop.id;
        itemName = selectedBackdrop.name;
        itemPrice = selectedBackdrop.price;
      }

      // Make API call to save purchase
      await api.post(`/api/user/${userData._id}/purchase`, {
        itemType,
        itemId
      });

      // Update local state to remove purchased item
      if (selectedIcon) {
        setAvailableIcons(prevIcons => prevIcons.filter(icon => icon.id !== selectedIcon.id));
        setSelectedIcon(null);
      } else if (selectedBanner) {
        setAvailableBanners(prevBanners => prevBanners.filter(banner => banner.id !== selectedBanner.id));
        setSelectedBanner(null);
      } else if (selectedBackdrop) {
        setAvailableBackdrops(prevBackdrops => prevBackdrops.filter(backdrop => backdrop.id !== selectedBackdrop.id));
        setSelectedBackdrop(null);
      }

      setPopupMessage(`Successfully purchased ${itemName} for ${itemPrice} dollars!`);
      setShowConfirmPopup(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);

    } catch (error) {
      console.error('Purchase error:', error);
      setPopupMessage(error.response?.data?.error || 'Purchase failed. Please try again.');
      setShowConfirmPopup(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    }
  };

  return (
    <div style={storeStyles.container}>
      <TopNavBar />
      
      <div style={storeStyles.layout}>
        <Sidebar />
        <div style={storeStyles.main}>
          <div style={storeStyles.profileIcon}>
            <ProfileCircle avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" size={64} />
          </div>

      <div style={storeStyles.content}>
        <div style={storeStyles.left}>
          <h1>Icons</h1>
          {availableIcons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fff' }}>
              <h2>No icons available</h2>
              <p>Check back later for new icons!</p>
            </div>
          ) : (
            <div style={storeStyles.iconsGrid}>
              {availableIcons.map((icon) => (
                <div
                  key={icon.id}
                  style={{
                    ...storeStyles.iconCard,
                    ...(selectedIcon?.id === icon.id ? storeStyles.iconCardSelected : {})
                  }}
                  onClick={() => handleIconClick(icon)}
                >
                  <img src={icon.image} alt={icon.name} style={storeStyles.iconImage} />
                  <div style={storeStyles.iconPrice}>{icon.price} dollars</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={storeStyles.rightColumn}>
            <div style={storeStyles.rightBox}>
            <h1>Banners</h1>
            {availableBanners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fff' }}>
                <h2>No banners available</h2>
                <p>Check back later for new banners!</p>
              </div>
            ) : (
              <div style={storeStyles.bannersContainer}>
                {availableBanners.map((banner) => (
                  <div
                    key={banner.id}
                    style={{
                      ...storeStyles.bannerCard,
                      backgroundColor: banner.color,
                      ...(selectedBanner?.id === banner.id ? storeStyles.bannerCardSelected : {})
                    }}
                    onClick={() => handleBannerClick(banner)}
                  >
                    <div style={storeStyles.bannerPrice}>{banner.price} dollars</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={storeStyles.rightBox}>
            <h1>Backdrops</h1>
            {availableBackdrops.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fff' }}>
                <h2>No backdrops available</h2>
                <p>Check back later for new backdrops!</p>
              </div>
            ) : (
              <div style={storeStyles.backdropsGrid}>
                {availableBackdrops.map((backdrop) => (
                  <div
                    key={backdrop.id}
                    style={{
                      ...storeStyles.backdropCard,
                      ...(selectedBackdrop?.id === backdrop.id ? storeStyles.backdropCardSelected : {})
                    }}
                    onClick={() => handleBackdropClick(backdrop)}
                  >
                    <div style={storeStyles.backdropContainer}>
                      {renderBackdrop(backdrop.type, backdrop.color)}
                      <img src={icon15} alt="icon" style={storeStyles.backdropImage} />
                    </div>
                    <div style={storeStyles.backdropPrice}>{backdrop.price} dollars</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {(selectedIcon || selectedBanner || selectedBackdrop) && (
        <div style={storeStyles.purchaseSection}>
          <span style={storeStyles.selectedInfo}>
            Selected: {selectedIcon ? selectedIcon.name : selectedBanner ? selectedBanner.name : selectedBackdrop.name} - {selectedIcon ? selectedIcon.price : selectedBanner ? selectedBanner.price : selectedBackdrop.price} dollars
          </span>
          <PrimaryButton text="Purchase" onClick={handlePurchase} />
        </div>
      )}

      {showConfirmPopup && (
        <>
          <div style={storeStyles.overlay} onClick={cancelPurchase} />
          <div style={storeStyles.popup}>
            <h2 style={{ color: '#333', marginBottom: 16 }}>Confirm Purchase</h2>
            <p style={{ color: '#333', marginBottom: 20 }}>
              Are you sure you want to purchase {selectedIcon ? selectedIcon.name : selectedBanner ? selectedBanner.name : selectedBackdrop?.name} for {selectedIcon ? selectedIcon.price : selectedBanner ? selectedBanner.price : selectedBackdrop?.price} dollars?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <PrimaryButton text="Cancel" onClick={cancelPurchase} />
              <PrimaryButton text="Confirm" onClick={confirmPurchase} />
            </div>
          </div>
        </>
      )}

      {showSuccessPopup && (
        <>
          <div style={storeStyles.overlay} onClick={() => setShowSuccessPopup(false)} />
          <div style={storeStyles.popup}>
            <h2 style={{ color: '#1e3a8a', marginBottom: 8 }}>Success!</h2>
            <p style={{ color: '#333' }}>{popupMessage}</p>
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
};

export default Store;