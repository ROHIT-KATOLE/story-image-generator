import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #61dafb;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1f1;
  }
`;

const AnimatedButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default AnimatedButton;
