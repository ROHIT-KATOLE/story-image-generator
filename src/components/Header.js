// src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaGamepad, FaEdit, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  a {
    margin: 0 10px;
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
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
  background-color: white;
  color: black;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  z-index: 1;

  a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;

    &:hover {
      background-color: #ddd;
    }
  }

  button {
    background: none;
    border: none;
    color: black;
    width: 100%;
    padding: 12px 16px;
    text-align: left;

    &:hover {
      background-color: #ddd;
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
      <h1>Tell Your Story</h1>
      <Nav>
        <Link to="/"><FaHome /> Home</Link>
        <Link to="/dashboard"><FaGamepad /> Dashboard</Link>
        <Link to="/editor"><FaEdit /> Editor</Link>
        {currentUser && (
          <ProfileMenu>
            <FaUserCircle size={30} onClick={() => setShowDropdown(!showDropdown)} />
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
