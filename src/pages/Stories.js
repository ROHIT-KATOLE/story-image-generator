// src/Pages/Stories.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { fetchStory } from '../firebase';

const StoriesWrapper = styled.div`
  padding: 20px;
  color: #ffffff;

  h2 {
    font-size: 2.5em;
    margin-bottom: 20px;
  }

  .story-list {
    list-style: none;
    padding: 0;

    li {
      padding: 10px;
      margin: 10px 0;
      background-color: #333;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #555;
      }
    }
  }
`;

const Stories = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);

    useEffect(() => {
      const getStories = async () => {
        if (currentUser) {
          const userStories = await fetchStory(currentUser.uid);
          setStories(userStories);
        }
      };

    getStories();
  }, [currentUser]);

  return (
    <StoriesWrapper>
      <h2>Your Stories</h2>
      <ul className="story-list">
        {stories.map((story) => (
          <li key={story.id}>
            <h3>{story.title}</h3>
            <p>{story.content.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </StoriesWrapper>
  );
};

export default Stories;
