import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { saveStory, fetchStory, saveNewStory } from '../firebase';

// Styled Components for Dark Interactive Fiction UI
const EditorWrapper = styled.div`  
  display: flex;  
  flex-direction: column;  
  height: 100vh;  
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);  
  color: #ffffff;  
  font-family: 'Arial', sans-serif;  
  padding-top: 70px; /* Account for fixed header */  
  &::before {  
    content: '';  
    position: fixed;  
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

const TopBar = styled.div`  
  display: flex;  
  justify-content: space-between;  
  align-items: center;  
  padding: 15px 20px;  
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);  
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);  
  z-index: 100;  
  backdrop-filter: blur(20px);  
`;

const ProjectTitle = styled.input`  
  font-size: 1.5em;  
  font-weight: bold;  
  background: transparent;  
  border: none;  
  color: #fff;  
  padding: 8px 12px;  
  border-radius: 6px;  
  transition: all 0.3s ease;  
  &:hover, &:focus {  
    background: rgba(255, 255, 255, 0.1);  
    outline: none;  
  }  
  &::placeholder {  
    color: #666;  
  }  
`;

const ActionButtons = styled.div`  
  display: flex;  
  gap: 10px;  
  button {  
    padding: 10px 16px;  
    border: none;  
    border-radius: 6px;  
    cursor: pointer;  
    font-size: 0.9em;  
    font-weight: 500;  
    transition: all 0.3s ease;  
    display: flex;  
    align-items: center;  
    gap: 6px;  
    background: rgba(255, 255, 255, 0.1);  
    color: white;  
    backdrop-filter: blur(10px);  
    &:hover {  
      background: rgba(255, 255, 255, 0.15);  
      transform: translateY(-1px);  
    }  
    &.primary {  
      background: linear-gradient(135deg, #4CAF50, #45a049);  
      &:hover { background: linear-gradient(135deg, #45a049, #3d8b40); }  
    }  
    &.danger {  
      background: linear-gradient(135deg, #f44336, #da190b);  
      &:hover { background: linear-gradient(135deg, #da190b, #c5170a); }  
    }
    &.auto-gen {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
      &:hover { background: linear-gradient(135deg, #7b1fa2, #4a148c); }
    }  
  }  
`;

const MainContent = styled.div`  
  display: flex;  
  flex: 1;  
  overflow: hidden;  
  position: relative;  
`;

const StoryPanel = styled.div`  
  width: ${props => props.$width}px;  
  display: flex;  
  flex-direction: column;  
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(40, 40, 60, 0.95) 100%);  
  border-right: 1px solid rgba(255, 255, 255, 0.1);  
  transition: width 0.2s ease;  
  backdrop-filter: blur(10px);  
`;

const Splitter = styled.div`  
  width: 4px;  
  background: rgba(255, 255, 255, 0.1);  
  cursor: col-resize;  
  position: relative;  
  transition: background 0.2s ease;  
  &:hover {  
    background: rgba(255, 204, 0, 0.3);  
  }  
  &::before {  
    content: '';  
    position: absolute;  
    left: -2px;  
    right: -2px;  
    top: 0;  
    bottom: 0;  
  }  
`;

const StoryContent = styled.div`  
  flex: 1;  
  padding: 20px;  
  overflow-y: auto;  
  display: flex;  
  flex-direction: column;  
  gap: 15px;  
  &::-webkit-scrollbar {  
    width: 8px;  
  }  
  &::-webkit-scrollbar-track {  
    background: rgba(0, 0, 0, 0.2);  
    border-radius: 4px;  
  }  
  &::-webkit-scrollbar-thumb {  
    background: rgba(255, 204, 0, 0.3);  
    border-radius: 4px;  
  }  
  &::-webkit-scrollbar-thumb:hover {  
    background: rgba(255, 204, 0, 0.5);  
  }  
`;

const StoryNode = styled.div`  
  border-left: 4px solid ${props =>  
    props.type === 'user' ? '#4CAF50' : '#2196F3'  
  };  
  border-radius: 0 12px 12px 0;  
  padding: 15px;  
  background: ${props =>  
    props.type === 'user'  
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(69, 160, 73, 0.05))'  
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(21, 101, 192, 0.05))'  
  };  
  margin-bottom: 10px;  
  position: relative;  
  animation: slideIn 0.3s ease-out;  
  backdrop-filter: blur(10px);  
  border: 1px solid rgba(255, 255, 255, 0.05);  
  .node-header {  
    display: flex;  
    justify-content: space-between;  
    align-items: center;  
    margin-bottom: 8px;  
    font-size: 0.8em;  
    color: #888;  
    font-weight: 500;  
    text-transform: uppercase;  
    letter-spacing: 0.5px;  
  }  
  .node-content {  
    line-height: 1.6;  
    white-space: pre-wrap;  
    font-size: 1em;  
    color: #e0e0e0;  
  }  
  @keyframes slideIn {  
    from {  
      opacity: 0;  
      transform: translateX(-10px);  
    }  
    to {  
      opacity: 1;  
      transform: translateX(0);  
    }  
  }  
`;

const ChoiceButton = styled.button`  
  display: inline-block;  
  margin: 2px 4px;  
  padding: 6px 12px;  
  background: linear-gradient(135deg, #FF9800, #f57c00);  
  color: white;  
  border: none;  
  border-radius: 6px;  
  cursor: pointer;  
  font-size: 0.85em;  
  font-weight: 500;  
  transition: all 0.2s ease;  
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.2);  
  &:hover {  
    background: linear-gradient(135deg, #f57c00, #e65100);  
    transform: translateY(-1px);  
    box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);  
  }  
  &:active {  
    transform: translateY(0);  
    box-shadow: 0 2px 4px rgba(255, 152, 0, 0.2);  
  }  
`;

const InputSection = styled.div`  
  padding: 20px;  
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);  
  border-top: 1px solid rgba(255, 255, 255, 0.1);  
  backdrop-filter: blur(20px);  
`;

const InputArea = styled.div`  
  display: flex;  
  flex-direction: column;  
  gap: 10px;  
  textarea {  
    background: rgba(255, 255, 255, 0.05);  
    border: 1px solid rgba(255, 255, 255, 0.1);  
    border-radius: 8px;  
    padding: 12px;  
    color: #fff;  
    font-size: 1em;  
    line-height: 1.5;  
    resize: vertical;  
    min-height: 80px;  
    font-family: inherit;  
    backdrop-filter: blur(10px);  
    &:focus {  
      outline: none;  
      border-color: #4CAF50;  
      background: rgba(255, 255, 255, 0.08);  
    }  
    &::placeholder {  
      color: #666;  
    }  
  }  
  .input-controls {  
    display: flex;  
    justify-content: flex-end;  
    align-items: center;  
    .send-button {  
      padding: 10px 20px;  
      background: linear-gradient(135deg, #4CAF50, #45a049);  
      border: none;  
      border-radius: 6px;  
      color: white;  
      cursor: pointer;  
      font-weight: 500;  
      transition: all 0.2s ease;  
      display: flex;  
      align-items: center;  
      gap: 6px;  
      &:hover {  
        background: linear-gradient(135deg, #45a049, #3d8b40);  
        transform: translateY(-1px);  
      }  
      &:disabled {  
        background: rgba(255, 255, 255, 0.1);  
        cursor: not-allowed;  
        transform: none;  
      }  
    }  
  }  
`;

const ImagePanel = styled.div`  
  flex: 1;  
  display: flex;  
  flex-direction: column;  
  background: linear-gradient(135deg, rgba(21, 21, 21, 0.95) 0%, rgba(40, 40, 60, 0.95) 100%);  
  min-width: 300px;  
  backdrop-filter: blur(10px);  
`;

const ImageHeader = styled.div`  
  padding: 20px;  
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);  
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);  
  backdrop-filter: blur(20px);  
  h3 {  
    margin: 0 0 15px 0;  
    font-size: 1.2em;  
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }  
  .prompt-input {  
    display: flex;  
    gap: 10px;  
    input {  
      flex: 1;  
      background: rgba(255, 255, 255, 0.05);  
      border: 1px solid rgba(255, 255, 255, 0.1);  
      border-radius: 6px;  
      padding: 10px;  
      color: #fff;  
      font-size: 0.9em;  
      backdrop-filter: blur(10px);  
      &:focus {  
        outline: none;  
        border-color: #FF9800;  
        background: rgba(255, 255, 255, 0.08);  
      }  
      &::placeholder {  
        color: #666;  
      }  
    }  
    button {  
      padding: 10px 16px;  
      background: linear-gradient(135deg, #FF9800, #f57c00);  
      border: none;  
      border-radius: 6px;  
      color: white;  
      cursor: pointer;  
      font-weight: 500;  
      transition: all 0.2s ease;  
      &:hover {  
        background: linear-gradient(135deg, #f57c00, #e65100);  
      }  
      &:disabled {  
        background: rgba(255, 255, 255, 0.1);  
        cursor: not-allowed;  
      }  
    }  
  }
  .auto-gen-info {
    margin-top: 10px;
    padding: 10px;
    background: rgba(156, 39, 176, 0.1);
    border: 1px solid rgba(156, 39, 176, 0.3);
    border-radius: 6px;
    font-size: 0.85em;
    color: #bb86fc;
  }
`;

const ImageDisplay = styled.div`  
  flex: 1;  
  padding: 20px;  
  display: flex;  
  flex-direction: column;  
  align-items: center;  
  justify-content: flex-start;  
  overflow-y: auto;  
  &::-webkit-scrollbar {  
    width: 8px;  
  }  
  &::-webkit-scrollbar-track {  
    background: rgba(0, 0, 0, 0.2);  
    border-radius: 4px;  
  }  
  &::-webkit-scrollbar-thumb {  
    background: rgba(255, 152, 0, 0.3);  
    border-radius: 4px;  
  }  
  &::-webkit-scrollbar-thumb:hover {  
    background: rgba(255, 152, 0, 0.5);  
  }  
  .image-container {  
    width: 100%;  
    max-width: 400px;  
    aspect-ratio: 1;  
    border-radius: 12px;  
    overflow: hidden;  
    background: rgba(0, 0, 0, 0.3);  
    display: flex;  
    align-items: center;  
    justify-content: center;  
    border: 2px dashed rgba(255, 255, 255, 0.2);  
    margin-bottom: 15px;  
    img {  
      width: 100%;  
      height: 100%;  
      object-fit: cover;  
    }  
    .placeholder {  
      text-align: center;  
      color: #666;  
      font-size: 0.9em;  
    }  
  }  
  .image-controls {  
    display: flex;  
    gap: 10px;  
    margin-bottom: 15px;  
    button {  
      padding: 8px 12px;  
      background: rgba(255, 255, 255, 0.1);  
      border: none;  
      border-radius: 6px;  
      color: white;  
      cursor: pointer;  
      font-size: 0.85em;  
      transition: all 0.2s ease;  
      backdrop-filter: blur(10px);  
      &:hover {  
        background: rgba(255, 255, 255, 0.15);  
      }  
      &:disabled {  
        background: rgba(255, 255, 255, 0.05);  
        color: #666;  
        cursor: not-allowed;  
      }  
    }  
  }  
  .loading-spinner {  
    width: 40px;  
    height: 40px;  
    border: 3px solid rgba(255, 255, 255, 0.1);  
    border-radius: 50%;  
    border-left-color: #FF9800;  
    animation: spin 1s linear infinite;  
  }  
  @keyframes spin {  
    to { transform: rotate(360deg); }  
  }  
`;

const Editor = () => {
  const { currentUser } = useAuth();
  const [storyData, setStoryData] = useState([]);
  const [title, setTitle] = useState('Untitled Story');
  const [initialInput, setInitialInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [initialSubmitted, setInitialSubmitted] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [storyPanelWidth, setStoryPanelWidth] = useState(window.innerWidth * 0.6);
  const [isDragging, setIsDragging] = useState(false);
  const [autoGenerateImages, setAutoGenerateImages] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const { story: fetchedStory, images: fetchedImages } = await fetchStory(currentUser.uid);
        setStoryData(fetchedStory || []);
        if (fetchedImages && fetchedImages.length > 0) {
          setImageUrls(fetchedImages);
        } else {
          setImageUrls([]);
        }
        setInitialSubmitted(fetchedStory && fetchedStory.length > 0);
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Splitter logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newWidth = Math.max(300, Math.min(window.innerWidth - 300, e.clientX));
        setStoryPanelWidth(newWidth);
      }
    };
    const handleMouseUp = () => { setIsDragging(false); };
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  const handleSplitterMouseDown = () => { setIsDragging(true); };

  // Utility function to clean assistant responses for image generation
  const cleanTextForImageGeneration = (text) => {
    // Remove choice options in parentheses at the end
    const cleanedText = text.replace(/\s*\([^)]*\/[^)]*\)\s*$/g, '').trim();

    // Extract the most visual/descriptive sentence for image generation
    const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim());

    // Prefer sentences with visual descriptors
    const visualSentence = sentences.find(sentence =>
      /\b(see|look|appear|show|reveal|glisten|shine|dark|bright|color|shadow|light|forest|mountain|castle|dragon|sword|magic|crystal)\b/i.test(sentence)
    ) || sentences[sentences.length - 1]; // fallback to last sentence

    return visualSentence?.trim() || cleanedText;
  };

  // Auto-generate image from assistant response
  const autoGenerateImageFromResponse = async (assistantResponse) => {
    if (!autoGenerateImages) return;

    try {
      setImageLoading(true);
      const imagePromptText = cleanTextForImageGeneration(assistantResponse);

      // Enhance prompt for better image generation
      const enhancedPrompt = `${imagePromptText}, fantasy art style, cinematic, detailed, atmospheric, high quality, digital art`;

      const response = await fetch('https://story-image-generator.onrender.com/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });
      const data = await response.json();

      setImageUrls(prevImageUrls => {
        const newImageUrls = [...prevImageUrls, ...data.images];
        setCurrentImageIndex(prevImageUrls.length);
        return newImageUrls;
      });
    } catch (error) {
      console.error('Error auto-generating image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  // Function to render text with clickable choices
  const renderTextWithChoices = (text, onChoiceClick) => {
    if (!text || typeof text !== "string") {
      console.error("⚠ renderTextWithChoices received invalid text:", text);
      return <span></span>;
    }
  
    const choiceRegex = /\(([^)]+)\)/g;
    const matches = [...text.matchAll(choiceRegex)];

    if (matches.length === 0) {
      return <span>{text}</span>;
    }

    // Get the last match (last set of choices)
    const lastMatch = matches[matches.length - 1];
    const beforeChoices = text.substring(0, lastMatch.index);
    const choicesText = lastMatch[1];
    const afterChoices = text.substring(lastMatch.index + lastMatch[0].length);

    // Split choices by '/' and trim whitespace
    const choices = choicesText.split('/').map(choice => choice.trim());

    return (
      <span>
        {beforeChoices}
        <span style={{ color: '#FF9800', fontWeight: 'bold' }}>(</span>
        {choices.map((choice, index) => (
          <span key={index}>
            <ChoiceButton onClick={() => onChoiceClick(choice)}>
              {choice}
            </ChoiceButton>
            {index < choices.length - 1 && <span style={{ color: '#FF9800' }}>/</span>}
          </span>
        ))}
        <span style={{ color: '#FF9800', fontWeight: 'bold' }}>)</span>
        {afterChoices}
      </span>
    );
  };

  // Returns an array of choices if found in the text, else []
  const parseChoicesFromText = (text) => {
    const choiceRegex = /\(([^)]+)\)/g;
    const matches = [...text.matchAll(choiceRegex)];
    const lastMatch = matches[matches.length - 1];

    if (lastMatch && lastMatch[1]) {
      return lastMatch[1].split('/').map(choice => choice.trim());
    }
    return [];
  };

  // If the last assistant message has choices, we show only the buttons, not the input
  const lastAssistant = storyData
    .slice().reverse()
    .find(entry => entry.role === 'Assistant');
  const lastAssistantChoices = lastAssistant ? parseChoicesFromText(lastAssistant.content) : [];

  const handleChoiceClick = (choice) => {
    setUserInput(choice);
    // Auto-submit the choice
    handleUserInputSubmit(choice);
  };

  const handleInitialStorySubmit = async () => {
    if (!initialInput.trim()) return;
    setLoading(true);
    const initialEntry = { role: "User", content: initialInput };
    const updatedStoryData = [initialEntry];
    try {
      const response = await fetch('https://story-image-generator.onrender.com/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyData: updatedStoryData }),
      });
      const data = await response.json();
      const assistantContent = data?.newResponse;

      if (!assistantContent || typeof assistantContent !== "string") {
        console.error("⚠️ Invalid assistant response:", assistantContent);
        setError("The story generator returned an invalid response. Try again.");
        setLoading(false);
        return; // IMPORTANT: stop execution
      }

      const newEntry = { role: "Assistant", content: assistantContent };
      const newUpdatedStoryData = [...updatedStoryData, newEntry];
      setStoryData(newUpdatedStoryData);
      await saveStory(currentUser.uid, newUpdatedStoryData, imageUrls);
      setInitialSubmitted(true);
      setInitialInput('');

      // Auto-generate image from the assistant response
      await autoGenerateImageFromResponse(data.newResponse);
    } catch (error) {
      console.error('Error generating story:', error);
      setError('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserInputSubmit = async (choiceInput = null) => {
    const inputToSend = choiceInput || userInput;
    if (!inputToSend.trim()) return;
    setLoading(true);
    const newUserEntry = { role: "User", content: inputToSend };
    const updatedStoryData = [...storyData, newUserEntry];
    setStoryData(updatedStoryData);
    setUserInput('');
    try {
      const response = await fetch('https://story-image-generator.onrender.com/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyData: updatedStoryData, userInput: inputToSend }),
      });
      const data = await response.json();
      const assistantContent = data?.newResponse;

      if (!assistantContent || typeof assistantContent !== "string") {
        console.error("⚠️ Invalid assistant response:", assistantContent);
        setError("The story generator returned an invalid response. Try again.");
        setLoading(false);
        return; // IMPORTANT: stop execution
      }
      
      const newEntry = { role: "Assistant", content: assistantContent };
      const newUpdatedStoryData = [...updatedStoryData, newEntry];
      setStoryData(newUpdatedStoryData);
      await saveStory(currentUser.uid, newUpdatedStoryData, imageUrls);

      // Auto-generate image from the assistant response
      await autoGenerateImageFromResponse(data.newResponse);
    } catch (error) {
      console.error('Error generating story:', error);
      setError('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    setError('');
    try {
      const response = await fetch('https://story-image-generator.onrender.com/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      setImageUrls(prevImageUrls => {
        const newImageUrls = [...prevImageUrls, ...data.images];
        setCurrentImageIndex(prevImageUrls.length);
        return newImageUrls;
      });
      setImagePrompt('');
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleCreateNewStory = () => {
    setStoryData([]);
    setTitle('Untitled Story');
    setInitialInput('');
    setInitialSubmitted(false);
    setImageUrls([]);
    setCurrentImageIndex(0);
    setError('');
  };

  const handleClearStory = () => {
    setStoryData([]);
    setInitialInput('');
    setInitialSubmitted(false);
    setImageUrls([]);
    setCurrentImageIndex(0);
    setError('');
  };

  const handleSaveStory = async () => {
    try {
      await saveNewStory(currentUser.uid, title, storyData, imageUrls);
      alert('Story saved successfully!');
    } catch (error) {
      console.error('Error saving story:', error);
      setError('Failed to save story. Please try again.');
    }
  };

  return (
    <EditorWrapper>
      <TopBar>
        <ProjectTitle
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter story title..."
        />
        <ActionButtons>
          <button onClick={handleCreateNewStory}>
            <i className="fas fa-plus"></i> New Story
          </button>
          <button className="danger" onClick={handleClearStory}>
            <i className="fas fa-eraser"></i> Clear Story
          </button>
          <button
            className={autoGenerateImages ? "auto-gen" : ""}
            onClick={() => setAutoGenerateImages(!autoGenerateImages)}
            title="Toggle automatic image generation"
          >
            <i className="fas fa-magic"></i> Auto Images: {autoGenerateImages ? 'ON' : 'OFF'}
          </button>
          <button className="primary" onClick={handleSaveStory}>
            <i className="fas fa-save"></i> Save Story
          </button>
        </ActionButtons>
      </TopBar>

      <MainContent>
        <StoryPanel $width={storyPanelWidth}>
          <StoryContent>
            {storyData.map((entry, index) => (
              <StoryNode key={index} type={entry.role.toLowerCase()}>
                <div className="node-header">
                  <span style={{ color: entry.role === 'User' ? '#4CAF50' : '#2196F3' }}>
                    {entry.role === 'User' ? 'You' : 'Assistant'}
                  </span>
                  <span>#{index + 1}</span>
                </div>
                <div className="node-content">
                  {entry.role === 'Assistant'
                    ? renderTextWithChoices(entry.content, handleChoiceClick)
                    : entry.content}
                </div>
              </StoryNode>
            ))}
            {loading && (
              <StoryNode type="loading">
                <div className="node-content">
                  <i className="fas fa-spinner fa-spin"></i> Generating response...
                </div>
              </StoryNode>
            )}
          </StoryContent>
          <InputSection>
            <InputArea>
              {!initialSubmitted ? (
                <>
                  <textarea
                    value={initialInput}
                    onChange={(e) => setInitialInput(e.target.value)}
                    placeholder="Start your interactive story... (e.g., 'Rome, 44 BC. Julius Caesar has just been assassinated...')"
                    rows={3}
                  />
                  <div className="input-controls">
                    <button
                      className="send-button"
                      onClick={handleInitialStorySubmit}
                      disabled={loading || !initialInput.trim()}
                    >
                      <i className="fas fa-play"></i>
                      Start Story
                    </button>
                  </div>
                </>
              ) : (
                // Only show user input if there are no choices in the last assistant message
                lastAssistantChoices.length === 0 && (
                  <>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Continue the story or make your choice..."
                      rows={2}
                    />
                    <div className="input-controls">
                      <button
                        className="send-button"
                        onClick={() => handleUserInputSubmit()}
                        disabled={loading || !userInput.trim()}
                      >
                        <i className="fas fa-paper-plane"></i>
                        Send
                      </button>
                    </div>
                  </>
                )
              )}
            </InputArea>
          </InputSection>
        </StoryPanel>
        <Splitter
          onMouseDown={handleSplitterMouseDown}
          style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
        />
        <ImagePanel>
          <ImageHeader>
            <h3>
              <i className="fas fa-image"></i>
              Visual Generator
            </h3>
            <div className="prompt-input">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the scene you want to visualize..."
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateImage()}
              />
              <button
                onClick={handleGenerateImage}
                disabled={imageLoading || !imagePrompt.trim()}
              >
                {imageLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                Generate
              </button>
            </div>
            {autoGenerateImages && (
              <div className="auto-gen-info">
                <i className="fas fa-info-circle"></i> Auto-generation is enabled. Images will be created automatically from story responses.
              </div>
            )}
          </ImageHeader>
          <ImageDisplay>
            <div className="image-container">
              {imageLoading ? (
                <div className="loading-spinner"></div>
              ) : imageUrls.length > 0 ? (
                <img src={imageUrls[currentImageIndex]} alt="Generated scene" />
              ) : (
                <div className="placeholder">
                  <i className="fas fa-image" style={{ fontSize: '2em', marginBottom: '10px', display: 'block' }}></i>
                  <div>Generated images will appear here</div>
                  {autoGenerateImages && (
                    <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#888' }}>
                      Images will auto-generate as the story progresses
                    </div>
                  )}
                </div>
              )}
            </div>
            {imageUrls.length > 0 && (
              <div className="image-controls">
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <span>{currentImageIndex + 1} / {imageUrls.length}</span>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(imageUrls.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === imageUrls.length - 1}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </ImageDisplay>
        </ImagePanel>
      </MainContent>
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #f44336, #da190b)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </EditorWrapper>
  );
};

export default Editor;
