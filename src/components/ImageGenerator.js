// src/components/ImageGenerator.js
import React from 'react';
import styled from 'styled-components';

const ImageGeneratorWrapper = styled.div`
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #1a1a1a;
  border: 2px dashed #444;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1.2em;
`;

const ImageGenerator = () => {
  return (
    <ImageGeneratorWrapper>
      <Placeholder>Image will be generated here...</Placeholder>
    </ImageGeneratorWrapper>
  );
};

export default ImageGenerator;

