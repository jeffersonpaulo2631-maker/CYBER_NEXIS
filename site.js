import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const db = getFirestore();

// LOGIN
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

// REGISTRO + CRIAÇÃO NO FIRESTORE
export async function register(email, senha) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user",
    createdAt: new Date()
  });

  return userCredential;
}

// PROTEGER PÁGINA
export function protectPage(redirect = "login.html") {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = redirect;
    }
  });
}

// LOGOUT
export function logout() {
  return signOut(auth);
}

// BUSCAR DADOS DO USUÁRIO
export async function getUserData(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  return snapshot.exists() ? snapshot.data() : null;
}