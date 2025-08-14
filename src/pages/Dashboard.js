// src/pages/Dashboard.js - Optimized with caching and removed sections
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBook, FaEdit, FaImages, FaClock, FaTrophy } from 'react-icons/fa';
import { fetchAllStories, fetchStory } from '../firebase';

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

const DashboardWrapper = styled.div`
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

const WelcomeMessage = styled.h1`
  font-size: 2.5em;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} 0.8s ease-out;
`;

const SubMessage = styled.p`
  font-size: 1.2em;
  color: #aaa;
  margin-bottom: 40px;
  animation: ${fadeIn} 1s ease-out;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    border-color: rgba(255, 204, 0, 0.3);
    box-shadow: 0 15px 40px rgba(255, 204, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffcc00, #ff9800);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  h3 {
    margin: 15px 0 15px 0;
    font-size: 1.4em;
    color: #fff;
  }

  p {
    font-size: 1em;
    line-height: 1.6;
    color: #ccc;
    margin-bottom: 20px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  svg {
    margin-right: 15px;
    font-size: 1.8em;
    padding: 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 152, 0, 0.1));
    border: 1px solid rgba(255, 204, 0, 0.3);
  }
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 152, 0, 0.1));
  border: 1px solid rgba(255, 204, 0, 0.3);
  border-radius: 8px;
  color: #ffcc00;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 204, 0, 0.3), rgba(255, 152, 0, 0.2));
    border-color: rgba(255, 204, 0, 0.5);
    color: #fff;
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 204, 0, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  .stat-number {
    font-size: 2.2em;
    font-weight: bold;
    background: linear-gradient(135deg, #ffcc00 0%, #ff9800 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 5px;
    position: relative;
    z-index: 1;
  }

  .stat-label {
    color: #aaa;
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 1;
  }

  .stat-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5em;
    color: rgba(255, 204, 0, 0.3);
  }
