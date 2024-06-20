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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

// Save a new story with title and images
const saveNewStory = async (userId, title, storyContent, imageUrls) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const stories = userDoc.exists() && userDoc.data().stories ? userDoc.data().stories : [];
    
    const newStoryId = `${Date.now()}`;
    const newStory = {
      id: newStoryId,
      title: title || `Story-${newStoryId}`,
      content: storyContent,
      images: [],
      createdAt: new Date(),
    };

    stories.push(newStory);
    await updateDoc(userDocRef, { stories });

    for (const imageUrl of imageUrls) {
      await saveImage(userId, imageUrl, newStoryId);
    }

    console.log("New story saved successfully");
  } catch (error) {
    console.error("Error saving new story:", error);
    throw error;
  }
};

// Save image to Firebase Storage and Firestore
const saveImage = async (userId, imageUrl, storyId) => {
  try {
    const imageRef = ref(storage, `images/${userId}/${storyId}/${Date.now()}.jpg`);
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    const stories = userData.stories || [];
    const storyIndex = stories.findIndex(story => story.id === storyId);

    if (storyIndex !== -1) {
      stories[storyIndex].images = stories[storyIndex].images || [];
      stories[storyIndex].images.push(downloadURL);
      await updateDoc(userDocRef, { stories });
      console.log("Image URL saved in Firestore");
    } else {
      console.error("Story not found");
    }
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
};

// Fetch images for a story
const fetchImages = async (userId, storyId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const stories = userDoc.data().stories || [];
      const story = stories.find(story => story.id === storyId);
      return story ? story.images : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
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

// Fetch all stories for a user
const fetchAllStories = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().stories || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching all stories:", error);
    throw error;
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
  fetchAllStories, 
  saveImage, 
  fetchImages 
};
