// src/components/Header.js
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

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0);
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const Logo = styled.h1`
  font-family: 'Pacifico', cursive;
  font-size: 1.5em;
  color: #ffcc00;
  margin: 0;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  a {
    margin: 0 15px;
    color: white;
    text-decoration: none;
    position: relative;
    transition: color 0.3s;

    &:hover {
      color: #ffcc00;
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ffcc00;
      transition: width 0.3s;
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const ProfileMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const Dropdown = styled.div`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  position: absolute;
  right: 0;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-in-out;

  a, button {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    background: none;
    border: none;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: #555;
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
  };

  return (
    <HeaderWrapper>
      <Logo onClick={() => navigate('/')}>Tell Your Story</Logo>
      <Nav>
        <Link to="/"><FaHome /> Home</Link>
        <Link to="/dashboard"><FaGamepad /> Dashboard</Link>
        <Link to="/editor"><FaEdit /> Editor</Link>
        {currentUser && (
          <ProfileMenu>
            <FaUserCircle size={30} onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }} />
            <Dropdown $show={showDropdown}>
              <Link to="/settings">Settings</Link>
              <button onClick={handleLogout}>Logout</button>
            </Dropdown>
          </ProfileMenu>
        )}
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
