// src/components/Header.js - Updated with consistent theme and removed Stories from nav
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaHome, FaGamepad, FaEdit, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0%, 100% { text-shadow: 0 0 5px #ffcc00, 0 0 10px #ffcc00, 0 0 15px #ffcc00; }
  50% { text-shadow: 0 0 10px #ffcc00, 0 0 20px #ffcc00, 0 0 30px #ffcc00; }
`;

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%);
  color: white;
  position: fixed;
  width: 100vw;
  left: 0;
  top: 0;
  z-index: 2000;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 60px;
  box-sizing: border-box;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Logo = styled.h1`
  font-family: 'Pacifico', cursive;
  font-size: 1.8em;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    transform: scale(1.05);
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  a {
    margin: 0 8px;
    color: white;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.95em;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      color: #ffcc00;
      background: rgba(255, 204, 0, 0.15);
      border: 1px solid rgba(255, 204, 0, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 204, 0, 0.2);
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, #ffcc00, #ff9800);
      transition: width 0.3s ease;
      border-radius: 1px;
    }

    &:hover::after {
      width: 80%;
    }

    svg {
      font-size: 1.1em;
    }
  }
`;

const ProfileMenu = styled.div`
  position: relative;
  display: inline-block;

  .profile-icon {
    padding: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: linear-gradient(135deg, rgba(255, 204, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%);
      border: 2px solid rgba(255, 204, 0, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 204, 0, 0.2);
    }
  }
`;

const Dropdown = styled.div`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  min-width: 180px;
  z-index: 2001;
  border-radius: 12px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(0, 0, 0, 0.95);
  }

  a, button {
    color: white;
    padding: 14px 18px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    transition: all 0.2s ease;
    font-size: 0.95em;
    font-weight: 500;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      color: #ffcc00;
    }

    svg {
      font-size: 1.1em;
    }
  }
`;

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
    setShowDropdown(false);
  };

  return (
    <HeaderWrapper>
      <Logo onClick={() => navigate('/')}>✨ Tell Your Story</Logo>
      <Nav>
        <Link to="/">
          <FaHome /> Home
        </Link>
        <Link to="/dashboard">
          <FaGamepad /> Dashboard
        </Link>
        <Link to="/editor">
          <FaEdit /> Editor
        </Link>
        {currentUser && (
          <ProfileMenu onMouseLeave={() => setShowDropdown(false)}>
            <div
              className="profile-icon"
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
            >
              <FaUserCircle size={24} />
            </div>
            <Dropdown $show={showDropdown}>
              <Link to="/stories">
                <i className="fas fa-book"></i> My Stories
              </Link>
              <Link to="/settings">
                <FaUserCircle /> Settings
              </Link>
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </Dropdown>
          </ProfileMenu>
        )}
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;