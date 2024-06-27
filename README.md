# Firebase Stories App

This project is a Firebase-based application that allows users to authenticate via Google or email and password, create and manage stories, and upload images associated with those stories. The application uses Firebase Authentication for user management, Firestore for storing user and story data, and Firebase Storage for storing images and story JSON files.

## Table of Contents

- [Firebase Stories App](#firebase-stories-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Authentication](#authentication)
    - [Story Management](#story-management)
  - [Firebase Configuration](#firebase-configuration)
  - [API Documentation](#api-documentation)
  - [Contributing](#contributing)
  - [License](#license)
  
## Features

- User Authentication with Google and Email/Password
- User Registration
- Create and Save Stories with Titles and Content
- Upload and Fetch Images Associated with Stories
- Store Stories and Images in Firebase Storage
- Fetch All Stories for a User

## Setup

### Prerequisites

- Node.js and npm installed
- Firebase project setup

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/firebase-stories-app.git
    cd firebase-stories-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure Firebase:

    - Create a `.env` file in the root of your project.
    - Add your Firebase configuration to the `.env` file.

    ```plaintext
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
    ```

4. Start the development server:

    ```bash
    npm start
    ```

## Usage

### Authentication

- **Sign in with Google:**
```javascript
  import { signInWithGoogle } from './firebase';

  const user = await signInWithGoogle();
  console.log(user);
```

- **Register with Email and Password:**
```javascript
import { registerWithEmailAndPassword } from './firebase';

const user = await registerWithEmailAndPassword(email, password, username);
console.log(user);
```

- **Login with Email and Password:**
```javascript
import { loginWithEmailAndPassword } from './firebase';

const user = await loginWithEmailAndPassword(email, password);
console.log(user);
```

- **Logout:**
```javascript
import { logout } from './firebase';

await logout();
console.log('User logged out');
```

### Story Management
- **Save a Story:**
```javascript
import { saveStory } from './firebase';

await saveStory(userId, storyContent, imageUrl);
console.log('Story saved successfully');
```

- **Save a New Story:**
```javascript
import { saveNewStory } from './firebase';

await saveNewStory(userId, title, storyContent, imageUrls);
console.log('New story saved successfully');
```

- **Fetch Images for a Story:**
```javascript
import { fetchImages } from './firebase';

const images = await fetchImages(userId, storyId);
console.log(images);
```

- **Fetch a Story from Storage:**
```javascript
import { fetchStoryFromStorage } from './firebase';

const story = await fetchStoryFromStorage(userId, storyId);
console.log(story);
```

- **Fetch All Stories for a User:**
```javascript
import { fetchAllStories } from './firebase';

const stories = await fetchAllStories(userId);
console.log(stories);
```



## Firebase Configuration
Make sure to configure Firebase with your project details as shown in the Installation section.



## API Documentation
The following Firebase functions are available:

- signInWithGoogle(): Sign in with Google.
- registerWithEmailAndPassword(email, password, username): Register a new user with email and password.
- loginWithEmailAndPassword(email, password): Login with email and password.
- logout(): Logout the current user.
- saveStory(userId, storyContent, imageUrl): Save a story and associated images.
- saveNewStory(userId, title, storyContent, imageUrls): Save a new story with title and content.
- fetchImages(userId, storyId): Fetch images for a specific story.
- fetchStoryFromStorage(userId, storyId): Fetch a story from Firebase Storage.
- fetchAllStories(userId): Fetch all stories for a user.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
