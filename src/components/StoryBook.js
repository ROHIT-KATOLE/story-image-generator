// src/components/StoryBook.js - Fixed navigation and flip animation
import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled, { keyframes } from 'styled-components';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import coverImage from '../assets/1.png';
import pageTexture from '../assets/2.png';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
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

const glow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
  }
  50% { 
    text-shadow: 0 0 20px rgba(255, 204, 0, 0.8), 0 0 30px rgba(255, 204, 0, 0.6);
  }
`;

// Cover Page Styling
const CoverPageContainer = styled.div`
  background-image: url(${coverImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 40px;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 3s ease-in-out infinite;
    z-index: 2;
  }
`;

const CoverTitle = styled.h1`
  font-size: 2.8em;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin: 0;
  z-index: 3;
  position: relative;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.8);
  animation: ${glow} 3s ease-in-out infinite;
  font-family: 'Georgia', serif;
  line-height: 1.1;
  word-wrap: break-word;
  max-width: 100%;

  &::before {
    content: '✨';
    position: absolute;
    top: -25px;
    left: -40px;
    font-size: 0.4em;
    animation: ${fadeIn} 2s ease-in-out infinite alternate;
  }

  &::after {
    content: '✨';
    position: absolute;
    bottom: -25px;
    right: -40px;
    font-size: 0.4em;
    animation: ${fadeIn} 2s ease-in-out infinite alternate-reverse;
  }
`;

const CoverSubtitle = styled.p`
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-top: 30px;
  z-index: 3;
  position: relative;
  font-style: italic;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
`;

// Content Page Styling
const PageContainer = styled.div`
  background-image: url(${pageTexture});
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(139, 69, 19, 0.3);
  box-shadow: 
    inset 0 0 20px rgba(139, 69, 19, 0.1),
    0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  z-index: 1;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(139, 69, 19, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 69, 19, 0.5);
    border-radius: 4px;
    
    &:hover {
      background: rgba(139, 69, 19, 0.7);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 248, 220, 0.85), rgba(255, 248, 220, 0.95));
    z-index: 0;
    pointer-events: none;
  }

  * {
    position: relative;
    z-index: 1;
  }
`;

const PageImage = styled.div`
  width: 100%;
  height: 180px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ddd, #bbb);
    color: #666;
    font-size: 1em;
    font-weight: bold;
  }
