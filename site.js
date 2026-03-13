import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


// LOGIN
export async function login(email, senha) {

  if (!email || !senha) {
    throw new Error("Email e senha são obrigatórios.");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, senha);

  return userCredential;

}


// REGISTRO
export async function register(email, senha) {

  if (!email || !senha) {
    throw new Error("Email e senha são obrigatórios.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user",
    createdAt: Date.now()
  });

  return userCredential;

}


// PROTEGER PÁGINA
export function protectPage(redirect = "login.html") {

  onAuthStateChanged(auth, (user) => {

    if (!user) {
      window.location.href = redirect;
    }

  });

}


// LOGOUT
export async function logout() {

  await signOut(auth);

  window.location.href = "login.html";

}


// BUSCAR USUÁRIO
export async function getUserData(uid) {

  if (!uid) return null;

  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;

}


// USUÁRIO ATUAL
export function getCurrentUser(callback) {

  onAuthStateChanged(auth, (user) => {
    callback(user);
  });

}
