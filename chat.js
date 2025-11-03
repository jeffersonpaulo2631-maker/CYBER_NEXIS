/* =====================================================
   ✅ REFERÊNCIAS DO FIREBASE (VINDO DE firebase.js)
=====================================================*/
const db = window.firebaseDB;
const col = window.firebaseCollection;
const addDB = window.firebaseAddDoc;
const q = window.firebaseQuery;
const ord = window.firebaseOrderBy;
const listen = window.firebaseOnSnapshot;

/* =====================================================
   ✅ VARIÁVEIS GLOBAIS
=====================================================*/
let currentRoom = "publica";
let roomPassword = "";
let secretKey = null;    // chave AES da sala
let userID = null;
let unsubscribe = null;

/* =====================================================
   ✅ ELEMENTOS HTML
=====================================================*/
const messagesEl = document.getElementById("messages");
const msgInput = document.getElementById("msg-input");
const codinomeEl = document.getElementById("codinome");
const avatarSel = document.getElementById("avatar-select");

const sendPublicBtn = document.getElementById("send-public");
const sendSecretBtn = document.getElementById("send-secret");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");

const themeSelect = document.getElementById("theme");
const lastAction = document.getElementById("last-action");
const convoCountEl = document.getElementById("convo-count");
const peopleCountEl = document.getElementById("people-count");
const roomTag = document.getElementById("room-tag");

// Salas privadas
const roomPassEl = document.getElementById("room-pass");
const enterRoomBtn = document.getElementById("enter-room");

/* =====================================================
   ✅ LOGIN ANÔNIMO DO FIREBASE
=====================================================*/
window.firebaseAuth.onAuthStateChanged(user => {
  if (user) {
    userID = user.uid;
    initChat();
  }
});

/* =====================================================
   ✅ INICIAR SISTEMA DE CHAT
=====================================================*/
function initChat() {
  generateKey("default");   // chave da sala pública
  startRoom("publica");
  setupListeners();
}

/* =====================================================
   ✅ TROCAR ENTRE SALA PÚBLICA E PRIVADA
=====================================================*/
enterRoomBtn.addEventListener("click", () => {
  const pass = roomPassEl.value.trim();

  if (pass.length === 0) {
    // voltar para sala pública
    currentRoom = "publica";
    roomTag.textContent = "Sala: pública";
    generateKey("default");
    startRoom("publica");
    return;
  }

  // sala privada com senha
  currentRoom = "privada-" + pass;
  roomPassword = pass;
  roomTag.textContent = "Sala privada";

  generateKey(pass);
  startRoom(currentRoom);
});

/* =====================================================
   ✅ INICIAR OUVIDOR DA SALA
=====================================================*/
function startRoom(roomName) {

  // cancela ouvinte anterior
  if (unsubscribe) unsubscribe();

  messagesEl.innerHTML = "";

  const ref = col(db, "salas", roomName, "mensagens");
  const queryRoom = q(ref, ord("timestamp"));

  unsubscribe = listen(queryRoom, snap => {
    snap.docChanges().forEach(change => {
      if (change.type === "added") {
        renderMessage(change.doc.data());
      }
    });

    convoCountEl.textContent = "Conversas: " + snap.size;
  });

  // contagem de pessoas fictícia
  peopleCountEl.textContent = "Pessoas: ~1";
}

/* =====================================================
   ✅ LISTENERS DE BOTÕES
=====================================================*/
function setupListeners() {
  sendPublicBtn.addEventListener("click", () => trySend(false));
  sendSecretBtn.addEventListener("click", () => trySend(true));

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") trySend(false);
  });

  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleImageUpload);

  themeSelect.addEventListener("change", () => {
    document.body.setAttribute("data-theme", themeSelect.value);
  });
}

/* =====================================================
   ✅ ENVIAR MENSAGEM (PÚBLICA OU SECRETA)
=====================================================*/
async function trySend(isSecret) {
  const text = msgInput.value.trim();
  if (text.length === 0) return;

  const codinome = codinomeEl.value.trim() || "Anônimo";
  const avatar = avatarSel.value;

  const encrypted = await encryptText(text);

  await addDB(col(db, "salas", currentRoom, "mensagens"), {
    uid: userID,
    codinome,
    avatar,
    text: encrypted,
    secret: isSecret,
    type: "text",
    timestamp: Date.now()
  });

  msgInput.value = "";
  playUserSound();
  registerAction("Enviou uma mensagem");

  botAutoResponse(text, isSecret, codinome);
}

