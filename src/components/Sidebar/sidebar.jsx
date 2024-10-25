import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlane, FaCog, FaMap } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="container">
      <div className="sidebarContainer">
        <div className="logoContainer">
          <h1 className="logoText">RoaMify</h1>
        </div>

        <div className="navContainer">
          <Link to="/" className="navItem">
            <div className="dot" />
            <FaHome className="icon" />
            <span>Home</span>
          </Link>
          <Link to="/trips" className="navItem">
            <div className="dot" />
            <FaMap className="icon" />
            <span>Trip</span>
          </Link>
        </div>

        <div className="bottomContainer">
          <hr className="horizontalLine" />
          <Link to="/settings" className="navItem settingsItem">
            <div className="dot" />
            <FaCog className="icon" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      <div className="profileImageContainer">
        <img src="/profile1.jpeg" alt="Profile" className="profileImage" />
      </div>
    </div>
  );
};

export default Sidebar;
