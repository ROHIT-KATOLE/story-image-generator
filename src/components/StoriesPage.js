// src/components/StoryEditor.js
import React from 'react';
import styled from 'styled-components';

const StoryEditorWrapper = styled.div`
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 1.2em;
`;

const StoryEditor = () => {
  return (
    <StoryEditorWrapper>
      <TextArea placeholder="Write your story here..."></TextArea>
    </StoryEditorWrapper>
  );
};

export default StoryEditor;