/* =====================================================
   ✅ ENVIO DE IMAGENS
=====================================================*/
async function handleImageUpload() {
  const file = fileInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Apenas imagens!");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Máximo permitido: 2MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result;

    const encrypted = await encryptText(base64);
    const codinome = codinomeEl.value.trim() || "Anônimo";
    const avatar = avatarSel.value;

    await addDB(col(db, "salas", currentRoom, "mensagens"), {
      uid: userID,
      codinome,
      avatar,
      text: encrypted,
      secret: true,
      type: "img",
      timestamp: Date.now()
    });

    playUserSound();
  };

  reader.readAsDataURL(file);
}

/* =====================================================
   ✅ CRIPTOGRAFIA AES-GCM
=====================================================*/
async function generateKey(pass) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(pass));

  secretKey = await crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(text);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    secretKey,
    data
  );

  return btoa(
    String.fromCharCode(...iv, ...new Uint8Array(encrypted))
  );
}

async function decryptText(encoded) {
  try {
    const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    const iv = bytes.slice(0, 12);
    const content = bytes.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      secretKey,
      content
    );

    return new TextDecoder().decode(decrypted);

  } catch (e) {
    return "[Falha ao descriptografar]";
  }
}

/* =====================================================
   ✅ RENDERIZAÇÃO DAS MENSAGENS
=====================================================*/
async function renderMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("msg");

  if (msg.uid === "BOT") div.classList.add("bot");
  else div.classList.add("user");

  if (msg.secret) div.classList.add("secret");

  const avatarImg = getAvatar(msg.avatar);
  const text = await decryptText(msg.text);

  div.innerHTML = `
    <div class="avatar"><img src="${avatarImg}"></div>
    <div class="bubble">
      <div class="meta">${msg.codinome}</div>
      ${
        msg.type === "img"
        ? `<img src="${text}" class="img-msg">`
        : `<div class="text">${text}</div>`
      }
    </div>
  `;

  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

/* =====================================================
   ✅ AVATARES
=====================================================*/
function getAvatar(code) {
  switch (code) {
    case "hacker1": return "https://i.imgur.com/Qf6bH4y.png";
    case "hacker2": return "https://i.imgur.com/ZmZx0sU.png";
    case "hood":    return "https://i.imgur.com/n36UodL.png";
    default:        return "https://i.imgur.com/8Qf2QYK.png";
  }
}

/* =====================================================
   ✅ BOT AGENTE-X
=====================================================*/
async function botAutoResponse(text, isSecret, codinome) {

  let resp = "Mensagem recebida.";

  const t = text.toLowerCase();

  if (t.includes("oi") || t.includes("ola")) resp = "Saudações, agente.";
  else if (t.includes("ajuda")) resp = "Envie o código da missão.";
  else if (t.includes("missão")) resp = "Processando sua solicitação...";
  else if (t.includes("quem sou eu")) resp = `Você é ${codinome}.`;

  const encrypted = await encryptText(resp);

  await addDB(col(db, "salas", currentRoom, "mensagens"), {
    uid: "BOT",
    codinome: "Agente-X",
    avatar: "hacker2",
    text: encrypted,
    secret: isSecret,
    type: "text",
    timestamp: Date.now()
  });

  playBotSound();
}

/* =====================================================
   ✅ LOG DE AÇÃO
=====================================================*/
function registerAction(action) {
  lastAction.textContent =
    action + " (" + new Date().toLocaleTimeString() + ")";
}

/* =====================================================
   ✅ EXPORTAR CONVERSAS
=====================================================*/
window.exportPublic = () => exportChat(false);
window.exportSecret = () => exportChat(true);

function exportChat(isSecret) {
  const lines = [];

  messagesEl.querySelectorAll(".msg").forEach(el => {
    if (isSecret && !el.classList.contains("secret")) return;
    lines.push(el.innerText.replace(/\n+/g, " "));
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = isSecret ? "chat_secreto.txt" : "chat_publico.txt";
  a.click();

  URL.revokeObjectURL(url);
}

/* =====================================================
   ✅ SONS
=====================================================*/
function playUserSound() {
  const snd = document.getElementById("snd-user");
  snd.src = "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";
  snd.play();
}

function playBotSound() {
  const snd = document.getElementById("snd-bot");
  snd.src = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
  snd.play();
}
