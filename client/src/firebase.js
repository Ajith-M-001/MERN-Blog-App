// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2c591.firebaseapp.com",
  projectId: "mern-blog-2c591",
  storageBucket: "mern-blog-2c591.appspot.com",
  messagingSenderId: "867714381081",
  appId: "1:867714381081:web:0cb7673db94f40930fc188",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
