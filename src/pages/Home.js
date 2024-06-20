import React from 'react';
import styled from 'styled-components';
import AnimatedButton from '../components/AnimatedButton';
import { useNavigate } from 'react-router-dom';
import homeImage from '../assets/cave.png'; // Add an image for visual appeal

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: url(${homeImage}) no-repeat center center;
  background-size: cover;
  min-height: 80vh;
  color: #ffffff;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  font-size: 3em;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2em;
  max-width: 600px;
  line-height: 1.5;
`;

const Home = () => {
  const navigate = useNavigate();
  return (
    <HomeWrapper>
      <Title>Welcome to the Interactive Story Generator!</Title>
      <Description>
        Create your own stories and see them come to life with AI-generated images.
        Whether you're a gamer or a creative writer, our tool provides a fun and engaging way to bring your ideas to life.
      </Description>
      <AnimatedButton onClick={() => navigate('/auth')}>Create Your Story</AnimatedButton>
    </HomeWrapper>
  );
};

export default Home;

