import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { updateEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const SettingsWrapper = styled.div`
  padding: 20px;
  color: #ffffff;
  background-color: #2c2c2c;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 2.5em;
    margin-bottom: 20px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;

    input {
      margin-bottom: 10px;
      padding: 10px;
      font-size: 1em;
      border-radius: 4px;
      border: 1px solid #555;
      background-color: #444;
      color: #fff;

      &:focus {
        outline: none;
        border-color: #007bff;
      }
    }

    button {
      padding: 10px 20px;
      font-size: 1em;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;

      &:hover {
        background-color: #0056b3;
      }
    }
  }

  .message {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.1em;
  }

  .error {
    color: #ff4d4f;
  }

  .success {
    color: #52c41a;
  }
`;

const Settings = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.displayName || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email || '');
          setUsername(userData.username || '');
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    try {
      if (email !== currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }
      if (username !== currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: username });
      }
      await updateDoc(doc(db, 'users', currentUser.uid), { email, username });
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <SettingsWrapper>
      <h2>Settings</h2>
      {message && <p className={`message ${messageType}`}>{message}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit">Update</button>
      </form>
    </SettingsWrapper>
  );
};

export default Settings;
