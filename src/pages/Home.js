import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import AnimatedButton from '../components/AnimatedButton';
import homeImage from '../assets/5.png';
import image1 from '../assets/10.png';
import image2 from '../assets/11.png';
import image3 from '../assets/12.png';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: url(${homeImage}) no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  color: #ffffff;
  animation: ${fadeIn} 1.5s ease-in-out;

  @media (max-width: 768px) {
    padding: 10px;
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

const CarouselWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeWrapper>
      <Title>Welcome to the Interactive Story Generator!</Title>
      <Description>
        Create your own stories and see them come to life with AI-generated images. Whether you're a gamer or a creative writer, our tool provides a fun and engaging way to bring your ideas to life.
      </Description>
      <AnimatedButton onClick={() => navigate('/auth')}>Create Your Story</AnimatedButton>
    </HomeWrapper>
  );
};

export default Home;
