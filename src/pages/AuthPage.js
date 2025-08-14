import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { signInWithGoogle, registerWithEmailAndPassword, loginWithEmailAndPassword } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaStar, FaBookOpen, FaImages, FaRocket } from 'react-icons/fa';

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Main wrapper
const AuthWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  position: relative;
  overflow: hidden;
  padding: 20px;
  cursor: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 204, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 768px) {
    cursor: auto;
    padding: 10px;
  }
`;

// Custom cursor
const CustomCursor = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  background: rgba(255, 204, 0, 0.8);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: all 0.1s ease;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.5);

  &.hover {
    transform: scale(2);
    background: rgba(255, 204, 0, 0.3);
    border: 2px solid rgba(255, 204, 0, 0.8);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Mouse trail
const TrailDot = styled.div`
  position: fixed;
  width: 4px;
  height: 4px;
  background: rgba(255, 204, 0, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Floating elements
const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const FloatingIcon = styled.div`
  position: absolute;
  font-size: 1.5em;
  color: rgba(255, 204, 0, 0.1);
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};

  &:nth-child(1) { top: 10%; left: 10%; animation-duration: 8s; }
  &:nth-child(2) { top: 20%; right: 15%; animation-duration: 6s; }
  &:nth-child(3) { bottom: 30%; left: 20%; animation-duration: 7s; }
  &:nth-child(4) { bottom: 20%; right: 10%; animation-duration: 9s; }
  &:nth-child(5) { top: 60%; left: 5%; animation-duration: 5s; }
  &:nth-child(6) { top: 40%; right: 8%; animation-duration: 7s; }
`;

// Auth container
const AuthContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.8s ease-out;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffcc00, #ff9800, #ff6b35);
    border-radius: 20px 20px 0 0;
    background-size: 200% 100%;
    animation: ${gradientShift} 3s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    padding: 30px 20px;
    margin: 0 10px;
  }
`;

const AuthTitle = styled.h1`
  font-size: 2.5em;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #ffcc00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${slideInLeft} 0.8s ease-out;
  position: relative;
`;

const AuthSubtitle = styled.p`
  text-align: center;
  color: #aaa;
  margin-bottom: 30px;
  font-size: 1.1em;
  animation: ${slideInRight} 1s ease-out;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeInUp} 1.2s ease-out;
`;

const InputGroup = styled.div`
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffcc00;
  z-index: 2;
  transition: all 0.3s ease;
  font-size: 1.1em;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 50px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1em;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ffcc00;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(255, 204, 0, 0.3);
    transform: translateY(-2px);
  }

  &:focus + ${InputIcon} {
    color: #ff9800;
    transform: translateY(-50%) scale(1.1);
  }

  &::placeholder {
    color: #666;
    transition: all 0.3s ease;
  }

  &:focus::placeholder {
    color: #888;
  }
`;

const PasswordInputGroup = styled(InputGroup)`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  font-size: 1.1em;

  &:hover {
    color: #ffcc00;
    transform: translateY(-50%) scale(1.1);
  }
`;

const Button = styled.button`
  padding: 15px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: ${fadeInUp} 1s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
  box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 35px rgba(255, 204, 0, 0.4);
    animation: ${pulse} 2s infinite;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;

    &:hover {
      animation: none;
      transform: none;
      box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3);
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-left-color: #000;
  animation: ${spin} 1s linear infinite;
  margin-right: 10px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #db4437 0%, #c23321 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1.2s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
  box-shadow: 0 8px 25px rgba(219, 68, 55, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 35px rgba(219, 68, 55, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    font-size: 1.2em;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ffcc00;
  cursor: pointer;
  font-size: 1em;
  text-decoration: underline;
  transition: all 0.3s ease;
  margin-top: 20px;
  padding: 10px;
  animation: ${fadeInUp} 1.4s ease-out;
  animation-delay: 0.8s;
  animation-fill-mode: both;

  &:hover {
    color: #ff9800;
    transform: scale(1.05);
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;
  animation: ${fadeInUp} 1.1s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }

  span {
    margin: 0 15px;
    color: #aaa;
    font-size: 0.9em;
    white-space: nowrap;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(218, 25, 11, 0.1));
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: #ff6b6b;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 0.3s ease-out;
  text-align: center;
  font-weight: 500;
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailRef = React.useRef([]);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Mouse effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const newTrail = [...trailRef.current, { x: e.clientX, y: e.clientY, id: Date.now() }];
      if (newTrail.length > 15) {
        newTrail.shift();
      }
      trailRef.current = newTrail;
      setTrail([...newTrail]);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const hoverElements = document.querySelectorAll('button, input, .hoverable');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      console.log('Signed in with Google:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: '', password: '', username: '' });
    setError(null);
  };

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <AuthWrapper>
      {/* Custom Cursor */}
      <CustomCursor
        className={isHovering ? 'hover' : ''}
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      {/* Mouse Trail */}
      {trail.map((dot, index) => (
        <TrailDot
          key={dot.id}
          style={{
            left: dot.x - 2,
            top: dot.y - 2,
            opacity: (index + 1) / trail.length * 0.5,
            transform: `scale(${(index + 1) / trail.length})`,
          }}
        />
      ))}

      {/* Floating Elements */}
      <FloatingElements>
        <FloatingIcon delay="0s"><FaBookOpen /></FloatingIcon>
        <FloatingIcon delay="1s"><FaImages /></FloatingIcon>
        <FloatingIcon delay="2s"><FaStar /></FloatingIcon>
        <FloatingIcon delay="0.5s"><FaRocket /></FloatingIcon>
        <FloatingIcon delay="1.5s"><FaUser /></FloatingIcon>
        <FloatingIcon delay="2.5s"><FaStar /></FloatingIcon>
      </FloatingElements>

      <AuthContainer>
        <AuthTitle>{isLogin ? 'Welcome Back' : 'Join Us'}</AuthTitle>
        <AuthSubtitle>
          {isLogin ? 'Continue your creative journey' : 'Start your storytelling adventure'}
        </AuthSubtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <InputGroup delay="0.2s">
              <Input
                type="text"
                name="username"
                placeholder="Your creative username"
                value={form.username}
                onChange={handleChange}
                required={!isLogin}
                className="hoverable"
              />
              <InputIcon><FaUser /></InputIcon>
            </InputGroup>
          )}

          <InputGroup delay={isLogin ? "0.2s" : "0.3s"}>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="hoverable"
            />
            <InputIcon><FaEnvelope /></InputIcon>
          </InputGroup>

          <PasswordInputGroup delay={isLogin ? "0.3s" : "0.4s"}>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="hoverable"
              style={{ paddingRight: '50px' }}
            />
            <InputIcon><FaLock /></InputIcon>
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hoverable"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </PasswordInputGroup>

          <Button type="submit" disabled={loading} className="hoverable">
            {loading && <LoadingSpinner />}
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignIn} disabled={googleLoading} className="hoverable">
          <FaGoogle />
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </GoogleButton>

        <div style={{ textAlign: 'center' }}>
          <ToggleButton onClick={toggleMode} className="hoverable">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </ToggleButton>
        </div>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default AuthPage;