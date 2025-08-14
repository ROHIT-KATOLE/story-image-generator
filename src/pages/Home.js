import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaBookOpen, FaImages, FaStar, FaArrowRight } from 'react-icons/fa';

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

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
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
    transform: translateY(-20px);
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

const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Main wrapper with animated background
const HomeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #ffffff;
  overflow-x: hidden;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  cursor: none;

  &::before {
    content: '';
    position: fixed;
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

// Hero section
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 100px 20px 50px;
  position: relative;
  z-index: 1;
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

const FloatingIcon = styled.div`
  position: absolute;
  font-size: 2em;
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

const Title = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9800 50%, #ff6b35 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 1s ease-out, ${gradientShift} 4s ease-in-out infinite;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(255, 204, 0, 0.3);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 204, 0, 0.1) 50%, transparent 100%);
    animation: ${sparkle} 3s ease-in-out infinite;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 3vw, 1.4rem);
  max-width: 700px;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 40px;
  animation: ${fadeInUp} 1.2s ease-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
`;

const CTAButton = styled.button`
  padding: 16px 32px;
  font-size: 1.2em;
  font-weight: 600;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
  border: none;
  border-radius: 50px;
  color: #000;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1.4s ease-out;
  box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;

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
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 35px rgba(255, 204, 0, 0.4);
    animation: ${pulse} 2s infinite;

    &::before {
      left: 100%;
    }
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

// Features section
const FeaturesSection = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #ffcc00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2em;
  color: #aaa;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ffcc00, #ff9800);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    border-color: rgba(255, 204, 0, 0.3);
    box-shadow: 0 20px 50px rgba(255, 204, 0, 0.2);

    &::before {
      left: 0;
    }
  }

  .icon {
    font-size: 3em;
    color: #ffcc00;
    margin-bottom: 20px;
    display: block;
    transition: all 0.3s ease;
  }

  &:hover .icon {
    transform: scale(1.1) rotate(10deg);
    color: #ff9800;
  }

  h3 {
    font-size: 1.5em;
    margin-bottom: 15px;
    color: #fff;
  }

  p {
    font-size: 1em;
    line-height: 1.6;
    color: #ccc;
  }
`;

// Stats section
const StatsSection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(26, 26, 46, 0.5));
  backdrop-filter: blur(10px);
  margin: 50px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  .number {
    font-size: 3em;
    font-weight: bold;
    background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
  }

  .label {
    font-size: 1.1em;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add to trail
      const newTrail = [...trailRef.current, { x: e.clientX, y: e.clientY, id: Date.now() }];
      if (newTrail.length > 20) {
        newTrail.shift();
      }
      trailRef.current = newTrail;
      setTrail([...newTrail]);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners for hoverable elements
    const hoverElements = document.querySelectorAll('button, a, .hoverable');
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

  // Animated counter effect
  const [stats, setStats] = useState({
    stories: 0,
    images: 0,
    users: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const targets = { stories: 1000, images: 5000, users: 250, satisfaction: 98 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(targets).forEach(key => {
      let current = 0;
      const increment = targets[key] / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targets[key]) {
          current = targets[key];
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, stepDuration);
    });
  }, []);

  return (
    <HomeWrapper>
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

      {/* Hero Section */}
      <HeroSection>
        <FloatingElements>
          <FloatingIcon delay="0s"><FaBookOpen /></FloatingIcon>
          <FloatingIcon delay="1s"><FaImages /></FloatingIcon>
          <FloatingIcon delay="2s"><FaStar /></FloatingIcon>
          <FloatingIcon delay="0.5s"><FaRocket /></FloatingIcon>
          <FloatingIcon delay="1.5s"><FaBookOpen /></FloatingIcon>
          <FloatingIcon delay="2.5s"><FaStar /></FloatingIcon>
        </FloatingElements>

        <Title>Create Magical Stories</Title>
        <Subtitle>
          Unleash your creativity with AI-powered storytelling and stunning visuals.
          Write interactive narratives, generate breathtaking images, and bring your
          imagination to life in ways you never thought possible.
        </Subtitle>
        <CTAButton onClick={() => navigate('/auth')} className="hoverable">
          Start Your Journey
          <FaArrowRight />
        </CTAButton>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          <StatCard delay="0.2s">
            <div className="number">{stats.stories}+</div>
            <div className="label">Stories Created</div>
          </StatCard>
          <StatCard delay="0.4s">
            <div className="number">{stats.images}+</div>
            <div className="label">Images Generated</div>
          </StatCard>
          <StatCard delay="0.6s">
            <div className="number">{stats.users}+</div>
            <div className="label">Happy Users</div>
          </StatCard>
          <StatCard delay="0.8s">
            <div className="number">{stats.satisfaction}%</div>
            <div className="label">Satisfaction</div>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>Powerful Features</SectionTitle>
        <SectionSubtitle>
          Everything you need to create compelling stories and stunning visuals
        </SectionSubtitle>

        <FeaturesGrid>
          <FeatureCard delay="0.2s">
            <FaBookOpen className="icon" />
            <h3>Interactive Storytelling</h3>
            <p>
              Create dynamic narratives with AI assistance. Make choices that
              shape your story and experience truly interactive fiction.
            </p>
          </FeatureCard>

          <FeatureCard delay="0.4s">
            <FaImages className="icon" />
            <h3>AI-Generated Images</h3>
            <p>
              Transform your words into stunning visuals with advanced AI image
              generation. Every scene comes to life with beautiful artwork.
            </p>
          </FeatureCard>

          <FeatureCard delay="0.6s">
            <FaRocket className="icon" />
            <h3>Easy to Use</h3>
            <p>
              Intuitive interface designed for creators of all levels. Start
              writing immediately with powerful tools at your fingertips.
            </p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </HomeWrapper>
  );
};

export default Home;