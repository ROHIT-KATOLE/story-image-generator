# Interactive Story and Image Generator

## Overview
The **Interactive Story and Image Generator** is a web application that allows users to generate engaging storylines and corresponding images using AI. It is designed for writers, gamers, and comic book enthusiasts who want to create immersive narratives with AI-assisted storytelling and visuals.

## Features
### 1. Story Editor
- Users can write and edit their own stories.
- AI-powered text generation using **Mistral 7B Instruct Fine-tuned Model**.
- Ability to save and retrieve stories using **Firebase Firestore**.

### 2. Image Generator
- AI-based image generation from text prompts using **Stable Diffusion Fine-tuned LoRA**.
- Users can download and save generated images.
- Images are stored securely in **Firebase Storage**.

### 3. User Authentication
- Google Authentication and Email/Password login using **Firebase Auth**.
- Secure user sessions with token-based authentication.

### 4. Cloud-Based Backend
- Firebase Functions handle AI requests to the deployed model.
- Firestore is used to store user stories and metadata.
- Firebase Storage for saving generated images.

## Tech Stack
### Frontend
- **React.js** (UI framework)
- **Tailwind CSS** (Styling)
- **Axios** (API requests)

### Backend
- **Firebase Functions** (Serverless backend)
- **Firestore** (NoSQL Database for user stories)
- **Firebase Storage** (For saving images)

### AI Integration
- **Mistral 7B Instruct Fine-tuned Model** (For text/story generation)
- **Stable Diffusion Fine-tuned LoRA** (For AI-generated images)

## Installation and Setup
### Prerequisites
- Node.js (v16 or v18+ required for Firebase Functions)
- Firebase CLI
- A Firebase Project with Firestore and Storage enabled

### Steps to Set Up the Project
1. **Clone the Repository**
   ```sh
   git clone https://github.com/ROHIT-KATOLE/story-image-generator
   cd story-image-generator
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Firebase**
   - Initialize Firebase in the project:
     ```sh
     firebase init
     ```
   - Choose **Firestore, Functions, and Hosting** during setup.
   - Set up `.env` file with your Firebase and Model credentials.

4. **Deploy Firebase Functions**
   ```sh
   cd functions
   npm install
   firebase deploy --only functions
   ```

5. **Run the Development Server**
   ```sh
   npm start
   ```

## Usage
- Sign up or log in using Google or email/password.
- Navigate to the **Story Editor** to create a story.
- Click **Generate Story** to use AI-powered writing assistance.
- Switch to **Image Generator** to create images based on story descriptions.
- Save stories and images to your account.


## Future Enhancements
- Add multi-user collaboration.
- Implement a **comic panel generator**.
- Allow more **customization** of AI-generated content.
