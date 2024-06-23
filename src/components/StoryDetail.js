// src/components/StoryDetail.js
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

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

const StoryDetail = ({ story, isOpen, onClose }) => {
  const { title, content, images } = story;
  const contentArray = content.split('\n');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          position: 'relative',
          margin: 'auto',
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          overflowY: 'auto',
        }
      }}
      contentLabel="Story Detail Modal"
    >
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
  );
};

export default StoryDetail;