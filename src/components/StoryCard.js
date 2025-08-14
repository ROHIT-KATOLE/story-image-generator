// src/components/StoryCard.js - Improved design with hexagon/book-like shape
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBook, FaImages, FaClock, FaEye, FaBookOpen } from 'react-icons/fa';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 204, 0, 0.1); }
  50% { box-shadow: 0 0 30px rgba(255, 204, 0, 0.3); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const BookCard = styled.div`
  width: 320px;
  height: 420px;
  margin: 15px;
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  
  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(5deg);
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const BookSpine = styled.div`
  position: absolute;
  left: -8px;
  top: 0;
  width: 16px;
  height: 100%;
  background: linear-gradient(180deg, #2c2c2c, #1a1a1a);
  border-radius: 8px 0 0 8px;
  z-index: -1;
  transform: rotateY(-10deg);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
`;

const BookCover = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(40, 40, 60, 0.95));
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  position: relative;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffcc00, #ff9800, #ffcc00);
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s ease;
    z-index: 3;
  }

  &:hover::after {
    left: 100%;
  }
`;

const CoverImage = styled.div`
  height: 240px;
  background: ${props => props.$hasImage 
    ? `url(${props.$image})` 
    : 'linear-gradient(135deg, #1a1a2e, #16213e)'};
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .placeholder-icon {
    font-size: 4em;
    color: rgba(255, 204, 0, 0.3);
    filter: drop-shadow(0 0 20px rgba(255, 204, 0, 0.5));
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 0, 0, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .view-icon {
    font-size: 3em;
    color: white;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8));
  }

  ${BookCard}:hover & .overlay {
    opacity: 1;
  }
`;

const BookInfo = styled.div`
  padding: 20px;
  height: calc(100% - 240px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const StoryTitle = styled.h3`
  font-size: 1.3em;
  font-weight: bold;
  color: #fff;
  margin: 0 0 12px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: color 0.3s ease;

  ${BookCard}:hover & {
    color: #ffcc00;
  }
`;

const StoryPreview = styled.p`
  color: #ccc;
  font-size: 0.9em;
  line-height: 1.5;
  margin: 0 0 15px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #888;
  font-size: 0.85em;
  font-weight: 500;

  svg {
    color: #ffcc00;
    font-size: 1.1em;
    filter: drop-shadow(0 0 3px rgba(255, 204, 0, 0.5));
  }
`;

const BookMark = styled.div`
  position: absolute;
  top: -2px;
  right: 20px;
  width: 30px;
  height: 50px;
  background: linear-gradient(135deg, #ffcc00, #ff9800);
  clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 60%, 0 80%);
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${BookCard}:hover & {
    opacity: 1;
  }
`;

const DateBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffcc00;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 204, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;

  svg {
    font-size: 0.9em;
  }
`;

const TagsContainer = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  z-index: 2;
`;

const Tag = styled.span`
  background: rgba(255, 204, 0, 0.2);
  color: #ffcc00;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7em;
  font-weight: 500;
  border: 1px solid rgba(255, 204, 0, 0.3);
  backdrop-filter: blur(5px);
`;

const StoryCard = ({ story, onClick }) => {
  const getStoryPreview = (story) => {
    if (story.story && story.story.length > 0) {
      return story.story[0].content.substring(0, 120) + '...';
    }
    return 'A mysterious tale waiting to be discovered...';
  };

  const getWordCount = (story) => {
    if (story.story && Array.isArray(story.story)) {
      return story.story.reduce((total, entry) => {
        return total + (entry.content ? entry.content.split(' ').length : 0);
      }, 0);
    }
    return 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const wordCount = getWordCount(story);
  const imageCount = story.images ? story.images.length : 0;
  const entryCount = story.story ? story.story.length : 0;
  const hasImage = story.images && story.images.length > 0;

  return (
    <BookCard onClick={onClick}>
      <BookSpine />
      <BookMark />

      <BookCover>
        <CoverImage $hasImage={hasImage} $image={hasImage ? story.images[0] : null}>
          <DateBadge>
            <FaClock />
            {formatDate(story.createdAt)}
          </DateBadge>

          {!hasImage && (
            <FaBookOpen className="placeholder-icon" />
          )}

          <div className="overlay">
            <FaEye className="view-icon" />
          </div>

          {(wordCount > 500 || imageCount > 2) && (
            <TagsContainer>
              {imageCount > 2 && <Tag>Illustrated</Tag>}
              {wordCount > 500 && <Tag>Epic</Tag>}
              {entryCount > 10 && <Tag>Interactive</Tag>}
            </TagsContainer>
          )}
        </CoverImage>

        <BookInfo>
          <div>
            <StoryTitle>{story.title || 'Untitled Story'}</StoryTitle>
            <StoryPreview>{getStoryPreview(story)}</StoryPreview>
          </div>

          <BookStats>
            <StatGroup>
              <StatItem>
                <FaBook />
                <span>{entryCount}</span>
              </StatItem>
              <StatItem>
                <FaImages />
                <span>{imageCount}</span>
              </StatItem>
            </StatGroup>
          </BookStats>
        </BookInfo>
      </BookCover>
    </BookCard>
  );
};

export default StoryCard;