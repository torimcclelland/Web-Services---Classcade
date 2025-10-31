import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import TopNavBar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import Sidebar from '../components/Sidebar';
import Logo from '../assets/Logo.png';
import icon1 from '../assets/icon1.png'
import icon2 from '../assets/icon2.png'
import icon3 from '../assets/icon3.png'
import icon4 from '../assets/icon4.png'
import icon5 from '../assets/icon5.png'
import icon6 from '../assets/icon6.png'
import icon7 from '../assets/icon7.png'
import icon8 from '../assets/icon8.png'
import icon9 from '../assets/icon9.png'
import icon10 from '../assets/icon10.png'
import icon11 from '../assets/icon11.png'
import icon12 from '../assets/icon12.png'
import icon13 from '../assets/icon13.png'
import icon14 from '../assets/icon14.png'
import icon15 from '../assets/icon15.png'
import iconBlank from '../assets/iconBlank.png'
import star from '../assets/star.png'
import flame from '../assets/fire.png'

const storeStyles = {
  container: {
    backgroundColor: '#DDF9EA',
    minHeight: '100vh',
  },
  layout: {
    display: 'flex',
  },
  main: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#DDF9EA',
    position: 'relative',
  },
  profileIcon: {
    position: 'absolute',
    top: 20,
    right: 40,
    zIndex: 10,
  },
  content: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 80
  },
  left: {
    flex: '1 1 500px',
    minWidth: '300px',
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: '0px 16px',
    color: '#fff',
    minHeight: '400px',
  },
  rightColumn: {
    flex: '1 1 500px', // grow/shrink with 500px min, wraps on small screens
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  rightBox: {
    flex: 1,
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: '0px 16px',
    color: '#fff',
    minHeight: '192px',
  },
  iconsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 16,
    padding: '16px 0',
  },
  iconCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s, outline 0.2s',
    border: 'none',
  },
  iconCardSelected: {
    outline: '3px solid #fff',
    outlineOffset: '4px',
    transform: 'scale(1.02)',
  },
  iconImage: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: 8,
  },
  iconPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000000ff',
    marginTop: 4,
  },
  purchaseSection: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    zIndex: 9999,
  },
  selectedInfo: {
    fontSize: 16,
    fontWeight: 500,
    color: '#333',
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: 10000,
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
  },
  bannersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '16px 0',
  },
  bannerCard: {
    height: 35,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    cursor: 'pointer',
    transition: 'transform 0.2s, outline 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
    border: 'none',
  },
  bannerCardSelected: {
    outline: '3px solid #fff',
    outlineOffset: '4px',
    transform: 'scale(1.02)',
  },
  bannerPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '4px 12px',
    borderRadius: 4,
  },
  backdropsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 16,
    padding: '16px 0',
  },
  backdropCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, outline 0.2s',
    border: 'none',
  },
  backdropCardSelected: {
    outline: '3px solid #fff',
    outlineOffset: '4px',
    transform: 'scale(1.02)',
  },
  backdropContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  backdropImage: {
    width: 50,
    height: 50,
    objectFit: 'contain',
    position: 'relative',
    zIndex: 2,
  },
  backdropPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000000ff',
    marginTop: 4,
  },
};

const Store = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedBackdrop, setSelectedBackdrop] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [availableIcons, setAvailableIcons] = useState([
    { id: 'i1', name: 'Man 1', price: .99, image: icon1 },
    { id: 'i2', name: 'Woman 1', price: .99, image: icon2 },
    { id: 'i3', name: 'Woman 2', price: .99, image: icon3 },
    { id: 'i4', name: 'Girl 1', price: .99, image: icon4 },
    { id: 'i5', name: 'Boy 1', price: .99, image: icon5 },
    { id: 'i6', name: 'Man 2', price: .99, image: icon6 },
    { id: 'i7', name: 'Woman 3', price: .99, image: icon7 },
    { id: 'i8', name: 'Girl 2', price: 1.99, image: icon8 },
    { id: 'i9', name: 'Woman 4', price: 1.99, image: icon9 },
    { id: 'i10', name: 'Rabbit', price: 1.99, image: icon10 },
    { id: 'i11', name: 'Wolf', price: 1.99, image: icon11 },
    { id: 'i12', name: 'Cat', price: 1.99, image: icon12 },
    { id: 'i13', name: 'Unicorn', price: 2.99, image: icon13 },
    { id: 'i14', name: 'Panda', price: 2.99, image: icon14 },
    { id: 'i15', name: 'T-Rex', price: 3.99, image: icon15 },
  ]);
  const [availableBanners, setAvailableBanners] = useState([
    { id: 'b1', name: 'Red Banner', price: 1.99, color: '#FF5252' },
    { id: 'b2', name: 'Blue Banner', price: 1.99, color: '#8dccffff' },
    { id: 'b3', name: 'Green Banner', price: 1.99, color: '#43ca47ff' },
    { id: 'b4', name: 'Purple Banner', price: 2.49, color: '#9C27B0' },
    { id: 'b5', name: 'Orange Banner', price: 2.49, color: '#FF9800' },
  ]);
  const [availableBackdrops, setAvailableBackdrops] = useState([
    { id: 'd1', name: 'Circle Ring', price: 1.49, type: 'circle', color: '#FF6B6B' },
    { id: 'd2', name: 'Diamond', price: 1.49, type: 'diamond', color: '#A855F7' },
    { id: 'd3', name: 'Hexagon', price: 1.49, type: 'hexagon', color: '#6BCB77' },
    { id: 'd4', name: 'Double Ring', price: 1.49, type: 'doublering', color: '#4D96FF' },
    { id: 'd5', name: 'Star Burst', price: 2.49, type: 'star', color: '#FFD93D' },
    { id: 'd6', name: 'Flame', price: 2.99, type: 'flame', color: '#EC4899' },
  ]);

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

  const confirmPurchase = () => {
    if (selectedIcon) {
      // Remove purchased icon from available icons
      setAvailableIcons(prevIcons => prevIcons.filter(icon => icon.id !== selectedIcon.id));
      
      setPopupMessage(`Successfully purchased ${selectedIcon.name} for ${selectedIcon.price} dollars!`);
      setShowConfirmPopup(false);
      setShowSuccessPopup(true);
      setSelectedIcon(null);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    } else if (selectedBanner) {
      // Remove purchased banner from available banners
      setAvailableBanners(prevBanners => prevBanners.filter(banner => banner.id !== selectedBanner.id));
      
      setPopupMessage(`Successfully purchased ${selectedBanner.name} for ${selectedBanner.price} dollars!`);
      setShowConfirmPopup(false);
      setShowSuccessPopup(true);
      setSelectedBanner(null);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    } else if (selectedBackdrop) {
      // Remove purchased backdrop from available backdrops
      setAvailableBackdrops(prevBackdrops => prevBackdrops.filter(backdrop => backdrop.id !== selectedBackdrop.id));
      
      setPopupMessage(`Successfully purchased ${selectedBackdrop.name} for ${selectedBackdrop.price} dollars!`);
      setShowConfirmPopup(false);
      setShowSuccessPopup(true);
      setSelectedBackdrop(null);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    }
  };

  const cancelPurchase = () => {
    setShowConfirmPopup(false);
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