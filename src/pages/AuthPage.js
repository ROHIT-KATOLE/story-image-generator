// src/pages/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signInWithGoogle, registerWithEmailAndPassword, loginWithEmailAndPassword } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #282c34;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #444;
  color: #fff;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #0056b3;
  }
`;

const GoogleButton = styled.button`
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #db4437;
  color: #fff;
  cursor: pointer;
  width: auto;
  max-width: 300px;
  box-sizing: border-box;

  &:hover {
    background-color: #c23321;
  }
`;

const ToggleButton = styled.button`
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #6c757d;
  color: #fff;
  cursor: pointer;
  width: auto;
  max-width: 300px;
  box-sizing: border-box;

  &:hover {
    background-color: #5a6268;
  }
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        const user = await loginWithEmailAndPassword(form.email, form.password);
        console.log('Logged in successfully:', user);
      } else {
        const user = await registerWithEmailAndPassword(form.email, form.password, form.username);
        console.log('Registered successfully:', user);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('Signed in with Google:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
    }
  };

  if (currentUser) {
    navigate('/dashboard');
  }

  return (
    <AuthWrapper>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required={!isLogin}
          />
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
      </Form>
      <ToggleButton onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </ToggleButton>
      <GoogleButton onClick={handleGoogleSignIn}>
        Sign In with Google
      </GoogleButton>
    </AuthWrapper>
  );
};

export default AuthPage;
