// src/components/StoryBookModal.js
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import StoryBook from './StoryBook';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '90%',
    padding: '0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 3em;
  cursor: pointer;
  color: black;
`;

const StoryBookModal = ({ story, onClose }) => {
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Story Book Modal"
    >
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <StoryBook story={story} />
    </Modal>
  );
};

export default StoryBookModal;
