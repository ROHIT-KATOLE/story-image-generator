// src/pages/StoriesPage.js - Updated with dark theme, caching, and performance optimization
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { fetchAllStories } from '../firebase';
import StoryCard from '../components/StoryCard';
import StoryBookModal from '../components/StoryBookModal';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaSearch, FaFilter, FaSort } from 'react-icons/fa';

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

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
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
    font-size: 2.8em;
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
    color: #aaa;
    font-size: 1.2em;
    margin: 0;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SearchBar = styled.div`
  position: relative;
  min-width: 300px;

  input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    color: #fff;
    font-size: 1em;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ffcc00;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 5px 15px rgba(255, 204, 0, 0.2);
    }

    &::placeholder {
      color: #666;
    }
  }

  svg {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #ffcc00, #ff9800)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #ff9800, #f57c00)' 
      : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  animation: ${fadeIn} 1.2s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const StatItem = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 15px 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  text-align: center;

  .number {
    font-size: 1.8em;
    font-weight: bold;
    color: #ffcc00;
    margin-bottom: 5px;
  }

  .label {
    font-size: 0.9em;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const StoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  animation: ${fadeIn} 1.4s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const LoadingCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  height: 300px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }

  .placeholder {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 15px;

    &.title {
      height: 24px;
      width: 70%;
    }

    &.content {
      height: 16px;
      width: 100%;
      margin-bottom: 10px;
    }

    &.image {
      height: 150px;
      width: 100%;
      margin-bottom: 15px;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  grid-column: 1 / -1;

  .icon {
    font-size: 4em;
    margin-bottom: 20px;
    color: #444;
  }

  h3 {
    font-size: 1.5em;
    color: #888;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.1em;
    line-height: 1.6;
  }
`;

// Cache for stories with TTL (Time To Live)
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let storiesCache = {
  data: null,
  timestamp: null,
  userId: null
};

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Cached fetch function
  const fetchStoriesWithCache = useCallback(async (userId) => {
    const now = Date.now();

    // Check if cache is valid
    if (storiesCache.data &&
        storiesCache.userId === userId &&
        storiesCache.timestamp &&
        (now - storiesCache.timestamp) < CACHE_TTL) {
      return storiesCache.data;
    }

    try {
      const userStories = await fetchAllStories(userId);

      // Update cache
      storiesCache = {
        data: userStories,
        timestamp: now,
        userId: userId
      };

      return userStories;
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw error;
    }
  }, []);

  // Load stories with caching
  useEffect(() => {
    if (currentUser) {
      const loadStories = async () => {
        try {
          setLoading(true);
          setError(null);
          const userStories = await fetchStoriesWithCache(currentUser.uid);
          setStories(userStories);
        } catch (error) {
          console.error("Error fetching stories:", error);
          setError("Failed to load stories. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      loadStories();
    }
  }, [currentUser, fetchStoriesWithCache]);

  // Filter and sort stories
  const processedStories = useMemo(() => {
    let filtered = stories;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.story && story.story.some(entry =>
          entry.content.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'length':
          return (b.story?.length || 0) - (a.story?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [stories, searchTerm, sortBy]);

  useEffect(() => {
    setFilteredStories(processedStories);
  }, [processedStories]);

  const openModal = useCallback((story) => {
    setSelectedStory(story);
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedStory(null);
    setModalIsOpen(false);
  }, []);

  const stats = useMemo(() => ({
    total: stories.length,
    totalWords: stories.reduce((sum, story) => {
      if (story.story && Array.isArray(story.story)) {
        return sum + story.story.reduce((storySum, entry) => {
          return storySum + (entry.content ? entry.content.split(' ').length : 0);
        }, 0);
      }
      return sum;
    }, 0),
    totalImages: stories.reduce((sum, story) => sum + (story.images?.length || 0), 0)
  }), [stories]);

  if (error) {
    return (
      <StoriesWrapper>
        <Header>
          <h1>
            <FaBook />
            My Stories
          </h1>
          <p style={{ color: '#ff6b6b' }}>{error}</p>
        </Header>
      </StoriesWrapper>
    );
  }

  return (
    <StoriesWrapper>
      <Header>
        <h1>
          <FaBook />
          My Stories
        </h1>
        <p>Your creative journey awaits</p>
      </Header>

      {!loading && stories.length > 0 && (
        <>
          <StatsBar>
            <StatItem>
              <div className="number">{stats.total}</div>
              <div className="label">Stories</div>
            </StatItem>
            <StatItem>
              <div className="number">{stats.totalWords.toLocaleString()}</div>
              <div className="label">Words</div>
            </StatItem>
            <StatItem>
              <div className="number">{stats.totalImages}</div>
              <div className="label">Images</div>
            </StatItem>
          </StatsBar>

          <Controls>
            <SearchBar>
              <input
                type="text"
                placeholder="Search your stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch />
            </SearchBar>

            <FilterButton
              active={sortBy === 'newest'}
              onClick={() => setSortBy('newest')}
            >
              <FaSort />
              Newest First
            </FilterButton>

            <FilterButton
              active={sortBy === 'oldest'}
              onClick={() => setSortBy('oldest')}
            >
              <FaSort />
              Oldest First
            </FilterButton>

            <FilterButton
              active={sortBy === 'alphabetical'}
              onClick={() => setSortBy('alphabetical')}
            >
              <FaFilter />
              A-Z
            </FilterButton>

            <FilterButton
              active={sortBy === 'length'}
              onClick={() => setSortBy('length')}
            >
              <FaFilter />
              By Length
            </FilterButton>
          </Controls>
        </>
      )}

      <StoriesGrid>
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index}>
              <div className="placeholder image" />
              <div className="placeholder title" />
              <div className="placeholder content" />
              <div className="placeholder content" />
              <div className="placeholder content" style={{ width: '60%' }} />
            </LoadingCard>
          ))
        ) : filteredStories.length > 0 ? (
          filteredStories.map((story, index) => (
            <div
              key={story.id}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: `${fadeIn} 0.6s ease-out both`
              }}
            >
              <StoryCard story={story} onClick={() => openModal(story)} />
            </div>
          ))
        ) : (
          <EmptyState>
            <div className="icon">
              <FaBook />
            </div>
            {searchTerm ? (
              <>
                <h3>No stories found</h3>
                <p>No stories match your search "{searchTerm}". Try different keywords.</p>
              </>
            ) : (
              <>
                <h3>No stories yet</h3>
                <p>Start creating your first interactive story in the Editor!</p>
              </>
            )}
          </EmptyState>
        )}
      </StoriesGrid>

      {selectedStory && modalIsOpen && (
        <StoryBookModal story={selectedStory} onClose={closeModal} />
      )}
    </StoriesWrapper>
  );
};

export default StoriesPage;