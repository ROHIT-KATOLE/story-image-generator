// src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBook, FaChartLine, FaPlusCircle } from 'react-icons/fa';

const DashboardWrapper = styled.div`
  padding: 20px;
  padding-top: 80px;
  color: #ffffff;
  background-color: #282c34;
  min-height: 100vh;
`;

const WelcomeMessage = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: #444;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin-bottom: 10px;
  }

  p {
    font-size: 1em;
    line-height: 1.5;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  svg {
    margin-right: 10px;
  }
`;

const ActionLink = styled(Link)`
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #0056b3;
  }
`;

const Dashboard = () => {
  const { currentUser } = useAuth();
  return (
    <DashboardWrapper>
      <WelcomeMessage>Welcome, {currentUser?.displayName}!</WelcomeMessage>
      <Grid>
        <Card>
          <CardHeader>
            <FaBook size={24} />
            <h3>My Stories</h3>
          </CardHeader>
          <p>Manage your stories and continue your creative journey.</p>
          <ActionLink to="/stories">Go to My Stories</ActionLink>
        </Card>
        <Card>
          <CardHeader>
            <FaChartLine size={24} />
            <h3>Recent Activities</h3>
          </CardHeader>
          <p>View your recent activities and track your progress.</p>
          <ActionLink to="/activities">View Activities</ActionLink>
        </Card>
        <Card>
          <CardHeader>
            <FaPlusCircle size={24} />
            <h3>Quick Actions</h3>
          </CardHeader>
          <p>Start a new story or explore new features.</p>
          <ActionLink to="/new-story">Create New Story</ActionLink>
        </Card>
      </Grid>
    </DashboardWrapper>
  );
};

export default Dashboard;
