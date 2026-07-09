// firebase-config.js
// Configuração central do Firebase para login, cadastro e banco de dados

import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


// Configuração do projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByD_6ISHV9M0AmWsasy4ITfH597q2g4Qw",
  authDomain: "cybernexischat001.firebaseapp.com",
  projectId: "cybernexischat001",
  storageBucket: "cybernexischat001.firebasestorage.app",
  messagingSenderId: "781207322583",
  appId: "1:781207322583:web:685bfbdd7a58bb7957d592"
};


// Evita inicializar o Firebase mais de uma vez
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


// Serviços principais
const auth = getAuth(app);
const db = getFirestore(app);


// Exportações usadas pelo site.js
export { app, auth, db };
export default app;