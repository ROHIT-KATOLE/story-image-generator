// src/components/StoryBook.js
import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';
import coverImage from '../assets/1.png'; // Add your cover image
import pageTexture from '../assets/2.png'; // Add your page texture

const CoverPageContainer = styled.div`
  background-image: url(${coverImage});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: #ffffff;
`;

const PageContainer = styled.div`
  background-image: url(${pageTexture});
  background-size: cover;
  background-position: center;
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
  font-size: 2em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin: 0;
`;

const PageContent = styled.p`
  font-size: 1em;
  font-family: 'Bradley Hand', cursive;
  line-height: 1.5;
  color: #333;
  overflow-y: auto;
  white-space: pre-wrap;
`;

const PageImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8em;
  color: #666;
`;

const Page = React.forwardRef(({ number, title, content, image }, ref) => (
  number === 1 ? (
    <CoverPageContainer ref={ref}>
      <PageTitle>{title}</PageTitle>
    </CoverPageContainer>
  ) : (
    <PageContainer ref={ref}>
      {image && <PageImage src={image} alt={`Page ${number}`} />}
      <PageContent dangerouslySetInnerHTML={{ __html: content }} />
      <PageNumber>{number}</PageNumber>
    </PageContainer>
  )
));

const StoryBookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StoryBook = ({ story }) => {
  const book = useRef();
  const storyParts = story.story || [];

  const pages = [];
  // Add the first page with title
  pages.push({ number: 1, title: story.title });

  // Add the second page with the first piece of content
  if (storyParts.length > 0) {
    pages.push({ number: 2, content: storyParts[0].content });
  }

  // Combine content from the third page onwards
  for (let i = 1; i < storyParts.length; i += 2) {
    const combinedContent = storyParts.slice(i, i + 2).map(part => part.content).join('<br /><br />');
    pages.push({ number: pages.length + 1, content: combinedContent });
  }

  return (
    <StoryBookWrapper>
      <HTMLFlipBook
        width={400}
        height={600}
        ref={book}
        style={{ margin: '20px auto' }}
      >
        {pages.map((page, index) => (
          <Page
            key={index + 1}
            number={index + 1}
            title={page.title}
            content={page.content}
            image={story.images && story.images[index - 1]}
          />
        ))}
      </HTMLFlipBook>
    </StoryBookWrapper>
  );
};

export default StoryBook;