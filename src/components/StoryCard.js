// src/components/StoryCard.js
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: 200px;
  cursor: pointer;
  text-align: center;
  background-color: #444;
  color: #fff;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
`;

const StoryTitle = styled.h2`
  font-size: 1.2em;
`;

const StoryCard = ({ story, onClick }) => (
  <Card onClick={onClick}>
    {story.images && story.images.length > 0 && (
      <Thumbnail
        srcSet={`
          ${story.images[0]} 480w
        `}
        sizes="(max-width: 600px) 480px, 800px"
        src={story.images[0]}
        alt={`Story ${story.id} thumbnail`}
      />
    )}
    <StoryTitle>{story.title}</StoryTitle>
  </Card>
);

export default StoryCard;
