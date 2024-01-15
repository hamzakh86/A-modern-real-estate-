// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate0.firebaseapp.com",
  projectId: "mern-estate0",
  storageBucket: "mern-estate0.appspot.com",
  messagingSenderId: "755146837858",
  appId: "1:755146837858:web:fb2f9f52e537303aa2a63b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);