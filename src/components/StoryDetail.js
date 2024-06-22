// src/components/StoryDetail.js
import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333; /* Change color to make it visible */
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333; /* Change color to make it visible */
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333; /* Change color to make it visible */
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const StoryDetail = ({ story, onClose }) => {
  const { title, content, images } = story;
  const contentArray = content.split('\n');

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{title}</Title>
        <Content>
          {contentArray.map((line, index) => (
            <React.Fragment key={index}>
              <p>{line}</p>
              {images[index] && <Image src={images[index]} alt={`Story image ${index + 1}`} />}
            </React.Fragment>
          ))}
        </Content>
      </Modal>
    </Overlay>
  );
};

export default StoryDetail;