`;

const RecentStoriesSection = styled.div`
  margin-bottom: 40px;
  animation: ${fadeIn} 1.2s ease-out;

  h2 {
    font-size: 1.8em;
    margin-bottom: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const RecentStoriesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const StoryPreview = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
    border-color: rgba(255, 204, 0, 0.3);
  }

  .story-title {
    font-size: 1.1em;
    font-weight: bold;
    color: #ffcc00;
    margin-bottom: 10px;
  }

  .story-preview {
    color: #ccc;
    font-size: 0.9em;
    line-height: 1.5;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .story-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8em;
    color: #888;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-left-color: #ffcc00;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Cache with expiration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const dashboardCache = {
  data: null,
  timestamp: null,
  isValid() {
    return this.data && this.timestamp && (Date.now() - this.timestamp < CACHE_DURATION);
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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    storiesCreated: 0,
    imagesGenerated: 0,
    wordsWritten: 0,
    hoursSpent: 0
  });
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized calculation functions
  const calculateStats = useCallback((allStories, currentStory, currentImages) => {
    let totalWords = 0;
    let totalImages = 0;

    // Count from saved stories
    allStories.forEach(story => {
      if (story.story && Array.isArray(story.story)) {
        story.story.forEach(entry => {
          if (entry.content) {
            totalWords += entry.content.split(' ').length;
          }
        });
      }
      if (story.images) {
        totalImages += story.images.length;
      }
    });

    // Count from current story
    if (currentStory && Array.isArray(currentStory)) {
      currentStory.forEach(entry => {
        if (entry.content) {
          totalWords += entry.content.split(' ').length;
        }
      });
    }

    // Count current images
    if (currentImages) {
      totalImages += currentImages.length;
    }

    return {
      storiesCreated: allStories.length,
      imagesGenerated: totalImages,
      wordsWritten: totalWords,
      hoursSpent: Math.floor(totalWords / 200) // Rough estimate
    };
  }, []);

  const getStoryPreview = useCallback((story) => {
    if (story.story && story.story.length > 0) {
      return story.story[0].content.substring(0, 150) + '...';
    }
    return 'No content available';
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Check cache first
        const cachedData = dashboardCache.get();
        if (cachedData) {
          setStats(cachedData.stats);
          setRecentStories(cachedData.recentStories);
          setLoading(false);
          return;
        }

        // Parallel fetch for better performance
        const [allStories, { story: currentStory, images: currentImages }] = await Promise.all([
          fetchAllStories(currentUser.uid),
          fetchStory(currentUser.uid)
        ]);

        // Calculate stats
        const calculatedStats = calculateStats(allStories, currentStory, currentImages);

        // Get recent stories (last 3)
        const recent = allStories.slice(-3).reverse();

        // Cache the data
        dashboardCache.set({
          stats: calculatedStats,
          recentStories: recent
        });

        setStats(calculatedStats);
        setRecentStories(recent);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, calculateStats]);

  // Memoized recent stories list to prevent unnecessary re-renders
  const memoizedRecentStories = useMemo(() =>
    recentStories.map((story, index) => (
      <StoryPreview key={story.id} onClick={() => window.location.href = '/stories'}>
        <div className="story-title">{story.title}</div>
        <div className="story-preview">{getStoryPreview(story)}</div>
        <div className="story-meta">
          <span>{story.story ? story.story.length : 0} entries</span>
          <span>{story.images ? story.images.length : 0} images</span>
        </div>
      </StoryPreview>
    )), [recentStories, getStoryPreview]
  );

  if (loading) {
    return (
      <DashboardWrapper>
        <LoadingSpinner />
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <WelcomeMessage>Welcome back, {currentUser?.displayName || 'Storyteller'}!</WelcomeMessage>
      <SubMessage>Ready to continue your creative journey?</SubMessage>

      <StatsGrid>
        <StatCard delay="0.2s">
          <FaBook className="stat-icon" />
          <div className="stat-number">{stats.storiesCreated}</div>
          <div className="stat-label">Stories Created</div>
        </StatCard>
        <StatCard delay="0.3s">
          <FaImages className="stat-icon" />
          <div className="stat-number">{stats.imagesGenerated}</div>
          <div className="stat-label">Images Generated</div>
        </StatCard>
        <StatCard delay="0.4s">
          <FaEdit className="stat-icon" />
          <div className="stat-number">{stats.wordsWritten.toLocaleString()}</div>
          <div className="stat-label">Words Written</div>
        </StatCard>
        <StatCard delay="0.5s">
          <FaClock className="stat-icon" />
          <div className="stat-number">{stats.hoursSpent}</div>
          <div className="stat-label">Hours Spent</div>
        </StatCard>
      </StatsGrid>

      {recentStories.length > 0 && (
        <RecentStoriesSection>
          <h2><FaTrophy /> Recent Stories</h2>
          <RecentStoriesList>
            {memoizedRecentStories}
          </RecentStoriesList>
        </RecentStoriesSection>
      )}

      <Grid>
        <Card delay="0.6s">
          <CardHeader>
            <FaEdit />
          </CardHeader>
          <h3>Story Editor</h3>
          <p>Start crafting your next interactive adventure with AI-powered storytelling and visual generation.</p>
          <ActionLink to="/editor">
            <FaEdit /> Start Creating
          </ActionLink>
        </Card>

        <Card delay="0.7s">
          <CardHeader>
            <FaBook />
          </CardHeader>
          <h3>My Stories</h3>
          <p>Browse through your collection of {stats.storiesCreated} stories, continue where you left off, or share your favorites.</p>
          <ActionLink to="/stories">
            <FaBook /> View Stories
          </ActionLink>
        </Card>

        <Card delay="0.8s">
          <CardHeader>
            <FaImages />
          </CardHeader>
          <h3>Visual Gallery</h3>
          <p>Explore all {stats.imagesGenerated} stunning images you've generated to bring your stories to life.</p>
          <ActionLink to="/stories">
            <FaImages /> Browse Gallery
          </ActionLink>
        </Card>
      </Grid>
    </DashboardWrapper>
  );
};

export default Dashboard;