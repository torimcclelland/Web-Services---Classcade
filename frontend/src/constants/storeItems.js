import iconBlank from '../assets/iconBlank.png';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon6 from '../assets/icon6.png';
import icon7 from '../assets/icon7.png';
import icon8 from '../assets/icon8.png';
import icon9 from '../assets/icon9.png';
import icon10 from '../assets/icon10.png';
import icon11 from '../assets/icon11.png';
import icon12 from '../assets/icon12.png';
import icon13 from '../assets/icon13.png';
import icon14 from '../assets/icon14.png';
import icon15 from '../assets/icon15.png';

// Default icon (always available to all users)
export const DEFAULT_ICON = { id: 'default', name: 'Default', price: 0, image: iconBlank };

export const ALL_ICONS = [
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
];

export const ALL_BANNERS = [
  { id: 'b1', name: 'Red Banner', price: 1.99, color: '#FF5252' },
  { id: 'b2', name: 'Blue Banner', price: 1.99, color: '#8dccffff' },
  { id: 'b3', name: 'Green Banner', price: 1.99, color: '#43ca47ff' },
  { id: 'b4', name: 'Purple Banner', price: 2.49, color: '#9C27B0' },
  { id: 'b5', name: 'Orange Banner', price: 2.49, color: '#FF9800' },
];

export const ALL_BACKDROPS = [
  { id: 'd1', name: 'Circle Ring', price: 1.49, type: 'circle', color: '#FF6B6B' },
  { id: 'd2', name: 'Diamond', price: 1.49, type: 'diamond', color: '#A855F7' },
  { id: 'd3', name: 'Hexagon', price: 1.49, type: 'hexagon', color: '#6BCB77' },
  { id: 'd4', name: 'Double Ring', price: 1.49, type: 'doublering', color: '#4D96FF' },
  { id: 'd5', name: 'Star Burst', price: 2.49, type: 'star', color: '#FFD93D' },
  { id: 'd6', name: 'Flame', price: 2.99, type: 'flame', color: '#EC4899' },
];

/**
 * Helper function to get the icon image URL for a user
 * @param {string|null} selectedIconId - The ID of the selected icon from user data
 * @returns {string} The image URL/path for the icon
 */
export const getUserIcon = (selectedIconId) => {
  if (!selectedIconId || selectedIconId === 'default') {
    return DEFAULT_ICON.image;
  }
  
  const icon = ALL_ICONS.find(i => i.id === selectedIconId);
  return icon ? icon.image : DEFAULT_ICON.image;
};
