// ============================================================
// Cyber-Nexis | Chat com Firebase e renderização segura
// ============================================================

import { auth, db } from "./firebase-config.js";
import { onUserReady } from "./site.js";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const messagesEl = document.getElementById("messages");
const form = document.getElementById("message-form");
const msgInput = document.getElementById("message-input");
const codinomeEl = document.getElementById("codinome");
const avatarSelect = document.getElementById("avatar-select");
const attachButton = document.getElementById("attach-button");
const fileInput = document.getElementById("file-input");
const roomPassEl = document.getElementById("room-pass");
const enterRoomButton = document.getElementById("enter-room");
const roomTag = document.getElementById("room-tag");
const chatStatus = document.getElementById("chat-status");
const messageCount = document.getElementById("message-count");
const participantCount = document.getElementById("participant-count");

let currentUser = null;
let currentRoom = "publica";
let roomLabel = "pública";
let roomKey = null;
let unsubscribe = null;
let renderedIds = new Set();

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function setStatus(message, type = "") {
  chatStatus.textContent = message;
  chatStatus.className = `status-message ${type}`.trim();
}

function safeName(value) {
  return (value || "Anônimo").trim().slice(0, 30) || "Anônimo";
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sha256Hex(text) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function deriveRoomKey(passphrase) {
  const salt = encoder.encode("cyber-nexis-chat-v1");
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 160000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function configureRoom(passphrase = "") {
  if (!passphrase.trim()) {
    currentRoom = "publica";
    roomLabel = "pública";
    roomKey = await deriveRoomKey("cyber-nexis-public-room");
  } else {
    const roomHash = await sha256Hex(`room:${passphrase.trim()}`);
    currentRoom = `privada-${roomHash.slice(0, 32)}`;
    roomLabel = "privada";
    roomKey = await deriveRoomKey(`key:${passphrase.trim()}`);
  }

  roomTag.textContent = `Sala: ${roomLabel}`;
  startListener();
}

async function encryptPayload(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    roomKey,
    encoder.encode(text)
  );

  const output = new Uint8Array(iv.length + encrypted.byteLength);
  output.set(iv, 0);
  output.set(new Uint8Array(encrypted), iv.length);
  return bytesToBase64(output);
}

async function decryptPayload(payload) {
  try {
    const bytes = base64ToBytes(payload);
    const iv = bytes.slice(0, 12);
    const content = bytes.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, roomKey, content);
    return decoder.decode(decrypted);
  } catch (error) {
    return "[mensagem não pôde ser descriptografada nesta sala]";
  }
}

function clearMessages() {
  renderedIds = new Set();
  messagesEl.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = "Nenhuma transmissão ainda. O canal está em silêncio.";
  messagesEl.appendChild(empty);
}

function removeEmptyState() {
  const empty = messagesEl.querySelector(".empty-state");
  if (empty) empty.remove();
}

function formatTime(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date();
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

async function renderMessage(doc) {
  if (renderedIds.has(doc.id)) return;
  renderedIds.add(doc.id);
  removeEmptyState();

  const data = doc.data();
  const decrypted = await decryptPayload(data.payload || "");
  const isMine = data.uid && currentUser && data.uid === currentUser.uid;

  const row = document.createElement("article");
  row.className = `message ${isMine ? "mine" : ""}`.trim();

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = (data.avatar || "CN").slice(0, 2);

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const meta = document.createElement("div");
  meta.className = "message-meta";

  const name = document.createElement("span");
  name.textContent = safeName(data.codinome);

  const time = document.createElement("time");
  time.textContent = formatTime(data.timestamp);

  meta.append(name, time);
  bubble.appendChild(meta);

  if (data.type === "image" && decrypted.startsWith("data:image/")) {
    const image = document.createElement("img");
    image.className = "message-image";
    image.alt = "Imagem enviada no chat";
    image.src = decrypted;
    bubble.appendChild(image);
  } else {
    const text = document.createElement("div");
    text.className = "message-text";
    text.textContent = decrypted;
    bubble.appendChild(text);
  }

  row.append(avatar, bubble);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function roomCollection() {
  return collection(db, "salas", currentRoom, "mensagens");
}

function startListener() {
  if (unsubscribe) unsubscribe();
  clearMessages();
  setStatus("Sincronizando sala...");

  const q = query(roomCollection(), orderBy("timestamp", "asc"));
  unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") renderMessage(change.doc);
    });
    messageCount.textContent = `Mensagens: ${snapshot.size}`;
    participantCount.textContent = "Pessoas: 1+";
    setStatus("Conectado.", "ok");
  }, (error) => {
    console.error(error);
    setStatus("Erro ao ouvir mensagens. Confira regras do Firestore.", "error");
  });
}

async function sendText() {
  const text = msgInput.value.trim();
  if (!text || !currentUser) return;

  const payload = await encryptPayload(text);
  await addDoc(roomCollection(), {
    uid: currentUser.uid,
    codinome: safeName(codinomeEl.value || currentUser.displayName),
    avatar: avatarSelect.value,
    type: "text",
    payload,
    timestamp: serverTimestamp(),
  });

  msgInput.value = "";
  msgInput.focus();
}

async function sendImage(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus("Envie apenas imagens.", "error");
    return;
  }
  if (file.size > 900 * 1024) {
    setStatus("Imagem muito grande. Use até 900 KB para não pesar o Firestore.", "error");
    return;
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const payload = await encryptPayload(dataUrl);
  await addDoc(roomCollection(), {
    uid: currentUser.uid,
    codinome: safeName(codinomeEl.value || currentUser.displayName),
    avatar: avatarSelect.value,
    type: "image",
    payload,
    timestamp: serverTimestamp(),
  });

  fileInput.value = "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await sendText();
  } catch (error) {
    console.error(error);
    setStatus("Falha ao enviar mensagem.", "error");
  }
});

msgInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

attachButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => sendImage(fileInput.files[0]).catch((error) => {
  console.error(error);
  setStatus("Falha ao enviar imagem.", "error");
}));

enterRoomButton.addEventListener("click", () => {
  configureRoom(roomPassEl.value).catch((error) => {
    console.error(error);
    setStatus("Não foi possível trocar de sala.", "error");
  });
});

onUserReady(async (user) => {
  if (!user) return;
  currentUser = user;
  codinomeEl.value = user.displayName || "Operador";
  await configureRoom("");
});
