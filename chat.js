/* ================================
   📌 CONFIGURAÇÕES INICIAIS
==================================*/

const db = window.firebaseDB;
const col = window.firebaseCollection;
const sendDB = window.firebaseAddDoc;
const q = window.firebaseQuery;
const ord = window.firebaseOrderBy;
const listen = window.firebaseOnSnapshot;

let currentRoom = "publica";     // sala atual
let currentPass = "";            // senha da sala privada
let secretKey = null;            // chave AES
let userID = null;               // ID do visitante
let lastTimestamp = 0;

/* ================================
   📌 ELEMENTOS DO HTML
==================================*/
const messagesEl = document.getElementById("messages");
const msgInput = document.getElementById("msg-input");
const codinomeEl = document.getElementById("codinome");
const avatarSel = document.getElementById("avatar-select");

const sendPublicBtn = document.getElementById("send-public");
const sendSecretBtn = document.getElementById("send-secret");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");
const themeSelect = document.getElementById("theme");
const peopleCountEl = document.getElementById("people-count");
const convoCountEl = document.getElementById("convo-count");
const lastAction = document.getElementById("last-action");
const roomTag = document.getElementById("room-tag");

const enterRoomBtn = document.getElementById("enter-room");
const roomPassEl = document.getElementById("room-pass");

/* ================================
   ✅ LOGIN ANÔNIMO PRONTO
==================================*/
window.firebaseAuth.onAuthStateChanged((user) => {
  if (user) {
    userID = user.uid;
    console.log("Usuário logado:", user.uid);
    initChat();
  }
});

/* ================================
   ✅ FUNÇÃO INICIAL
==================================*/
function initChat() {
  startRoom("publica");
  generateKey("default"); // chave de backup
  setupListeners();
}

/* ================================
   ✅ TROCAR DE SALA (pública/privada)
==================================*/
enterRoomBtn.addEventListener("click", () => {
  const pass = roomPassEl.value.trim();

  if (pass.length === 0) {
    currentRoom = "publica";
    roomTag.textContent = "Sala: pública";
    startRoom("publica");
    return;
  }

  // entrar na sala privada
  currentRoom = "privada-" + pass;
  currentPass = pass;

  roomTag.textContent = "Sala privada";
  generateKey(pass); // nova chave de criptografia para esta sala

  startRoom(currentRoom);
});

/* ================================
   ✅ OUVINTE DA SALA ATUAL
==================================*/
let unsubscribe = null;

function startRoom(roomName) {
  if (unsubscribe) unsubscribe(); // remove ouvinte anterior
  messagesEl.innerHTML = "";

  const ref = col(db, "salas", roomName, "mensagens");
  const queryRoom = q(ref, ord("timestamp"));

  unsubscribe = listen(queryRoom, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type === "added") {
        renderMessage(change.doc.data());
      }
    });

    lastTimestamp = Date.now();
    updateConvoCount(snap.size);
  });

  updatePeopleCount();
}

/* ================================
   ✅ LISTENERS DE EVENTOS
==================================*/
function setupListeners() {

  sendPublicBtn.addEventListener("click", () => trySend(false));
  sendSecretBtn.addEventListener("click", () => trySend(true));

  msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") trySend(false);
  });

  attachBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", handleImageUpload);

  themeSelect.addEventListener("change", () => {
    document.body.setAttribute("data-theme", themeSelect.value);
  });
}

