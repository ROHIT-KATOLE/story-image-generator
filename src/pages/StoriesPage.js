// src/pages/StoriesPage.js - Updated with modern theme and caching
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { fetchAllStories } from '../firebase';
import StoryCard from '../components/StoryCard';
import StoryBookModal from '../components/StoryBookModal';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaSearch, FaSortAmountDown } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StoriesWrapper = styled.div`
  padding: 20px;
  padding-top: 90px;
  color: #ffffff;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.8s ease-out;

  h1 {
    font-size: 3em;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  p {
    font-size: 1.2em;
    color: #aaa;
    margin-bottom: 30px;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    color: #fff;
    font-size: 1em;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
    box-sizing: border-box;

    &::placeholder {
      color: #888;
    }

    &:focus {
      outline: none;
      border-color: rgba(255, 204, 0, 0.5);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
      transform: translateY(-2px);
    }
  }

  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #ffcc00;
    font-size: 1.1em;
    pointer-events: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  select {
    padding: 10px 15px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    backdrop-filter: blur(20px);
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: rgba(255, 204, 0, 0.5);
    }

    option {
      background: #1a1a2e;
      color: #fff;
    }
  }

  .filter-icon {
    color: #ffcc00;
    font-size: 1.2em;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  animation: ${fadeIn} 1.2s ease-out;

  .stat {
    text-align: center;
    color: #aaa;
    font-size: 0.9em;

    .number {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      color: #ffcc00;
      margin-bottom: 5px;
    }
  }
`;

const StoriesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  animation: ${fadeIn} 1.4s ease-out;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  animation: ${fadeIn} 1s ease-out;

  .icon {
    font-size: 4em;
    margin-bottom: 20px;
    color: #444;
  }

  h3 {
    font-size: 1.5em;
    margin-bottom: 10px;
    color: #888;
  }

  p {
    font-size: 1.1em;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto 20px;
  }

  button {
    padding: 12px 24px;
    background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 152, 0, 0.1));
    border: 1px solid rgba(255, 204, 0, 0.3);
    border-radius: 8px;
    color: #ffcc00;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: linear-gradient(135deg, rgba(255, 204, 0, 0.3), rgba(255, 152, 0, 0.2));
      color: #fff;
      transform: translateY(-2px);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #aaa;

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-left-color: #ffcc00;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  p {
    font-size: 1.1em;
  }
`;

// Cache with expiration for stories
const STORIES_CACHE_DURATION = 3 * 60 * 1000; // 3 minutes
const storiesCache = {
  data: null,
  timestamp: null,
  isValid() {
    return this.data && this.timestamp && (Date.now() - this.timestamp < STORIES_CACHE_DURATION);
  },
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  get() {
    return this.isValid() ? this.data : null;
  },
  clear() {
    this.data = null;
    this.timestamp = null;
  }
};

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { currentUser } = useAuth();

  // Fetch stories with caching
  const fetchStories = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Check cache first
      const cachedStories = storiesCache.get();
      if (cachedStories) {
        setStories(cachedStories);
        setFilteredStories(cachedStories);
        setLoading(false);
        return;
      }

      // Fetch from Firebase
      const userStories = await fetchAllStories(currentUser.uid);

      // Cache the data
      storiesCache.set(userStories);

      setStories(userStories);
      setFilteredStories(userStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Filter and sort stories
  useEffect(() => {
    let filtered = [...stories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.story && story.story.some(entry =>
          entry.content.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'length':
        filtered.sort((a, b) => {
          const aLength = a.story ? a.story.length : 0;
          const bLength = b.story ? b.story.length : 0;
          return bLength - aLength;
        });
        break;
      default:
        break;
    }

    setFilteredStories(filtered);
  }, [stories, searchTerm, sortBy]);

  const openModal = useCallback((story) => {
    setSelectedStory(story);
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedStory(null);
    setModalIsOpen(false);
  }, []);

  // Memoized stats calculation
  const stats = useMemo(() => {
    const totalWords = stories.reduce((total, story) => {
      if (story.story && Array.isArray(story.story)) {
        return total + story.story.reduce((storyTotal, entry) => {
          return storyTotal + (entry.content ? entry.content.split(' ').length : 0);
        }, 0);
      }
      return total;
    }, 0);

    const totalImages = stories.reduce((total, story) => {
      return total + (story.images ? story.images.length : 0);
    }, 0);

    return {
      totalStories: stories.length,
      totalWords,
      totalImages
    };
  }, [stories]);

  if (loading) {
    return (
      <StoriesWrapper>
        <LoadingContainer>
          <div className="spinner" />
          <p>Loading your stories...</p>
        </LoadingContainer>
      </StoriesWrapper>
    );
  }

  return (
    <StoriesWrapper>
      <Header>
        <h1>
          <FaBook />
          My Story Collection
        </h1>
        <p>Explore your creative journey through words and images</p>
      </Header>

      {stories.length > 0 && (
        <>
          <StatsBar>
            <div className="stat">
              <span className="number">{stats.totalStories}</span>
              Stories
            </div>
            <div className="stat">
              <span className="number">{stats.totalWords.toLocaleString()}</span>
              Words
            </div>
            <div className="stat">
              <span className="number">{stats.totalImages}</span>
              Images
            </div>
          </StatsBar>

          <ControlsContainer>
            <SearchContainer>
              <input
                type="text"
                placeholder="Search your stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </SearchContainer>

            <FilterContainer>
              <FaSortAmountDown className="filter-icon" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
                <option value="length">By Length</option>
              </select>
            </FilterContainer>
          </ControlsContainer>
        </>
      )}

      {filteredStories.length > 0 ? (
        <StoriesGrid>
          {filteredStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => openModal(story)}
            />
          ))}
        </StoriesGrid>
      ) : stories.length > 0 ? (
        <EmptyState>
          <FaSearch className="icon" />
          <h3>No stories match your search</h3>
          <p>Try adjusting your search terms or browse all your stories.</p>
          <button onClick={() => setSearchTerm('')}>Clear Search</button>
        </EmptyState>
      ) : (
        <EmptyState>
          <FaBook className="icon" />
          <h3>No stories yet</h3>
          <p>Start your creative journey by writing your first interactive story with AI assistance.</p>
          <button onClick={() => window.location.href = '/editor'}>Create Your First Story</button>
        </EmptyState>
      )}

      {selectedStory && modalIsOpen && (
        <StoryBookModal story={selectedStory} onClose={closeModal} />
      )}
    </StoriesWrapper>
  );
};

export default StoriesPage;