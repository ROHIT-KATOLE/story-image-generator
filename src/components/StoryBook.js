// src/components/StoryBook.js
import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 5px #aaa;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

const PageTitle = styled.h2`
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
`;

const PageContent = styled.p`
  font-size: 1em;
  line-height: 1.5;
  color: #333;
  overflow-y: auto;
`;

const PageImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const Page = React.forwardRef(({ number, title, content, image }, ref) => (
  <PageContainer ref={ref}>
    {number === 1 && <PageTitle>{title}</PageTitle>}
    {number !== 1 && image && <PageImage src={image} alt={`Page ${number}`} />}
    {number !== 1 && <PageContent>{content}</PageContent>}
    <PageContent>Page number: {number}</PageContent>
  </PageContainer>
));

const StoryBookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  margin: 10px;
`;

const NavigationButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const StoryBook = ({ story }) => {
  const book = useRef();
  const storyParts = story.content.split('\n');

  return (
    <StoryBookWrapper>
      <NavigationButtons>
        <NavigationButton onClick={() => book.current.pageFlip().flipPrev()}>
          Previous
        </NavigationButton>
        <NavigationButton onClick={() => book.current.pageFlip().flipNext()}>
          Next
        </NavigationButton>
      </NavigationButtons>
      <HTMLFlipBook
        width={400}
        height={600}
        ref={book}
        style={{ margin: '20px auto' }}
      >
        <Page
          key={1}
          number={1}
          title={story.title}
        />
        {storyParts.map((part, index) => (
          <Page
            key={index + 2}
            number={index + 2}
            content={part.trim()}
            image={story.images[index]}
          />
        ))}
      </HTMLFlipBook>
    </StoryBookWrapper>
  );
};

export default StoryBook;
