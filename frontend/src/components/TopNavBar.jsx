import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarStyle from '../styles/TopNavBarStyle';
import {
  FaHome,
} from 'react-icons/fa';

const TopNavBar = () => {
  const groupTabs = ['sweng300', 'compsci', 'group3'];

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  const goToAddNewProject = () => {
    navigate('/addnewproject');
  };

  return (
    <div style={TopNavBarStyle.topNavbar}>
      <button style={TopNavBarStyle.homeBtn} onClick={goToHome}>
        <FaHome size={24} />
      </button>

      <div style={TopNavBarStyle.groupTabs}>
        {groupTabs.map((group, index) => (
          <div key={index} style={TopNavBarStyle.groupTab}>
            <span>{group}</span>
            <button style={TopNavBarStyle.closeTabBtn}>✕</button>
          </div>
        ))}
        <button style={TopNavBarStyle.addTabBtn} onClick={goToAddNewProject}>＋</button>
      </div>

      <button style={TopNavBarStyle.exitBtn}>✕</button>
    </div>
  );
};

export default TopNavBar;
