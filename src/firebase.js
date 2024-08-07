import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYmDXZAksyI_ktohTZ5GfsvOkN_Ib72as",
  authDomain: "gpt-4-2772b.firebaseapp.com",
  projectId: "gpt-4-2772b",
  storageBucket: "gpt-4-2772b.appspot.com",
  messagingSenderId: "697268118038",
  appId: "1:697268118038:web:83c4ba7ce9c501dc144b37",
  measurementId: "G-QDQJ4MJPYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        email: result.user.email,
        displayName: result.user.displayName || '',
        createdAt: new Date()
      });
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};

// Register with email and password
const registerWithEmailAndPassword = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: username,
    });
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      username: username,
      createdAt: new Date()
    });
    return userCredential.user;
  } catch (error) {
    console.error("Error registering:", error.message);
    throw error;
  }
};

// Login with email and password
const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

// Logout
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

// Save a story and images
const saveStory = async (userId, storyContent, imageUrl) => {
  try {
    const userData = {
      mainStory: storyContent,
      updatedAt: new Date(),
    };
    if (imageUrl && imageUrl.length > 0) {
      userData.imageUrl = imageUrl;
    }
    await setDoc(doc(db, "users", userId), userData, { merge: true });
    console.log("Story saved successfully");
  } catch (error) {
    console.error("Error saving story:", error);
    throw error;
  }
};

const saveNewStory = async (userId, title, storyContent, imageUrls) => {
  try {
    const newStoryId = Date.now().toString();
    
    // Ensure the first entry has the role 'User'
    const updatedStoryContent = [{ role: "User", content: storyContent[0].content }, ...storyContent.slice(1)];

    // Save the story and title in JSON format to Firebase Storage
    const storyData = {
      title: title || `Story-${newStoryId}`,
      story: updatedStoryContent
    };
    const storyJsonBlob = new Blob([JSON.stringify(storyData)], { type: 'application/json' });
    const storyRef = ref(storage, `${userId}/stories/${newStoryId}/${newStoryId}.json`);
    await uploadBytes(storyRef, storyJsonBlob);

    // Save the images associated with the story to Firebase Storage
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const imageRef = ref(storage, `${userId}/images/${newStoryId}/${i}.jpg`);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
    }

    // Save the story metadata to Firestore
    const storyMetadata = {
      title: title || `Story-${newStoryId}`,
      storyId: newStoryId,
      createdAt: new Date(),
    };
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    const stories = userData.stories || [];
    stories.push(storyMetadata);
    await updateDoc(userDocRef, { stories });
  } catch (error) {
    console.error('Error saving new story:', error);
  }
};

// Fetch all stories for a user
const fetchAllStories = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return [];
    }
    
    const userData = userDoc.data();
    const stories = userData.stories || [];
    
    const fetchedStories = [];

    for (const story of stories) {
      const storyRef = ref(storage, `${userId}/stories/${story.storyId}/${story.storyId}.json`);
      try {
        const storyUrl = await getDownloadURL(storyRef);
        const response = await fetch(storyUrl);
        const storyData = await response.json();
        const imageUrls = await fetchImageUrls(userId, story.storyId);
        fetchedStories.push({ id: story.storyId, ...storyData, images: imageUrls });
      } catch (error) {
        console.error(`Error fetching story ${story.storyId}:`, error);
      }
    }

    return fetchedStories;
  } catch (error) {
    console.error("Error fetching all stories:", error);
    throw error;
  }
};

// Fetch image URLs for a specific story
const fetchImageUrls = async (userId, storyId) => {
  try {
    const imagesRef = ref(storage, `${userId}/images/${storyId}`);
    const imagesList = await listAll(imagesRef);
    const imageUrls = await Promise.all(imagesList.items.map(item => getDownloadURL(item)));
    return imageUrls;
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    return [];
  }
};

// Fetch the main story and images
const fetchStory = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        story: data.mainStory || '',
        images: data.imageUrl || [],
      };
    }
    return { story: '', images: [] };
  } catch (error) {
    console.error("Error fetching story: ", error);
    return { story: '', images: [] };
  }
};

export { 
  auth,
  db, 
  signInWithGoogle, 
  registerWithEmailAndPassword, 
  loginWithEmailAndPassword, 
  logout, 
  saveStory, 
  fetchStory, 
  saveNewStory, 
  fetchAllStories 
};
