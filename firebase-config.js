import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBGO3uGnSwvM8NHnLTzNBZUTrm1NovvyUI",
  authDomain: "login-729e2.firebaseapp.com",
  projectId: "login-729e2",
  storageBucket: "login-729e2.appspot.com",
  messagingSenderId: "337267271060",
  appId: "1:337267271060:web:0ce6a83ab3eaf1f7a0db81"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
