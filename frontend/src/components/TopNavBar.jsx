import React from 'react';
import '../styles/TopNavBarStyle';

const TopNavBar = () => {
  return (
    <div className="top-navbar">
       <input
       type="text"
        className="search-bar"
         placeholder="Search..."
         defaultValue=""
       />      
       <button className="compose-btn">
       </button>
       <select className="group-dropdown">
         <option>Group 3</option>
       </select>
       <button className="settings-btn">
      </button>
     </div>
   );
 };

 export default TopNavBar;
