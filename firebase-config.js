import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGO3uGnSwvM8NHnLTzNBZUTrm1NovvyUI",
  authDomain: "login-729e2.firebaseapp.com",
  projectId: "login-729e2",
  storageBucket: "login-729e2.firebasestorage.app",
  messagingSenderId: "337267271060",
  appId: "1:337267271060:web:0ce6a83ab3eaf1f7a0db81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
