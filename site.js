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
export async function login(email, senha) {

  if (!email || !senha) {
    throw new Error("Email e senha são obrigatórios.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential;

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }

}


// REGISTRO + CRIAÇÃO NO FIRESTORE
export async function register(email, senha) {

  if (!email || !senha) {
    throw new Error("Email e senha são obrigatórios.");
  }

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user",
      createdAt: Date.now()
    });

    return userCredential;

  } catch (error) {

    console.error("Erro ao registrar:", error);
    throw error;

  }

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

  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro ao sair:", error);
  }

}


// BUSCAR DADOS DO USUÁRIO
export async function getUserData(uid) {

  if (!uid) return null;

  try {

    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;

  } catch (error) {

    console.error("Erro ao buscar usuário:", error);
    return null;

  }

}


// PEGAR USUÁRIO ATUAL
export function getCurrentUser(callback) {

  onAuthStateChanged(auth, (user) => {
    callback(user);
  });

}