/* ================================
   ✅ ENVIAR MENSAGEM
==================================*/
async function trySend(isSecret) {
  const text = msgInput.value.trim();
  const codinome = codinomeEl.value.trim() || "Anônimo";
  const avatar = avatarSel.value;

  if (text.length === 0) return;

  const encrypted = await encryptText(text);

  await sendDB(col(db, "salas", currentRoom, "mensagens"), {
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

  // BOT automático
  botAutoResponse(text, isSecret, codinome);
}

/* ================================
   ✅ UPLOAD DE IMAGEM
==================================*/
async function handleImageUpload() {
  const file = fileInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Apenas imagens permitidas.");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert("Imagem muito grande. Máximo 2MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const codinome = codinomeEl.value.trim() || "Anônimo";
    const avatar = avatarSel.value;

    const encrypted = await encryptText(reader.result);

    await sendDB(col(db, "salas", currentRoom, "mensagens"), {
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

/* ================================
   ✅ CRIPTOGRAFIA AES-GCM
==================================*/
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
    return "[ERRO: não foi possível descriptografar]";
  }
}

/* ================================
   ✅ EXPORTAR MENSAGENS
==================================*/
window.exportPublic = () => exportChat(false);
window.exportSecret = () => exportChat(true);

/* =======================================================
   ✅ RENDERIZAÇÃO DAS MENSAGENS
=======================================================*/
async function renderMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("msg");

  // usuário ou bot?
  if (msg.uid === "BOT") div.classList.add("bot");
  else div.classList.add("user");

  if (msg.secret) div.classList.add("secret");

  const avatarImg = getAvatar(msg.avatar);

  // descriptografar conteúdo
  const text = await decryptText(msg.text);

  const html =
    `<div class="avatar"><img src="${avatarImg}"></div>
     <div class="bubble">
       <div class="meta">${msg.codinome}</div>
       ${
         msg.type === "img"
           ? `<img src="${text}" style="max-width:240px;border-radius:6px;">`
           : `<div class="text">${text}</div>`
       }
     </div>`;

  div.innerHTML = html;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

/* =======================================================
   ✅ AVATARES
=======================================================*/
function getAvatar(code) {
  switch (code) {
    case "hacker1": return "https://i.imgur.com/Qf6bH4y.png";
    case "hacker2": return "https://i.imgur.com/ZmZx0sU.png";
    case "hood":    return "https://i.imgur.com/n36UodL.png";
    default:        return "https://i.imgur.com/8Qf2QYK.png";
  }
}

/* =======================================================
   ✅ BOT AUTOMÁTICO AGENTE-X
=======================================================*/
async function botAutoResponse(text, isSecret, codinome) {
  let resp = "";

  text = text.toLowerCase();

  if (text.includes("oi") || text.includes("ola"))
    resp = "Saudações, agente.";
  else if (text.includes("ajuda"))
    resp = "Envie o código da missão para consulta.";
  else if (text.includes("missão"))
    resp = "Missão confirmada. Processando...";
  else if (text.includes("quem sou eu"))
    resp = `Você é ${codinome}, agente classificado.`;
  else
    resp = "Mensagem recebida. Operação em andamento.";

  const encrypted = await encryptText(resp);

  await sendDB(col(db, "salas", currentRoom, "mensagens"), {
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

/* =======================================================
   ✅ CONTADORES
=======================================================*/
function updatePeopleCount() {
  peopleCountEl.textContent = "PESSOAS: ~1";
}

function updateConvoCount(n) {
  convoCountEl.textContent = "Conversas: " + n;
}

/* =======================================================
   ✅ PARTICIPANTES (lista lateral)
=======================================================*/
listen(col(db, "statusOnline"), (snap) => {
  const container = document.getElementById("participants");
  container.innerHTML = "";

  snap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "participant";

    const avatar = getAvatar(data.avatar || "default");

    div.innerHTML = `
      <img src="${avatar}">
      <div>
        <div>${data.codinome}</div>
        <div class="small">Sala: ${data.room}</div>
      </div>
    `;

    container.appendChild(div);
  });
});

/* =======================================================
   ✅ REGISTRO DE AÇÕES
=======================================================*/
function registerAction(text) {
  lastAction.textContent = text + " (" + new Date().toLocaleTimeString() + ")";
}

/* =======================================================
   ✅ EXPORTAR HISTÓRICO
=======================================================*/
async function exportChat(isSecret) {
  const ref = col(db, "salas", currentRoom, "mensagens");
  const qs = await window.firebaseOnSnapshot;

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

/* =======================================================
   ✅ SONS
=======================================================*/
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