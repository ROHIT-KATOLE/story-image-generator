// src/pages/Settings.js - Updated with dark theme and animations
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { updateEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaSave, FaCog } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const SettingsWrapper = styled.div`
  padding: 20px;
  padding-top: 90px;
  color: #ffffff;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h2 {
    font-size: 2.5em;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  p {
    color: #aaa;
    font-size: 1.1em;
    margin: 0;
  }
`;

const FormCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffcc00, #ff9800);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1em;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8px;

    svg {
      color: #ffcc00;
      font-size: 1.2em;
    }
  }

  input {
    width: 100%;
    padding: 15px 20px;
    font-size: 1em;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #ffcc00;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 204, 0, 0.2);
    }

    &::placeholder {
      color: #666;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: 600;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;

  &:hover {
    background: linear-gradient(135deg, #45a049, #3d8b40);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    font-size: 1.2em;
  }
`;

const Message = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 500;
  animation: ${pulse} 0.6s ease-in-out;
  backdrop-filter: blur(10px);

  &.error {
    background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(218, 25, 11, 0.1));
    border: 1px solid rgba(244, 67, 54, 0.3);
    color: #ff6b6b;
  }

  &.success {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.1));
    border: 1px solid rgba(76, 175, 80, 0.3);
    color: #4CAF50;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-left-color: #fff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Settings = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.displayName || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setEmail(userData.email || currentUser.email || '');
            setUsername(userData.username || currentUser.displayName || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!email.trim() || !username.trim()) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');
    
    try {
      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }
      
      // Update display name if changed
      if (username !== currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: username });
      }
      
      // Update Firestore document
      await updateDoc(doc(db, 'users', currentUser.uid), { 
        email, 
        username,
        updatedAt: new Date()
      });
      
      setMessage('Profile updated successfully!');
      setMessageType('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.message || 'Failed to update profile. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsWrapper>
      <Container>
        <Header>
          <h2>
            <FaCog />
            Account Settings
          </h2>
          <p>Manage your account information and preferences</p>
        </Header>

        <FormCard>
          {message && <Message className={messageType}>{message}</Message>}
          
          <Form onSubmit={handleUpdate}>
            <InputGroup delay="0.1s">
              <label htmlFor="username">
                <FaUser />
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </InputGroup>

            <InputGroup delay="0.2s">
              <label htmlFor="email">
                <FaEnvelope />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : <FaSave />}
              {loading ? 'Updating...' : 'Save Changes'}
            </SubmitButton>
          </Form>
        </FormCard>
      </Container>
    </SettingsWrapper>
  );
};

export default Settings;