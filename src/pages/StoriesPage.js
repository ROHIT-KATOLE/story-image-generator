// src/pages/StoriesPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAllStories } from '../firebase';
import StoryCard from '../components/StoryCard';
import StoryBookModal from '../components/StoryBookModal';
import { useAuth } from '../contexts/AuthContext';

const StoriesContainer = styled.div`
  padding: 20px;
  color: #ffffff;
  background-color: #282c34;
  min-height: 100vh;
`;

const StoryCardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const fetchStories = async () => {
        try {
          const userStories = await fetchAllStories(currentUser.uid);
          setStories(userStories);
        } catch (error) {
          console.error("Error fetching stories:", error);
        }
      };

      fetchStories();
    }
  }, [currentUser]);

  const openModal = (story) => {
    setSelectedStory(story);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedStory(null);
    setModalIsOpen(false);
  };

  return (
    <StoriesContainer>
      <h1>User Stories</h1>
      <StoryCardsWrapper>
        {stories.map(story => (
          <StoryCard key={story.id} story={story} onClick={() => openModal(story)} />
        ))}
      </StoryCardsWrapper>
      {selectedStory && modalIsOpen && (
        <StoryBookModal story={selectedStory} onClose={closeModal} />
      )}
    </StoriesContainer>
  );
};

export default StoriesPage;