`;

const PageContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const StoryText = styled.p`
  font-size: 1em;
  font-family: 'Georgia', serif;
  line-height: 1.6;
  color: #2c2c2c;
  text-align: justify;
  margin: 0;
  text-indent: 1.2em;
  hyphens: auto;
  word-wrap: break-word;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  flex: 1;

  &::first-letter {
    font-size: 2.5em;
    font-weight: bold;
    float: left;
    line-height: 0.9;
    margin: 0.05em 0.1em 0 0;
    color: #8b4513;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8em;
  color: #8b4513;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const ChapterTitle = styled.h2`
  font-size: 1.2em;
  color: #8b4513;
  text-align: center;
  margin-bottom: 15px;
  font-family: 'Georgia', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(139, 69, 19, 0.3);
  padding-bottom: 8px;
`;

// Main StoryBook Wrapper
const StoryBookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  overflow: visible;
  
  .flipbook-container {
    margin: 20px auto;
    border-radius: 15px;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 50px rgba(255, 204, 0, 0.1);
    overflow: hidden;
    background: #8b4513;
    padding: 15px;
    position: relative;
    z-index: 1;
    
    .storybook {
      position: relative;
      z-index: 2;
      overflow: hidden;
    }
    
    .storybook > div {
      position: relative;
      z-index: auto;
      pointer-events: all;
    }
    
    .storybook .page {
      position: relative;
      z-index: auto;
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }
  }
`;

const NavigationControls = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  align-items: center;
  
  button {
    padding: 12px 24px;
    background: linear-gradient(135deg, #ffcc00, #ff9800);
    border: none;
    border-radius: 25px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 204, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 204, 0, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }

  .pdf-button {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);

    &:hover {
      box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    }
  }

  .page-info {
    color: #fff;
    padding: 0 15px;
    font-weight: bold;
    font-size: 1.1em;
  }
`;

// Individual Page Components
const CoverPage = React.forwardRef(({ title }, ref) => (
  <CoverPageContainer ref={ref}>
    <CoverTitle>{title || 'Untitled Story'}</CoverTitle>
    <CoverSubtitle>An Interactive Tale</CoverSubtitle>
  </CoverPageContainer>
));

const ContentPage = React.forwardRef(({ number, content, image, isFirstContent }, ref) => (
  <PageContainer ref={ref}>
    {image && (
      <PageImage>
        <img src={image} alt={`Story illustration ${number}`} />
      </PageImage>
    )}

    {!image && (
      <PageImage>
        <div className="placeholder">Chapter {Math.ceil(number / 2)}</div>
      </PageImage>
    )}

    <PageContent>
      {isFirstContent && <ChapterTitle>The Beginning</ChapterTitle>}
      <StoryText>{content}</StoryText>
    </PageContent>

    <PageNumber>{number}</PageNumber>
  </PageContainer>
));

// PDF Export functionality
const exportToPDF = async (story) => {
  try {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');

    const processedContent = processStoryContent(story.story);
    const images = story.images || [];

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${story.title || 'Story'}</title>
        <style>
          body { 
            font-family: Georgia, serif; 
            margin: 0; 
            padding: 20px;
            background: white;
            color: #333;
          }
          .cover { 
            page-break-after: always; 
            text-align: center; 
            padding: 100px 40px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .cover h1 { 
            font-size: 3em; 
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
          .cover p { 
            font-size: 1.2em; 
            font-style: italic;
          }
          .page { 
            page-break-after: always; 
            padding: 40px;
            min-height: 80vh;
          }
          .page img { 
            width: 100%; 
            max-height: 300px; 
            object-fit: cover; 
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .page h2 {
            color: #8b4513;
            border-bottom: 2px solid #8b4513;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .page p { 
            line-height: 1.8; 
            text-align: justify;
            text-indent: 1.5em;
            font-size: 1.1em;
          }
          .page p::first-letter {
            font-size: 3em;
            font-weight: bold;
            float: left;
            line-height: 0.8;
            margin: 0.1em 0.1em 0 0;
            color: #8b4513;
          }
          @media print {
            body { margin: 0; }
            .page, .cover { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="cover">
          <h1>${story.title || 'Untitled Story'}</h1>
          <p>An Interactive Tale</p>
        </div>
    `;

    processedContent.forEach((content, index) => {
      const imageHtml = images[index] ? `<img src="${images[index]}" alt="Story illustration" />` : '';
      const chapterTitle = index === 0 ? '<h2>The Beginning</h2>' : '';

      htmlContent += `
        <div class="page">
          ${imageHtml}
          ${chapterTitle}
          <p>${content.content}</p>
        </div>
      `;
    });

    htmlContent += '</body></html>';

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 1000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

// Process story content helper function
const processStoryContent = (storyData) => {
  if (!storyData || !Array.isArray(storyData)) return [];

  const processedContent = [];

  // Add initial user content (first entry)
  if (storyData.length > 0 && storyData[0].role === 'User') {
    processedContent.push({
      type: 'user',
      content: storyData[0].content,
      isFirst: true
    });
  }

  // Process assistant responses, removing choice questions
  storyData.forEach((entry, index) => {
    if (entry.role === 'Assistant') {
      let content = entry.content;

      // Remove the last sentence if it contains choice options
      const sentences = content.split(/[.!?]+/).filter(s => s.trim());
      if (sentences.length > 0) {
        const lastSentence = sentences[sentences.length - 1];

        // Check if last sentence contains choice indicators
        if (lastSentence.includes('(') && lastSentence.includes(')') && lastSentence.includes('/')) {
          sentences.pop(); // Remove the choice question
        }

        content = sentences.join('. ').trim();
        if (content && !content.endsWith('.') && !content.endsWith('!') && !content.endsWith('?')) {
          content += '.';
        }
      }

      if (content.trim()) {
        processedContent.push({
          type: 'assistant',
          content: content.trim()
        });
      }
    }
  });

  return processedContent;
};

const StoryBook = ({ story }) => {
  const book = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const processedContent = processStoryContent(story.story);
  const images = story.images || [];

  // Create pages array for two-page layout
  const pages = [
    { type: 'cover', title: story.title }
  ];

  processedContent.forEach((content, index) => {
    pages.push({
      type: 'content',
      content: content.content,
      image: images[index] || null,
      isFirstContent: index === 0
    });
  });

  useEffect(() => {
    setTotalPages(pages.length);
  }, [pages.length]);

  const nextPage = () => {
    if (book.current) {
      book.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (book.current) {
      book.current.pageFlip().flipPrev();
    }
  };

  const onFlip = (e) => {
    setCurrentPage(e.data);
  };

  const handleExportPDF = () => {
    exportToPDF(story);
  };

  return (
    <StoryBookWrapper>
      <div className="flipbook-container">
        <HTMLFlipBook
          width={450}
          height={650}
          size="stretch"
          minWidth={350}
          maxWidth={1200}
          minHeight={500}
          maxHeight={1400}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          ref={book}
          className="storybook"
          usePortrait={true}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          useMouseEvents={true}
          swipeDistance={30}
          clickEventForward={true}
          disableFlipByClick={false}
          style={{
            margin: '0 auto',
            zIndex: 2,
            position: 'relative'
          }}
          disableFlipByClick={true}
        >
          {pages.map((page, index) => {
            if (page.type === 'cover') {
              return (
                <CoverPage
                  key={`cover-${index}`}
                  title={page.title}
                />
              );
            } else {
              return (
                <ContentPage
                  key={`page-${index}`}
                  number={index}
                  content={page.content}
                  image={page.image}
                  isFirstContent={page.isFirstContent}
                />
              );
            }
          })}
        </HTMLFlipBook>
      </div>

      <NavigationControls>
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          ← Previous
        </button>

        <span className="page-info">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Next →
        </button>

        <button
          onClick={handleExportPDF}
          className="pdf-button"
        >
          <FaFilePdf />
          Export PDF
        </button>
      </NavigationControls>
    </StoryBookWrapper>
  );
};

export default StoryBook;