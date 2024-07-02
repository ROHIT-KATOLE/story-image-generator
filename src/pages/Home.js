import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';
// import videoBg from '../assets/Gura Yuri Camp.mp4'; // Your video file path
import backgroundGif from '../assets/preview.gif';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const HomeWrapper = styled.div`
  position: relative; /* Ensure positioning context for absolutely positioned children */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  padding-top: 80px;
  min-height: 100vh; /* Minimum viewport height */
  color: #ffffff;
  overflow: hidden; /* Hide overflow to prevent scroll bars */
  animation: ${fadeIn} 1.5s ease-in-out;

  @media (max-width: 768px) {
    padding: 10px;
    padding-top: 80px;
  }
`;

const Title = styled.h2`
  font-size: 3em;
  margin-bottom: 20px;
  animation: ${fadeIn} 2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const Description = styled.p`
  font-size: 1.2em;
  max-width: 600px;
  line-height: 1.5;
  animation: ${fadeIn} 2.5s ease-in-out;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const VideoBackground = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  filter: blur(5px);
  animation: ${fadeIn} 1.5s ease-in-out;
`;

// const VideoBackground = styled.video`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   min-width: 100%;
//   min-height: 100%;
//   width: auto;
//   height: auto;
//   z-index: -1;
// `;

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeWrapper>
      <VideoBackground src={backgroundGif} alt="Background GIF" />
      {/* <VideoBackground autoPlay loop muted>
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground> */}
      <Title>Welcome to the Interactive Story Generator!</Title>
      <Description>
        Create your own stories and see them come to life with AI-generated images. Whether you're a gamer or a creative writer, our tool provides a fun and engaging way to bring your ideas to life.
      </Description>
      <AnimatedButton onClick={() => navigate('/auth')}>Create Your Story</AnimatedButton>
    </HomeWrapper>
  );
};

export default Home;
