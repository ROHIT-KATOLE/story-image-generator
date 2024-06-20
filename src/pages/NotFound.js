import React from 'react';
import styled from 'styled-components';

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  min-height: 80vh;
  color: #ffffff;

  h2 {
    font-size: 3em;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2em;
    max-width: 600px;
    line-height: 1.5;
  }

  a {
    color: #61dafb;
    text-decoration: none;
    font-size: 1.5em;
  }

  a:hover {
    color: #21a1f1;
  }
`;

const NotFound = () => {
  return (
    <NotFoundWrapper>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>
        <a href="/">Return to Home</a>
      </p>
    </NotFoundWrapper>
  );
};

export default NotFound;
