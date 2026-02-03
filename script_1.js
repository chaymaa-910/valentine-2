console.log("script chargé");

/* ========= PERSONNALISATION ========= */
const NAME = "Ma Baby";

const NO_MESSAGES = [
  "Tu es sûre ? 🥺",
  "Réfléchis encore un peu s’il te plaît 😌",
  "Je te promets de te rendre heureuse ✨",
  "Allez… dis oui 😭",
  "Dernière chance 😳"
];
const MAX_NO = 5;

const GIFS = [
  "https://media.tenor.com/E90r971nBbIAAAAm/kiss-lip-kiss.webp",
  "https://media.tenor.com/pmDABQ5c8ZwAAAAm/sappy-sappy-seals.webp",
  "https://media.tenor.com/s9JMdKB5mV8AAAAm/y%C3%AAuu.webp",
  "https://media.tenor.com/PQUnS1_hprEAAAAm/pengu-pudgy.webp",
  "https://media1.tenor.com/m/LGXVwQg0cb0AAAAd/%EB%AA%A8%EC%B0%8C%EB%83%A5.gif",
  "https://media.tenor.com/06lgodZaTagAAAAm/witch-watch.webp"
];

/* ========= ELEMENTS ========= */
const sceneEnvelope = document.getElementById("sceneEnvelope");
const sceneQuestion = document.getElementById("sceneQuestion");
const sceneYay      = document.getElementById("sceneYay");

const envelope = document.getElementById("envelope");
const titleEl  = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

const gifGrid = document.getElementById("gifGrid");

const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

const hackOverlay = document.getElementById("hackOverlay");
const hackBox = document.getElementById("hackBox");
const hackText = document.getElementById("hackText");
const hackBarFill = document.getElementById("hackBarFill");
const hackFooter = document.getElementById("hackFooter");

/* ========= SCÈNES ========= */
function show(scene){
  [sceneEnvelope, sceneQuestion, sceneYay].forEach(s => s.classList.remove("active"));
  scene.classList.add("active");
}

/* Titre */
if (NAME && NAME.trim().length){
  titleEl.textContent = `${NAME}, veux-tu être ma Valentine ?`;
} else {
  titleEl.textContent = `Veux-tu être ma Valentine ?`;
}

/* OUI bloqué au début */
yesBtn.classList.add("disabled");

/* ========= ENVELOPPE ========= */
envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => show(sceneQuestion), 650);
});

/* ========= OVERLAY "FAKE" ========= */
const HACK_TOTAL_DURATION = 5200;

function showFakeHackOverlay() {
  const lines = [
    "Très bien… tu as déclenché le mode drama 😈",
    "Initialisation du module bisous.exe 😘",
    "Analyse du cœur en cours… ✅",
    "Téléchargement des câlins…",
    "Erreur critique : le NON est interdit 🚫",
    "Finalisation… il ne reste que OUI 💖"
  ];

  hackOverlay.classList.add("show");
  hackOverlay.setAttribute("aria-hidden", "false");
  hackBox.classList.add("shake");

  hackBarFill.style.width = "0%";
  hackText.textContent = lines[0];
  hackFooter.textContent = "PROGRESSION : CHARGEMENT...";

  const start = performance.now();

  const timer = setInterval(() => {
    const elapsed = performance.now() - start;

    const step = Math.min(lines.length - 1, Math.floor(elapsed / 850));
    hackText.textContent = lines[step];

    const percent = Math.min(100, Math.floor((elapsed / HACK_TOTAL_DURATION) * 100));
    hackBarFill.style.width = percent + "%";

    if (elapsed >= HACK_TOTAL_DURATION) {
      clearInterval(timer);
      hackBarFill.style.width = "100%";
      hackFooter.textContent = "PROGRESSION : TERMINÉE ✅";

      setTimeout(() => {
        hackBox.classList.remove("shake");
        hackOverlay.classList.remove("show");
        hackOverlay.setAttribute("aria-hidden", "true");
      }, 700);
    }
  }, 60);
}

/* ========= NO ========= */
let noCount = 0;
subtitle.textContent = NO_MESSAGES[0];

noBtn.addEventListener("click", () => {
  noCount++;

  const idx = Math.min(noCount, NO_MESSAGES.length - 1);
  subtitle.textContent = NO_MESSAGES[idx];

  const scale = 1 + Math.min(0.45, noCount * 0.10);
  yesBtn.style.transform = `scale(${scale})`;

  if (noCount >= MAX_NO){
    showFakeHackOverlay();

    setTimeout(() => {
      noBtn.classList.add("hidden");
      yesBtn.classList.remove("disabled");
      subtitle.textContent = "Bon… il ne reste que OUI 😌💖";
    }, HACK_TOTAL_DURATION + 500);
  }
});

/* ========= YES ========= */
function buildGrid(){
  gifGrid.innerHTML = "";
  const list = GIFS.slice(0, 6);

  for (const src of list){
    const cell = document.createElement("div");
    cell.className = "cell";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "love gif";

    cell.appendChild(img);
    gifGrid.appendChild(cell);
  }
}

yesBtn.addEventListener("click", () => {
  if (yesBtn.classList.contains("disabled")) return;

  show(sceneYay);
  buildGrid();
  startConfetti(1800);
});

/* ========= CONFETTI ========= */
let confettiParts = [];

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

function startConfetti(durationMs){
  resizeCanvas();
  confettiCanvas.style.display = "block";

  const W = confettiCanvas.width, H = confettiCanvas.height;

  confettiParts = Array.from({length: 160}, () => ({
    x: Math.random()*W,
    y: -20 - Math.random()*H*0.6,
    r: 2 + Math.random()*4,
    vx: -1.2 + Math.random()*2.4,
    vy: 2.0 + Math.random()*3.2,
    rot: Math.random()*Math.PI,
    vr: -0.2 + Math.random()*0.4,
    a: 0.9
  }));

  const start = performance.now();

  function frame(t){
    const elapsed = t - start;
    ctx.clearRect(0,0,W,H);

    for (const p of confettiParts){
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;

      if (elapsed > durationMs * 0.7){
        p.a = Math.max(0, p.a - 0.02);
      }

      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      const colors = ["#e54b63","#ff7aa2","#ffd1dc","#7fd3ff","#b7f0c1","#f7d37a"];
      ctx.fillStyle = colors[(Math.random()*colors.length)|0];
      ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.2);

      ctx.restore();
    }

    if (elapsed < durationMs && confettiParts.some(p => p.a > 0)){
      requestAnimationFrame(frame);
    } else {
      confettiCanvas.style.display = "none";
    }
  }

  requestAnimationFrame(frame);
}
