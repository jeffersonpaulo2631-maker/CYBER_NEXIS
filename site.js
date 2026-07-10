// ============================================================
// Cyber-Nexis | Autenticação e proteção de páginas
// ============================================================

import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

export function getCurrentUser() {
  return auth.currentUser;
}

export function onUserReady(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email, password, displayName = "Operador") {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
}

export async function loginAnonimo() {
  return signInAnonymously(auth);
}

export async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

export function protectPage(loginPath = "login.html") {
  return onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = loginPath;
  });
}

export function redirectIfLoggedIn(targetPath = "index.html") {
  return onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = targetPath;
  });
}

export function bindLogoutButton(buttonId = "logout") {
  const button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await logout();
    } catch (error) {
      console.error(error);
      button.disabled = false;
      alert("Não foi possível sair agora.");
    }
  });
}
