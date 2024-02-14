// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJfYtc1dgqLK6ZqtkUxZD1ofN6L3eefgk",
  authDomain: "weather-app-24168.firebaseapp.com",
  projectId: "weather-app-24168",
  storageBucket: "weather-app-24168.appspot.com",
  messagingSenderId: "128810117866",
  appId: "1:128810117866:web:f0a14cf51070bf155f4593",
  measurementId: "G-5MBJLW0J1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);