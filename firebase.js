import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { 
  getAuth, signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

/* CONFIGURAÇÃO DO JEFFERSON */
const firebaseConfig = {
  apiKey: "AIzaSyByD_6ISHV9M0AmWsasy4ITfH597q2g4Qw",
  authDomain: "cybernexischat001.firebaseapp.com",
  projectId: "cybernexischat001",
  storageBucket: "cybernexischat001.firebasestorage.app",
  messagingSenderId: "781207322583",
  appId: "1:781207322583:web:685bfbdd7a58bb7957d592"
};

/* Inicializa */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* Login anônimo */
signInAnonymously(auth).then(()=>{
  console.log("✅ Login anônimo ok");
});

window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseCollection = collection;
window.firebaseAddDoc = addDoc;
window.firebaseQuery = query;
window.firebaseOrderBy = orderBy;
window.firebaseOnSnapshot = onSnapshot;