// ============================================================
// Cyber-Nexis | Firebase centralizado
// Use este arquivo em TODAS as páginas que precisarem de login/chat.
// ============================================================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Projeto Firebase unificado.
// A apiKey do Firebase web não é senha secreta, mas suas REGRAS do Firestore/Auth precisam estar corretas.
const firebaseConfig = {
  apiKey: "AIzaSyByD_6ISHV9M0AmWsasy4ITfH597q2g4Qw",
  authDomain: "cybernexischat001.firebaseapp.com",
  projectId: "cybernexischat001",
  storageBucket: "cybernexischat001.firebasestorage.app",
  messagingSenderId: "781207322583",
  appId: "1:781207322583:web:685bfbdd7a58bb7957d592",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Persistência do Firebase não pôde ser aplicada:", error);
});

export { app, auth, db };
