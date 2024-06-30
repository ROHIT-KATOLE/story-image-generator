import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { saveStory, fetchStory, saveNewStory } from '../firebase';

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #ffffff;
  height: 100vh;

  .navbar {
    display: flex;
    justify-content: space-around;
    background-color: #444;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .navbar button {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 1em;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background-color: #007bff;
    }

    i {
      margin-right: 8px;
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 10px;
  }

  .story-editor, .image-generator {
    background-color: #333;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #555;
    height: 100%;
  }

  .story-editor {
    display: flex;
    flex-direction: column;
  }

  .story-editor input,
  .story-editor textarea {
    width: 100%;
    background-color: #444;
    color: #fff;
    border: none;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  .story-editor textarea {
    height: 50%;
    resize: none;
  }

  .image-generator {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .image-generator img {
    max-width: 100%;
    max-height: 500px;
    margin-bottom: 10px;
    border-radius: 4px;
    object-fit: contain;
  }

  .image-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #444;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .image-navbar input {
    width: 60%;
    background-color: #444;
    color: #fff;
    border: none;
    padding: 10px;
    font-size: 1em;
    border-radius: 4px;
  }

  .image-navbar button {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 1em;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background-color: #007bff;
    }

    i {
      margin-right: 8px;
    }
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-left-color: #007bff;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Editor = () => {
  const { currentUser } = useAuth();
  const [story, setStory] = useState('');
  const [title, setTitle] = useState('');
  const [userInput, setUserInput] = useState('');
  const [initialSubmitted, setInitialSubmitted] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const { story: fetchedStory, images: fetchedImages } = await fetchStory(currentUser.uid);
        setStory(fetchedStory || '');
        setImageUrls(fetchedImages || []);
      }
    };
    fetchUserData();
  }, [currentUser]);  

  const handleInitialStorySubmit = async () => {
    try {
      const response = await fetch('https://swine-frank-hog.ngrok-free.app/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story }),
      });
      const data = await response.json();
      const newStory = `${story}\n\nAssistant:\n${data.story}`;
      setStory(newStory);
      await saveStory(currentUser.uid, newStory, imageUrls);
      setInitialSubmitted(true);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };  

  const handleUserInputSubmit = async () => {
    const updatedStory = `${story}\n\nUser:\n${userInput}`;
    setStory(updatedStory);
    setUserInput('');
  
    try {
      const response = await fetch('https://swine-frank-hog.ngrok-free.app/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: updatedStory }),
      });
      const data = await response.json();
      const newStory = `${updatedStory}\n\nAssistant:\n${data.story}`;
      setStory(newStory);
      await saveStory(currentUser.uid, newStory, imageUrls);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };
  

  const handleCreateNewStory = () => {
    setStory('');
    setTitle('');
    setInitialSubmitted(false);
    setImageUrls([]);
    setCurrentImageIndex(0);
  };

  const handleClearStory = () => {
    setStory('');
    setImageUrls([]);
    setCurrentImageIndex(0);
  };

  const handleSaveStory = async () => {
    try {
      await saveNewStory(currentUser.uid, title, story, imageUrls);
      alert('Story saved successfully!');
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://swine-frank-hog.ngrok-free.app/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      setImageUrls(prevImageUrls => {
        const newImageUrls = [...prevImageUrls, ...data.images];
        setCurrentImageIndex(prevImageUrls.length); // Set to the first of newly generated images
        return newImageUrls;
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleNextImage = () => {
    if (imageUrls.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % imageUrls.length);
    }
  };
  
  const handlePreviousImage = () => {
    if (imageUrls.length > 0) {
      setCurrentImageIndex((currentImageIndex - 1 + imageUrls.length) % imageUrls.length);
    }
  };  

  return (
    <EditorWrapper>
      <div className="content">
        <div className="column">
          <div className="navbar">
            <button onClick={handleCreateNewStory}><i className="fas fa-plus"></i> New Story</button>
            <button onClick={handleClearStory}><i className="fas fa-eraser"></i> Clear Story</button>
            <button onClick={handleSaveStory}><i className="fas fa-save"></i> Save Story</button>
          </div>
          <div className="story-editor">
            <input
              type="text"
              placeholder="Enter story title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="Your story will appear here..."
            />
            {!initialSubmitted ? (
              <button onClick={handleInitialStorySubmit}><i className="fas fa-paper-plane"></i> Submit Initial Story</button>
            ) : (
              <>
                <textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder="Type your response..."
                />
                <button onClick={handleUserInputSubmit}><i className="fas fa-reply"></i> Submit User Input</button>
              </>
            )}
          </div>
        </div>
        <div className="column">
          <div className="image-generator">
            <div className="image-navbar">
              <input
                type="text"
                placeholder="Enter image prompt"
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
              />
              <button onClick={handleGenerateImage}><i className="fas fa-image"></i> Generate Image</button>
            </div>
            {loading && <div className="loading-spinner"></div>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {imageUrls.length > 0 && (
              <>
                <img src={imageUrls[currentImageIndex]} alt="Generated" />
                <div className="image-navbar">
                  <button onClick={handlePreviousImage}><i className="fas fa-arrow-left"></i> Previous</button>
                  <span>{`${currentImageIndex + 1} of ${imageUrls.length}`}</span>
                  <button onClick={handleNextImage}><i className="fas fa-arrow-right"></i> Next</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </EditorWrapper>
  );
};

export default Editor;