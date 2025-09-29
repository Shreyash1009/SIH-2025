import { initializeApp } from "firebase/app";
// 👇 1. IMPORT the getAuth function
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWhDfoedXM7zlz-tgcIpqddt_UmAUbUHk",
  authDomain: "ocean-hazard-app.firebaseapp.com",
  projectId: "ocean-hazard-app",
  storageBucket: "ocean-hazard-app.appspot.com", // Corrected the storage bucket name
  messagingSenderId: "530645472061",
  appId: "1:530645472061:web:0896da4e1e450b3d99eb54",
  measurementId: "G-FPQQH3EL9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👇 2. INITIALIZE and EXPORT the auth service
export const auth = getAuth(app);