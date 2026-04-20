// Canvas / Scale
let canvas, ctx;
const W = gameConfig.canvasWidth;   // 800
const H = gameConfig.canvasHeight;  // 400
let scale = 1;

// Camera
const cam = { x: 0, y: 0, shakeX: 0, shakeY: 0, shakeTimer: 0 };

// State
const G = {
  screen: "intro",   // intro | playing | levelEnd | gameover | lock | win
  level:  gameConfig.start_level,
  codes:  ['-', '-', '-'],
  lives:  gameConfig.lives,
  tick:   0,
  levelEndTimer: 0,
  levelEndMsg:   "",
  audioCtx: null,
  soundReady: false,
  introClickBound: false,
  _gameoverBound: false,
};
 
// Player
const P = { 
  x: 60, y: 300,
  w: 16, h: 24,
  vx: 0, vy: 0,
  onGround: false,
  dir: 1,
  coyote: 0,        // тиков после ухода с платформы
  jumpBuf: 0,       // тиков после нажатия прыжка
  wasJump: false,   // was jump held last frame
  frame: 0, fTimer: 0,
  respawnX: 60, respawnY: 300,
  rideVx: 0,        // скорость подвижной платформы под игроком
  rideVy: 0,
  stunTimer: 0,     // оглушение от врага (тики)
  blinkTimer: 0,    // мигание при возрождении
};

// Runtime level objects
let movingPlatforms = [];
let hearts = [];
let enemies = [];
let checkpointDone = new Set();
let particles = [];
let fallingHearts = [], confetti = [];

// Input
const keys = {};
const mob  = { left: false, right: false, jump: false };

//  INIT
window.addEventListener("load", () => {
  canvas = document.getElementById("gameCanvas");
  ctx    = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  resize(); window.addEventListener("resize", resize);

  window.addEventListener("keydown", e => {
    if (!keys[e.code]) {
      // Rising edge — прыжок-буфер
      if (["Space","ArrowUp","KeyW"].includes(e.code)) P.jumpBuf = gameConfig.jumpBufferFrames;
    }
    keys[e.code] = true;
    if (["Space","ArrowUp","ArrowLeft","ArrowRight","ArrowDown","KeyW","KeyA","KeyD"].includes(e.code))
      e.preventDefault();
    initAudio();
    onKeyAction(e.code);
  });
  window.addEventListener("keyup",   e => { keys[e.code] = false; });

  setupMob();

  // Every user gesture tries to unlock audio — initAudio handles the rest
  const _iosUnlock = () => { initAudio(); };
  ["touchstart","touchend","pointerdown","mousedown","keydown"].forEach(ev =>
    document.addEventListener(ev, _iosUnlock, { passive: true })
  );

  // Non-passive touchstart on canvas: eliminates iOS 300ms click delay
  // and ensures audio unlock fires before loadLevel on the play button tap
  canvas.addEventListener("touchstart", e => {
    initAudio();
    // Translate touch to a synthetic click position check
    const r = canvas.getBoundingClientRect();
    const t0 = e.changedTouches[0];
    canvas.dispatchEvent(new MouseEvent("click", {
      clientX: t0.clientX, clientY: t0.clientY, bubbles: true
    }));
    e.preventDefault();
  }, { passive: false });

  requestAnimationFrame(loop);
});

function resize() {
  // On touch devices in portrait, reserve space for on-screen controls
  const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const portrait = window.innerWidth < window.innerHeight;
  // Controls take ~110px. In landscape they sit outside the canvas area.
  const ctrlReserve = (hasTouch && portrait) ? 110 : 0;
  const availH = window.innerHeight - ctrlReserve;
  scale = Math.min(window.innerWidth / W, availH / H, 2);
  canvas.style.width  = (W * scale) + "px";
  canvas.style.height = (H * scale) + "px";
}

function setupMob() {
  const bind = (id, k) => {
    const el = document.getElementById(id);
    if (!el) return;
    const press   = e => { e.preventDefault(); mob[k] = true;
                           if (k==="jump") P.jumpBuf = gameConfig.jumpBufferFrames;
                           initAudio(); };
    const release = e => { e.preventDefault(); mob[k] = false; };
    el.addEventListener("touchstart",  press,   { passive: false });
    el.addEventListener("touchend",    release, { passive: false });
    el.addEventListener("touchcancel", release, { passive: false });
    el.addEventListener("mousedown",   press);
    el.addEventListener("mouseup",     release);
    el.addEventListener("mouseleave",  release);
  };
  bind("btnLeft","left"); bind("btnRight","right"); bind("btnJump","jump");
}

//  AUDIO
// ALL within the same synchronous user-gesture call stack.
// We also keep a _pendingMusicTrack so music queues up before unlock.
let _pendingMusicTrack = -1;

function initAudio() {
  if (!gameConfig.soundEnabled) return;
  if (!G.audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    G.audioCtx = new AC();
  }
  _tryUnlockAudio();
}

function _tryUnlockAudio() {
  const ac = G.audioCtx;
  if (!ac) return;
  // The silent 1-sample buffer trick forces iOS to open the audio pipeline
  try {
    const buf = ac.createBuffer(1, 1, 22050);
    const src = ac.createBufferSource();
    src.buffer = buf; src.connect(ac.destination); src.start(0);
  } catch(e) {}
  // Now resume if still suspended
  if (ac.state === "running") {
    if (!G.soundReady) { G.soundReady = true; _flushPendingMusic(); }
  } else if (ac.state === "suspended") {
    ac.resume().then(() => {
      G.soundReady = true; _flushPendingMusic();
    }).catch(() => {});
  }
}

function _flushPendingMusic() {
  if (_pendingMusicTrack >= 0) {
    const idx = _pendingMusicTrack;
    _pendingMusicTrack = -1;
    _musicTrack = idx; _musicStep = 0; _musicTick();
  }
}
function tone(f, t="sine", d=0.15, v=0.28) {
  if (!G.soundReady) return;
  try {
    const o = G.audioCtx.createOscillator();
    const g = G.audioCtx.createGain();
    o.connect(g); g.connect(G.audioCtx.destination);
    o.type = t; o.frequency.setValueAtTime(f, G.audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(f*0.45, G.audioCtx.currentTime+d);
    g.gain.setValueAtTime(v, G.audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, G.audioCtx.currentTime+d);
    o.start(); o.stop(G.audioCtx.currentTime+d);
  } catch(e){}
}
const snd = {
  jump:     () => { tone(370,"square",0.11,0.14); },
  heart:    () => { tone(860,"sine",0.07,0.2); setTimeout(()=>tone(970,"sine",0.07,0.25),80); },
  portal:   () => { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,"sine",0.18,0.22),i*70)); },
  win:      () => { [523,587,659,784,880,1047,1318].forEach((f,i)=>setTimeout(()=>tone(f,"triangle",0.25,0.26),i*110)); },
  error:    () => { tone(200,"sawtooth",0.22,0.22); },
  bump:     () => { tone(250,"square",0.1,0.15); },
  spring:   () => { tone(600,"square",0.15,0.15); setTimeout(()=>tone(800,"sine",0.1,0.15),70); },
  check:    () => { tone(523,"sine",0.1,0.2); setTimeout(()=>tone(784,"sine",0.12,0.2),100); },
  loseLife: () => { [330,262,196].forEach((f,i)=>setTimeout(()=>tone(f,"sawtooth",0.18,0.2),i*130)); },
  gameover: () => { [330,294,262,220,196].forEach((f,i)=>setTimeout(()=>tone(f,"sawtooth",0.28,0.22),i*160)); },
};

// MUSIC ENGINE
// Три трека: [частота мелодии, частота баса] на каждый шаг. 0 = пауза.
const MUSIC_TRACKS = [
  {
    // Уровень 1 «Первое касание» до-мажор
    // Чередуются восьмые и четверти, чуть джазово.
    tempo: 160,
    melody: [
      523, 0, 659, 784,   880, 784, 659, 0,
      523, 659, 784, 0,   1047,0, 880, 784,
      698, 0, 784, 0,     659, 587, 523, 0,
      440, 523, 659, 0,   784, 659, 523, 0,
      523, 0, 659, 784,   880, 0, 1047,0,
      784, 698, 659, 0,   587, 523, 494, 0,
      523, 0, 659, 784,   1047,880, 784, 0,
      659, 523, 392, 0,   523, 0,  0,   0,
    ],
    bass: [
      262, 0, 262, 0,   330, 0, 262, 0,
      196, 0, 196, 0,   196, 0, 196, 0,
      175, 0, 175, 0,   220, 0, 175, 0,
      220, 0, 220, 0,   262, 0, 220, 0,
      262, 0, 262, 0,   330, 0, 262, 0,
      196, 0, 196, 0,   175, 0, 165, 0,
      262, 0, 262, 0,   330, 0, 262, 0,
      220, 0, 196, 0,   262, 0,  0,  0,
    ],
  },
  {
    // Уровень 2 «Закатная мелодия» ля-минор, лиричный закат
    // Плавные ходы, немного «романтично».
    tempo: 200,
    melody: [
      440, 0, 523, 0,   587, 0, 659, 0,
      587, 523, 0, 440, 392, 0, 440, 0,
      494, 0, 587, 0,   659, 698, 0, 784,
      659, 587, 0, 523, 494, 0, 440, 0,
      392, 440, 494, 0, 523, 0, 587, 0,
      659, 0, 784, 0,   880, 784, 0, 659,
      587, 0, 523, 0,   494, 440, 0, 392,
      440, 0, 392, 0,   440, 0,  0,  0,
    ],
    bass: [
      220, 0, 220, 0,   220, 0, 220, 0,
      175, 0, 175, 0,   175, 0, 175, 0,
      247, 0, 247, 0,   247, 0, 247, 0,
      220, 0, 220, 0,   220, 0, 220, 0,
      196, 0, 196, 0,   220, 0, 220, 0,
      220, 0, 247, 0,   262, 0, 247, 0,
      220, 0, 196, 0,   165, 0, 175, 0,
      220, 0, 196, 0,   220, 0,  0,  0,
    ],
  },
  {
    // Уровень 3 «Звёздная ночь» ночное приключение, быстро
    // Вдохновлено Mario overworld: пунктирный ритм + прыгающая мелодия.
    tempo: 190,
    melody: [
      659, 0, 659, 0,    0, 523, 659,  0,
      784, 0,   0, 0,  392,   0,   0,  0,
      523, 0,   0,392,   0,   0, 330,  0,
      349, 0,   0,330,   0,   0, 294,  0,
      330, 0,   0,  0,  392,   0, 523,  0,
      587, 0, 659, 0,  698,   0, 784,  0,
      659,523,494, 0,  440,   0,   0,  0,
      392, 0, 523,659,  784, 659,   0,  0,

      // второй куплет: поднимаем октаву
      0, 523, 523, 0,   659, 0, 523, 0,
      440, 0, 392, 0,   440, 0,   0, 0,
      0, 523, 523, 0,   659, 784, 0, 0,
      523, 0,   0, 0,     0, 0,   0, 0,
      0, 523, 523, 0,   659, 0, 523, 0,
      440, 0, 392, 0,   330, 0,   0, 0,
      494, 0, 494, 0,   440, 0, 392, 0,
      330, 262, 0, 0,   523, 0,   0, 0,
    ],
    bass: [
      131,0,131,0,  131,0,131,0,
      196,0,196,0,  196,0,196,0,
      147,0,147,0,  147,0,147,0,
      175,0,175,0,  175,0,175,0,
      131,0,131,0,  196,0,196,0,
      220,0,220,0,  247,0,262,0,
      220,0,220,0,  220,0,220,0,
      196,0,196,0,  262,0,  0,0,

      131,0,131,0,  131,0,131,0,
      175,0,175,0,  175,0,175,0,
      131,0,131,0,  196,0,196,0,
      220,0,220,0,  220,0,220,0,
      131,0,131,0,  131,0,131,0,
      175,0,175,0,  147,0,147,0,
      165,0,165,0,  175,0,165,0,
      147,0,131,0,  196,0,  0,0,
    ],
  },
];

let _musicTimer = null;
let _musicStep  = 0;
let _musicTrack = -1;

function musicStart(idx) {
  if (!gameConfig.soundEnabled) return;
  musicStop();
  _pendingMusicTrack = -1;
  _musicTrack = idx; _musicStep = 0;
  if (G.soundReady) {
    _musicTick();
  } else {
    // Audio not unlocked yet (typical first-load on iOS).
    // Store the track — _flushPendingMusic() fires once context is running.
    _pendingMusicTrack = idx;
    if (G.audioCtx) _tryUnlockAudio(); // try again in case gesture is active
  }
}

function musicStop() {
  if (_musicTimer) { clearTimeout(_musicTimer); _musicTimer = null; }
  _musicTrack = -1;
}

function _musicTick() {
  if (!G.soundReady || _musicTrack < 0) return;
  const tr  = MUSIC_TRACKS[_musicTrack];
  const len = tr.melody.length;
  const mf  = tr.melody[_musicStep % len];
  const bf  = tr.bass  [_musicStep % len];
  const dur = tr.tempo * 0.82 / 1000;
  if (mf) _mNote(mf, "triangle", dur, 0.20);
  if (bf) _mNote(bf, "sine", dur, 0.06);
  _musicStep++;
  _musicTimer = setTimeout(_musicTick, tr.tempo);
}

function _mNote(freq, type, dur, vol) {
  if (!G.soundReady) return;
  try {
    const ac = G.audioCtx;
    const o = ac.createOscillator();
    const g = ac.createGain();

    o.connect(g);
    g.connect(ac.destination);

    if (type === 'custom') {
      let real = [0];
      let imaginary = [0];

      for (let i = 1; i <= 8; i++) {
        const amplitude = i === 1 ? 0.8 : 1 / (i * i * 2);
        if (i % 2 === 0) {
          real.push(amplitude * 0.3); 
        } else {
          real.push(amplitude * 0.7); 
        }

        if (i % 3 === 0) {
          imaginary.push(amplitude * 0.5); 
        } else {
          imaginary.push(amplitude * 0.2); 
        }
      }

      const periodicWave = ac.createPeriodicWave(
        new Float32Array(real),
        new Float32Array(imaginary)
      );
      o.setPeriodicWave(periodicWave);
    } else {
      o.type = type;
    }

    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(vol, ac.currentTime);

    const attackTime = 0.01;
    const decayTime = dur * 0.7; 
    const releaseTime = dur * 0.2;

    g.gain.exponentialRampToValueAtTime(
      (vol * 0.4),
      ac.currentTime + attackTime
    );
    g.gain.exponentialRampToValueAtTime(
      (vol * 0.1),
      ac.currentTime + attackTime + decayTime
    );
    g.gain.exponentialRampToValueAtTime(
      0.001,
      ac.currentTime + dur - releaseTime
    );

    o.start(ac.currentTime);
    o.stop(ac.currentTime + dur);
  } catch (e) {
    console.error('Error playing note:', e);
  }
}



//  LOAD LEVEL
function loadLevel(idx) {
  const lvl = levels[idx];
  G.level  = idx;
  G.screen = "playing";

  hearts           = lvl.hearts.map(h => ({ ...h, collected: false }));
  enemies          = (lvl.enemies || []).map(e => ({ ...e, stunned: 0 }));
  movingPlatforms  = (lvl.movingPlatforms || []).map(p => ({ ...p }));
  checkpointDone   = new Set();
  particles        = [];

  musicStart(idx);
  respawn(lvl.start.x, lvl.start.y, false);
}

function respawn(x, y, shake) {
  P.x = x; P.y = y - 1;
  P.vx = 0; P.vy = 0;
  P.onGround = false;
  P.respawnX = x; P.respawnY = y;
  P.rideVx = 0; P.rideVy = 0;
  P.stunTimer = 0;
  P.blinkTimer = shake ? 90 : 0;
  if (shake) shakeScreen(6, 18);
}

function shakeScreen(amp, dur) {
  cam.shakeTimer = dur;
  cam._amp = amp;
}

//  MAIN LOOP
let last = 0;
function loop(ts) {
  const dt = Math.min((ts - last) / 16.667, 2.5);
  last = ts; G.tick++;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

//  UPDATE
function update(dt) {
  if (G.screen === "playing") {
    updateMoving(dt);
    updatePlayer(dt);
    updateEnemies(dt);
    updateParticles(dt);
    checkHearts();
    checkCheckpoints();
    checkPortal();
    checkFall();
    updateCamera(dt);
  } else if (G.screen === "levelEnd") {
    G.levelEndTimer -= dt;
    if (G.levelEndTimer <= 0) advanceLevel();
    updateParticles(dt);
  } else if (G.screen === "gameover") {
 
  } else if (G.screen === "win") {
    updateFalling(dt);
    updateConfetti(dt);
  }
  updateShake();
}

// Camera
function updateCamera(dt) {
  const lvl = levels[G.level];
  const targetX = P.x + P.w/2 - W/2 + 60;
  cam.x += (targetX - cam.x) * 0.12 * dt;
  cam.x = Math.max(0, Math.min(cam.x, lvl.worldW - W));
}

function updateShake() {
  if (cam.shakeTimer > 0) {
    cam.shakeTimer--;
    const a = cam._amp * (cam.shakeTimer / cam._amp) * 0.3;
    cam.shakeX = (Math.random()-0.5) * a * 2;
    cam.shakeY = (Math.random()-0.5) * a * 2;
  } else {
    cam.shakeX = 0; cam.shakeY = 0;
  }
}

// Moving platforms
function updateMoving(dt) {
  for (const mp of movingPlatforms) {
    mp._pvx = mp._pvy = 0;

    if (mp.dx) {
      mp.x += mp.dx * dt;
      mp._pvx = mp.dx;
      if (mp.x + mp.w >= mp.maxX) { mp.x = mp.maxX - mp.w; mp.dx *= -1; }
      if (mp.x <= mp.minX)        { mp.x = mp.minX;         mp.dx *= -1; }
    }

    if (mp.dy) {
      // Check if player is riding this platform BEFORE we move it.
      // "Riding" = feet roughly touching the top surface.
      const riding =
        P.x + P.w > mp.x && P.x < mp.x + mp.w &&
        P.y + P.h >= mp.y - 4 && P.y + P.h <= mp.y + 6;

      const prevY = mp.y;
      mp.y += mp.dy * dt;
      mp._pvy = mp.dy;
      if (mp.y + mp.h >= mp.maxY) { mp.y = mp.maxY - mp.h; mp.dy *= -1; }
      if (mp.y <= mp.minY)        { mp.y = mp.minY;         mp.dy *= -1; }

      // Carry the player directly with the platform — no overlap fighting
      if (riding) {
        P.y += mp.y - prevY;
        P.onGround = true;
        P.rideVx = mp._pvx;
      }
    }
  }
}

// Player physics
function updatePlayer(dt) {
  if (P.blinkTimer > 0) P.blinkTimer--;
  if (P.stunTimer  > 0) { P.stunTimer--; }

  const left  = (keys["ArrowLeft"]  || keys["KeyA"] || mob.left)  && !P.stunTimer;
  const right = (keys["ArrowRight"] || keys["KeyD"] || mob.right) && !P.stunTimer;
  const jumpHeld = keys["ArrowUp"] || keys["KeyW"] || keys["Space"] || mob.jump;

  // Coyote time countdown
  if (P.onGround) { P.coyote = gameConfig.coyoteFrames; }
  else if (P.coyote > 0) P.coyote--;

  // Jump buffer countdown
  if (P.jumpBuf > 0) P.jumpBuf--;

  // Horizontal movement — acceleration feel
  const targetVx = right ? gameConfig.playerSpeed : left ? -gameConfig.playerSpeed : 0;
  if (P.onGround) {
    P.vx += (targetVx - P.vx) * (1 - gameConfig.groundFriction);
  } else {
    P.vx += (targetVx - P.vx) * (1 - gameConfig.airFriction) * dt;
    P.vx += P.rideVx * 0.1; // slight carry in air
  }
  if (right) P.dir = 1;
  if (left)  P.dir = -1;

  // Jump: coyote + buffer
  if (P.jumpBuf > 0 && P.coyote > 0) {
    P.vy     = gameConfig.jumpPower;
    P.coyote = 0;
    P.jumpBuf = 0;
    P.onGround = false;
    snd.jump();
  }

  // Variable jump height — release early = lower jump
  if (!jumpHeld && P.vy < -4) P.vy += 1.5 * dt;

  // Gravity
  P.vy = Math.min(P.vy + gameConfig.gravity * dt, gameConfig.maxFallSpeed);

  // Move X then resolve
  P.x += P.vx * dt + P.rideVx * dt;
  P.x  = Math.max(0, Math.min(P.x, levels[G.level].worldW - P.w));
  P.rideVx = 0; P.rideVy = 0;
  resolveX();

  // Move Y then resolve
  P.onGround = false;
  P.y += P.vy * dt;
  resolveY();

  // Springs
  for (const sp of (levels[G.level].springs || [])) {
    const sx = sp.x - cam.x; // world coords, compare vs world
    if (
      P.x + P.w > sp.x - 12 && P.x < sp.x + 12 &&
      P.y + P.h > sp.y - 10 && P.y + P.h < sp.y + 8 &&
      P.vy >= 0
    ) {
      P.vy = gameConfig.jumpPower * 1.8;
      P.coyote = 0; P.jumpBuf = 0; P.onGround = false;
      snd.spring();
      spawnParticles(sp.x, sp.y, "#FFD700", 8);
    }
  }

  // Run animation
  if (Math.abs(P.vx) > 0.6 && P.onGround) {
    P.fTimer++;
    if (P.fTimer >= 8) { P.frame ^= 1; P.fTimer = 0; }
  } else if (!P.onGround) {
    P.frame = 2;
  } else {
    P.frame = 0; P.fTimer = 0;
  }
}

function resolveX() {
  const lvl = levels[G.level];
  const all = [...lvl.platforms, ...movingPlatforms];
  for (const p of all) {
    if (!overlapAABB(P, p)) continue;
    const pRight  = p.x + p.w;
    const overlapL = (P.x + P.w) - p.x;
    const overlapR = pRight - P.x;
    if (overlapL < overlapR) { P.x = p.x - P.w; P.vx = 0; }
    else                     { P.x = pRight;     P.vx = 0; }
  }
}

function resolveY() {
  const lvl = levels[G.level];
  const all = [...lvl.platforms, ...movingPlatforms];
  for (const p of all) {
    if (!overlapAABB(P, p)) continue;
    const pBottom  = p.y + p.h;
    const overlapT = (P.y + P.h) - p.y;
    const overlapB = pBottom - P.y;
    if (overlapT < overlapB) {
      // Landed on top
      P.y = p.y - P.h;
      if (P.vy > 0) P.vy = 0;
      P.onGround = true;
      // Carry moving platform velocity
      if (p._pvx !== undefined) { P.rideVx = p._pvx; P.rideVy = p._pvy || 0; }
    } else {
      // Hit from below
      P.y = pBottom; P.vy = 0;
    }
  }
}

function overlapAABB(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// Enemies
function updateEnemies(dt) {
  for (const e of enemies) {
    if (e.stunned > 0) { e.stunned--; continue; }
    e.x += e.dx * dt;
    if (e.x + e.w >= e.maxX) { e.x = e.maxX - e.w; e.dx *= -1; }
    if (e.x <= e.minX)       { e.x = e.minX;        e.dx *= -1; }

    // Collision with player
    if (P.stunTimer <= 0 && P.blinkTimer <= 0 && overlapAABB(P, e)) {
      // Player jumps on top → stun or kill enemy
      if (P.vy > 0 && P.y + P.h < e.y + e.h * 0.55) {
        e.stunned = 80;
        P.vy = gameConfig.jumpPower * 0.6;
        snd.bump();
        spawnParticles(e.x + e.w/2, e.y, "#FF6B6B", 6);
        e.hp--;
        if (e.hp <= 0) {
          enemies = enemies.filter(en => en !== e);
        }
      } else {
        // Enemy bumps player back
        P.vx = P.x < e.x + e.w/2 ? -5 : 5;
        P.vy = -4;
        P.stunTimer = 40;
        P.blinkTimer = 150;
        snd.bump();
        shakeScreen(4, 12);
        G.lives--;
        if (G.lives <= 0) {
          G.lives = 0;
          musicStop();
          snd.gameover();
          G.screen = "gameover";
        } else {
          snd.loseLife();
        }
      }
    }
  }
}

// Hearts
function checkHearts() {
  for (const h of hearts) {
    if (h.collected) continue;
    if (Math.abs(P.x + P.w/2 - (h.x + 8)) < 22 && Math.abs(P.y + P.h/2 - (h.y + 8)) < 22) {
      h.collected = true;
      spawnParticles(h.x + 8, h.y + 8, "#FF6B9D", 10);
      snd.heart();
    }
  }
}

// Checkpoints
function checkCheckpoints() {
  for (let i = 0; i < (levels[G.level].checkpoints||[]).length; i++) {
    if (checkpointDone.has(i)) continue;
    const c = levels[G.level].checkpoints[i];
    if (overlapAABB(P, c)) {
      checkpointDone.add(i);
      P.respawnX = c.x + 5; P.respawnY = c.y;
      snd.check();
      spawnParticles(c.x + c.w/2, c.y + c.h/2, "#FFD700", 12);
    }
  }
}

// Portal
function checkPortal() {
  const collected = hearts.filter(h => h.collected).length;
  if (collected < hearts.length) return;
  const p = levels[G.level].portal;
  const portalBox = { x: p.x, y: p.y, w: 32, h: 48 };
  if (overlapAABB(P, portalBox)) {
    snd.portal();
    const code = gameConfig.levelCodes[G.level];
    G.codes[G.level] = code;
    G.levelEndMsg = `Цифра получена: ${code}`;
    G.levelEndTimer = 160;
    G.screen = "levelEnd";
    spawnParticles(p.x + 16, p.y + 24, "#FFD700", 20);
  }
}

function checkFall() {
  if (P.y > H + 80) {
    G.lives--;
    if (G.lives <= 0) {
      G.lives = 0;
      musicStop();
      snd.gameover();
      G.screen = "gameover";
    } else {
      snd.loseLife();
      respawn(P.respawnX, P.respawnY, true);
    }
  }
}

function advanceLevel() {
  if (G.level + 1 < levels.length) {
    loadLevel(G.level + 1);
  } else {
    musicStop();
    G.screen = "lock";
    showLock();
  }
}

// Particles
function spawnParticles(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI*2 * i/n) + Math.random()*0.5;
    const sp = 1.5 + Math.random() * 2.5;
    particles.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 1,
                     life: 35+Math.random()*20, max: 55, color, size: 3+Math.random()*3 });
  }
}
function updateParticles(dt) {
  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 0.12*dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i,1);
  }
}

// Win effects
function spawnWin() {
  fallingHearts = Array.from({length:35}, () => ({
    x: Math.random()*W, y: -30-Math.random()*200,
    vy: 1.2+Math.random()*2.2, wobble: Math.random()*Math.PI*2,
    ws: 0.025+Math.random()*0.04, size: 12+Math.random()*22, alpha: 0.5+Math.random()*0.5
  }));
  confetti = Array.from({length:80}, () => ({
    x: Math.random()*W, y: -15,
    vx: -1.5+Math.random()*3, vy: 2+Math.random()*3.5,
    color: ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6BCB","#fff"][Math.floor(Math.random()*6)],
    size: 5+Math.random()*8, rot: Math.random()*Math.PI*2,
    rs: -0.12+Math.random()*0.24
  }));
}
function updateFalling(dt) {
  for (const h of fallingHearts) {
    h.wobble += h.ws*dt; h.x += Math.sin(h.wobble)*0.7; h.y += h.vy*dt;
    if (h.y > H+40) { h.y = -25; h.x = Math.random()*W; }
  }
}
function updateConfetti(dt) {
  for (const c of confetti) {
    c.x += c.vx*dt; c.y += c.vy*dt; c.rot += c.rs*dt;
    if (c.y > H+20) { c.y = -10; c.x = Math.random()*W; }
  }
}

//  DRAW
function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(Math.round(cam.shakeX), Math.round(cam.shakeY));

  if      (G.screen === "intro")    drawIntro();
  else if (G.screen === "playing" || G.screen === "levelEnd") {
    drawWorld();
    drawHUD();
    if (G.screen === "levelEnd") drawLevelEnd();
  }
  else if (G.screen === "gameover") { drawWorld(); drawHUD(); drawGameOver(); }
  else if (G.screen === "win")      drawWin();

  ctx.restore();
}

// Background
function drawBG(lvl) {
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, lvl.bgColors[0]);
  g.addColorStop(1, lvl.bgColors[1]);
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

// Decorations (parallax)
function drawDecos(lvl) {
  const px = cam.x * 0.3; // parallax offset
  for (const d of (lvl.decorations||[])) {
    const wx = d.x - px;
    if (d.type === "cloud") drawCloud(wx, d.y, d.s||1);
    if (d.type === "star")  drawStar(wx, d.y);
    if (d.type === "moon")  drawMoon(wx, d.y);
    if (d.type === "sun")   drawSun(wx, d.y);
    if (d.type === "tree")  drawTree(d.x - cam.x, d.y);
  }
}

function drawCloud(x, y, s) {
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  [[0,0,22],[28,0,18],[14,-13,18],[-16,-8,14],[44,-6,14]].forEach(([dx,dy,r]) => {
    ctx.beginPath(); ctx.arc(x+dx*s, y+dy*s, r*s, 0, Math.PI*2); ctx.fill();
  });
}
function drawStar(x, y) {
  const a = 0.45 + 0.55 * Math.abs(Math.sin(G.tick*0.04 + x*0.07));
  ctx.fillStyle = `rgba(255,255,210,${a})`;
  ctx.fillRect(x, y, 3, 3); ctx.fillRect(x+1, y-1, 1, 5); ctx.fillRect(x-1,y+1,5,1);
}
function drawMoon(x, y) {
  ctx.fillStyle = "#FFFACD";
  ctx.beginPath(); ctx.arc(x,y,22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = levels[G.level].bgColors[0];
  ctx.beginPath(); ctx.arc(x+10,y-5,17,0,Math.PI*2); ctx.fill();
  // craters
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath(); ctx.arc(x-6,y+4,4,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x-2,y-8,3,0,Math.PI*2); ctx.fill();
}
function drawSun(x, y) {
  const r = 28, t = G.tick;
  // Rays
  ctx.strokeStyle = "rgba(255,220,0,0.55)"; ctx.lineWidth = 3;
  for (let i=0;i<8;i++) {
    const a = Math.PI*2*i/8 + t*0.008;
    ctx.beginPath();
    ctx.moveTo(x+Math.cos(a)*(r+4), y+Math.sin(a)*(r+4));
    ctx.lineTo(x+Math.cos(a)*(r+14), y+Math.sin(a)*(r+14));
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,"#FFF176"); g.addColorStop(1,"#FFB300");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
}
function drawTree(x, y) {
  ctx.fillStyle = "#4a3020";
  ctx.fillRect(x+8, y-30, 8, 32);
  ctx.fillStyle = "#2d7a2d";
  ctx.beginPath(); ctx.moveTo(x+12,y-70); ctx.lineTo(x-5,y-28); ctx.lineTo(x+29,y-28); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#39a039";
  ctx.beginPath(); ctx.moveTo(x+12,y-82); ctx.lineTo(x+1,y-45); ctx.lineTo(x+23,y-45); ctx.closePath(); ctx.fill();
}

// Platform
function drawPlatform(p, cx) {
  const x = p.x - cx, y = p.y;
  if (x + p.w < 0 || x > W) return; // culling
  // Body
  ctx.fillStyle = p.color;
  ctx.fillRect(x, y, p.w, p.h);
  // Top edge (lighter)
  ctx.fillStyle = p.top || lighten(p.color, 40);
  ctx.fillRect(x, y, p.w, 5);
  // Pixel texture
  ctx.fillStyle = "rgba(0,0,0,0.07)";
  for (let px2=x+2; px2<x+p.w-2; px2+=8)
    for (let py=y+6; py<y+p.h-2; py+=8)
      ctx.fillRect(px2, py, 4, 4);
  // Bottom shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(x, y+p.h-3, p.w, 3);
}

// Spring
function drawSpring(sp, cx) {
  const x = sp.x - cx, y = sp.y;
  const b = 1 + 0.2*Math.abs(Math.sin(G.tick*0.15));
  ctx.fillStyle = "#C0392B"; ctx.fillRect(x-10, y-3, 20, 6);
  ctx.fillStyle = "#E74C3C";
  for (let i=0;i<3;i++) ctx.fillRect(x-6+i*4, y-3-10*b*(i+1)/3, 5, 3);
  ctx.fillStyle = "#E74C3C"; ctx.fillRect(x-11, y-3-10*b, 22, 5);
  ctx.fillStyle = "#FFD700"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
  ctx.fillText("↑", x, y-14*b); ctx.textAlign="left";
}

// Checkpoint
function drawCheckpoint(c, cx, done) {
  const x = c.x - cx, y = c.y;
  if (x+c.w < 0 || x > W) return;
  ctx.strokeStyle = done ? "#FFD700" : "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4,4]); ctx.strokeRect(x, y, c.w, c.h); ctx.setLineDash([]);
  ctx.fillStyle = done ? "#FFD700" : "rgba(255,255,255,0.25)";
  ctx.fillRect(x, y, c.w, c.h);
  // Flag icon
  ctx.fillStyle = done ? "#FF2D55" : "rgba(255,255,255,0.6)";
  ctx.fillRect(x+5, y+4, 2, 20);
  ctx.fillStyle = done ? "#FF6B9D" : "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.moveTo(x+7, y+4); ctx.lineTo(x+15, y+9); ctx.lineTo(x+7, y+14);
  ctx.closePath(); ctx.fill();
}

// Enemy
function drawEnemy(e, cx) {
  const x = e.x - cx, y = e.y;
  if (x+e.w < 0 || x > W) return;
  const t = G.tick;
  ctx.save();
  ctx.translate(x + e.w/2, y + e.h);
  if (e.stunned > 0) {
    ctx.globalAlpha = 0.4 + 0.3*Math.sin(t*0.3);
  }
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath(); ctx.ellipse(0, 2, 10, 3, 0, 0, Math.PI*2); ctx.fill();
  // Body
  ctx.fillStyle = e.color;
  ctx.fillRect(-8, -18, 16, 16);
  // Eyes
  ctx.fillStyle = "#FFF";
  ctx.fillRect(-5,-14,4,4); ctx.fillRect(1,-14,4,4);
  ctx.fillStyle = "#222";
  ctx.fillRect(-4,-13,2,2); ctx.fillRect(2,-13,2,2);
  // Angry brows
  ctx.fillStyle = "#900";
  ctx.fillRect(-6,-16,4,2); ctx.fillRect(2,-16,4,2);
  // Horns
  ctx.fillStyle = "#a00";
  ctx.fillRect(-5,-20,3,5); ctx.fillRect(2,-20,3,5);
  // Legs (walk animation)
  const legOff = e.stunned ? 0 : Math.sin(t*0.25)*4;
  ctx.fillStyle = e.color;
  ctx.fillRect(-6, 0, 4, 6+legOff); ctx.fillRect(2, 0, 4, 6-legOff);
  ctx.restore();
  
}

// Heart (world)
function drawHeart(h, cx) {
  if (h.collected) return;
  const x = h.x - cx, y = h.y;
  if (x + 16 < 0 || x > W) return;
  const float = Math.sin(G.tick*0.055 + h.x*0.02) * 4;
  const s = h.special ? 1 + 0.18*Math.sin(G.tick*0.09) : 1;
  ctx.save();
  ctx.translate(x+8, y+8+float);
  ctx.scale(s,s);
  if (h.special) {
    // glow
    const glow = ctx.createRadialGradient(0,0,0,0,0,22);
    glow.addColorStop(0,"rgba(255,20,100,0.35)"); glow.addColorStop(1,"rgba(255,20,100,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0,0,22,0,Math.PI*2); ctx.fill();
  }
  pixHeart(ctx, h.special ? "#FF1493" : "#FF4488", h.special ? "#FF80BF" : "#FFB3CC", h.special ? 2.4 : 2.0);
  ctx.restore();
}

function pixHeart(ctx, col, light, s) {
  const map = [
    "..XX..XX..",
    ".XXXXXXXX.",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    ".XXXXXXXX.",
    "..XXXXXX..",
    "...XXXX...",
    "....XX....",
  ];
  const pw = Math.ceil(s);
  ctx.fillStyle = col;
  for (let r=0;r<map.length;r++)
    for (let c=0;c<map[r].length;c++)
      if (map[r][c]==="X") ctx.fillRect((c-5)*pw, (r-4)*pw, pw, pw);
  ctx.fillStyle = light;
  ctx.fillRect(-3*pw,-3*pw,pw,pw); ctx.fillRect(-2*pw,-4*pw,pw,pw);
}

// Portal
function drawPortal(p, cx, active) {
  const x = p.x - cx, y = p.y;
  const t = G.tick;
  const pulse = 1 + 0.1*Math.sin(t*0.1);
  ctx.save();
  ctx.translate(x+16, y+24);
  if (active) {
    const glow = ctx.createRadialGradient(0,0,0,0,0,32*pulse);
    glow.addColorStop(0,"rgba(255,215,0,0.45)"); glow.addColorStop(1,"rgba(255,165,0,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0,0,32*pulse,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 3;
    ctx.strokeRect(-14,-22,28,44);
    const alpha = 0.55 + 0.45*Math.sin(t*0.13);
    ctx.fillStyle = `rgba(255,215,0,${alpha})`;
    ctx.fillRect(-12,-20,24,40);
    ctx.fillStyle = "#FFF"; ctx.font="bold 22px serif"; ctx.textAlign="center";
    ctx.fillText("★",0,8); ctx.textAlign="left";
  } else {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#888"; ctx.lineWidth = 2;
    ctx.setLineDash([4,4]); ctx.strokeRect(-14,-22,28,44); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(100,100,100,0.15)"; ctx.fillRect(-14,-22,28,44);
    ctx.fillStyle = "#aaa"; ctx.font="18px serif"; ctx.textAlign="center";
    ctx.fillText("🔒",0,8); ctx.textAlign="left";
  }
  ctx.restore();
}

// Player
function drawPlayer(cx) {
  if (P.blinkTimer > 0 && Math.floor(P.blinkTimer/5)%2===0) return;
  const x = Math.round(P.x - cx);
  const y = Math.round(P.y);
  const t = G.tick;
  const legSwing = (P.onGround && Math.abs(P.vx)>0.5) ? Math.sin(t*0.35)*4 : 0;

  ctx.save();
  ctx.translate(x + P.w/2, y);
  if (P.dir < 0) ctx.scale(-1, 1);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath(); ctx.ellipse(0, P.h+1, 9, 3, 0, 0, Math.PI*2); ctx.fill();

  // Legs
  ctx.fillStyle = "#2c2c7a";
  ctx.fillRect(-6, P.h-9, 5, 9 + (legSwing|0));
  ctx.fillRect( 1, P.h-9, 5, 9 - (legSwing|0));
  // Shoes
  ctx.fillStyle = "#111";
  ctx.fillRect(-7, P.h-3, 6, 4); ctx.fillRect(1, P.h-3, 6, 4);

  // Body
  ctx.fillStyle = P.stunTimer > 0 ? "#e07070" : "#E74C3C";
  ctx.fillRect(-7, 8, 14, 11);
  // Shirt detail
  ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(-5,10,4,3);

  // Arms
  const armSwing = legSwing * 0.7;
  ctx.fillStyle = P.stunTimer > 0 ? "#e07070" : "#E74C3C";
  ctx.fillRect(-11, 9, 5, 6+(armSwing|0));
  ctx.fillRect(  6, 9, 5, 6-(armSwing|0));

  // Head
  ctx.fillStyle = "#FDBCB4";
  ctx.fillRect(-5, 0, 10, 10);
  // Hair
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(-5, 0, 10, 3);
  ctx.fillRect(-6, 1, 3, 4);
  // Eyes
  ctx.fillStyle = "#222";
  ctx.fillRect(P.frame===2 ? -1 : 0, 4, 2, 2);
  // Blush
  ctx.fillStyle = "rgba(255,150,130,0.5)";
  ctx.fillRect(-4,6,2,1); ctx.fillRect(2,6,2,1);
  // Smile
  ctx.fillStyle = "#C0392B";
  ctx.fillRect(-2, 7, 4, 1);
  // Heart on shirt
  ctx.fillStyle = "#FFD0E0";
  ctx.font = "7px serif"; ctx.textAlign="center";
  ctx.fillText("♥",0,17); ctx.textAlign="left";
  // Jump sparkle
  if (!P.onGround) {
    ctx.fillStyle = "rgba(255,220,0,0.8)";
    ctx.font = "9px serif"; ctx.textAlign="center";
    ctx.fillText("✦",0,-5); ctx.textAlign="left";
  }
  ctx.restore();
}

// World draw
function drawWorld() {
  const lvl = levels[G.level];
  const cx  = Math.round(cam.x);

  drawBG(lvl);
  drawDecos(lvl);

  // Fog layer
  const fog = ctx.createLinearGradient(0, H*0.55, 0, H);
  fog.addColorStop(0, "transparent"); fog.addColorStop(1, lvl.fogColor||"rgba(0,0,0,0.12)");
  ctx.fillStyle = fog; ctx.fillRect(0, H*0.55, W, H*0.45);

  // Platforms
  for (const p of lvl.platforms) drawPlatform(p, cx);
  for (const p of movingPlatforms) drawPlatform(p, cx);

  // Springs
  for (const sp of (lvl.springs||[])) drawSpring(sp, cx);

  // Checkpoints
  (lvl.checkpoints||[]).forEach((c,i) => drawCheckpoint(c, cx, checkpointDone.has(i)));

  // Portal
  const collected = hearts.filter(h=>h.collected).length;
  drawPortal(lvl.portal, cx, collected >= hearts.length);

  // Hearts
  for (const h of hearts) drawHeart(h, cx);

  // Enemies
  for (const e of enemies) drawEnemy(e, cx);

  // Particles
  for (const p of particles) {
    const a = p.life / p.max;
    ctx.fillStyle = p.color; ctx.globalAlpha = a;
    ctx.font = `${Math.floor(p.size)}px serif`;
    ctx.fillText("♥", p.x - cx - p.size/2, p.y + p.size/2);
    ctx.globalAlpha = 1;
  }

  // Player
  drawPlayer(cx);
}

// HUD
function drawHUD() {
  const t   = G.tick;
  const lvl = levels[G.level];
  const collected = hearts.filter(h=>h.collected).length;

  // Background panel
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, W, 36);
  ctx.fillStyle = "rgba(255,45,85,0.45)";
  ctx.fillRect(0, 35, W, 1);

  // Left: жизни
  ctx.font = "15px serif";
  for (let i = 0; i < gameConfig.lives; i++) {
    ctx.fillStyle = i < G.lives ? "#FF2D55" : "rgba(255,255,255,0.18)";
    ctx.fillText(i < G.lives ? "♥" : "♡", 10 + i * 20, 23);
  }

  // Center: level number + name
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 10px 'Press Start 2P', monospace";
  ctx.fillText(`${G.level+1} / 3`, W/2, 16);
  ctx.fillStyle = "rgba(255,200,230,0.7)";
  ctx.font = "8px 'Press Start 2P', monospace";
  ctx.fillText(lvl.name, W/2, 29);
  ctx.textAlign = "left";

  // Right: progress
  for (let i = 0; i < hearts.length; i++) {
    ctx.fillStyle = i < collected ? "#FF6B9D" : "rgba(255,255,255,0.22)";
    ctx.font = "13px serif";
    ctx.fillText(i < collected ? "♥" : "♡", W - 14 - (hearts.length-1-i)*17, 23);
  }

  // Stun bar
  if (P.stunTimer > 0) {
    ctx.fillStyle = "rgba(255,100,100,0.7)";
    ctx.fillRect(0, 36, (P.stunTimer/40)*W, 3);
  }
}

// Game Over screen
function drawGameOver() {
  const t = G.tick;
  ctx.fillStyle = "rgba(0,0,0,0.78)"; ctx.fillRect(0,0,W,H);

  ctx.save(); ctx.translate(W/2, H/2);

  // Card
  ctx.fillStyle = "rgba(8,0,18,0.97)";
  rr(ctx,-210,-96,420,192,20); ctx.fill();
  ctx.shadowColor="#CC0022"; ctx.shadowBlur=28;
  ctx.strokeStyle="#CC0022"; ctx.lineWidth=3;
  rr(ctx,-210,-96,420,192,20); ctx.stroke();
  ctx.shadowBlur=0;

  // Blinking broken hearts
  const blink = Math.floor(t/12)%2;
  ctx.font="26px serif"; ctx.textAlign="center";
  ctx.fillStyle = blink ? "#FF2D55" : "#660011";
  ctx.fillText("💔   💔   💔", 0, -55);

  // "GAME OVER" - two-tone stroke text
  txtStroke("ЖИЗНИ КОНЧИЛИСЬ", 0, -12,
    "bold 16px 'Press Start 2P',monospace","#FF6060","#330000",5);

  ctx.fillStyle="rgba(255,200,210,0.5)"; ctx.font="8px 'Press Start 2P',monospace";
  ctx.textAlign="center";
  ctx.fillText("всё начинается заново...", 0, 24);

  // Pulsing hint
  const pa = 0.4+0.6*Math.abs(Math.sin(t*0.085));
  ctx.fillStyle=`rgba(255,215,0,${pa})`;
  ctx.font="9px 'Press Start 2P',monospace";
  ctx.fillText("[ ПРОБЕЛ / тап ]", 0, 66);
  ctx.textAlign="left"; ctx.restore();

  if (!G._gameoverBound) {
    G._gameoverBound = true;
    const handler = () => {
      if (G.screen !== "gameover") return;
      G._gameoverBound = false;
      canvas.removeEventListener("click", handler);
      fullReset();
    };
    canvas.addEventListener("click", handler, { passive: true });
  }
}

function fullReset() {
  G.lives  = gameConfig.lives;
  G.codes  = ['-', '-', '-'];
  G.level  = gameConfig.start_level;
  G.screen = "intro";
  cam.x    = 0;
  particles = [];
  _pendingMusicTrack = -1;
  musicStop();
}

// Level end card
function drawLevelEnd() {
  const a = Math.min(1, 1 - G.levelEndTimer/160);
  ctx.fillStyle = `rgba(0,0,0,${0.6*a})`; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.translate(W/2, H/2);
  const sc = 0.6 + 0.4*a; ctx.scale(sc,sc);

  // Card background
  ctx.fillStyle = "rgba(6,0,20,0.96)";
  rr(ctx,-190,-80,380,160,20); ctx.fill();
  // Gold border with glow
  ctx.shadowColor="#FFD700"; ctx.shadowBlur=18;
  ctx.strokeStyle="#FFD700"; ctx.lineWidth=3;
  rr(ctx,-190,-80,380,160,20); ctx.stroke();
  ctx.shadowBlur=0;
  // Inner subtle border
  ctx.strokeStyle="rgba(255,215,0,0.2)"; ctx.lineWidth=7;
  rr(ctx,-190,-80,380,160,20); ctx.stroke();

  txtGlow("Уровень пройден!", 0,-44,
    "bold 13px 'Press Start 2P',monospace", "#FFD700","#FFB300",10);

  // Code digit — big, glowing
  const digitMatch = G.levelEndMsg.match(/\d+/);
  const digitStr = digitMatch ? digitMatch[0] : "";
  const label = `Получена цифра:`;
  ctx.fillStyle="rgba(255,200,230,0.7)";
  ctx.font="14px 'Press Start 2P',monospace"; ctx.textAlign="center";
  ctx.fillText(label, 0, -4);
  txtGlow(digitStr, 0, 42,
    "bold 34px 'Press Start 2P',monospace","#FFFFFF","#FF6B9D",22);

  // Next hint
  ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="9px 'Press Start 2P',monospace";
  ctx.textAlign="center";
  ctx.fillText(G.level < levels.length-1 ? "Следующий уровень..." : "Финал...", 0, 70);
  ctx.textAlign="left"; ctx.restore();
}

// Intro screen
function drawIntro() {
  const t = G.tick;

  // Background
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#0d0020"); g.addColorStop(0.5,"#1e0040"); g.addColorStop(1,"#0a0015");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

  // Stars
  for (let i=0; i<40; i++) {
    const sx=(i*83+17)%W, sy=(i*47+11)%H;
    const a=0.25+0.75*Math.abs(Math.sin(t*0.035+i*0.7));
    ctx.fillStyle=`rgba(255,230,200,${a})`; ctx.fillRect(sx,sy,i%3===0?2:1,i%3===0?2:1);
  }
  // Drifting hearts background
  for (let i=0; i<18; i++) {
    const hx = ((i*73 + t*(i%2===0?0.35:-0.35)) % (W+40) + W+40) % (W+40) - 20;
    const hy = 18 + (i%9)*40 + Math.sin(t*0.038+i)*7;
    const ha = 0.08+0.07*Math.sin(t*0.05+i);
    ctx.fillStyle=`rgba(255,70,130,${ha})`;
    ctx.font=`${14+(i%4)*7}px serif`; ctx.textAlign="left";
    ctx.fillText("♥",hx,hy);
  }

  // ── Title ──
  const ty = H/2 - 72;
  // Outer glow pass
  ctx.save(); ctx.translate(W/2, ty); ctx.textAlign="center";
  ctx.font = "bold 22px 'Press Start 2P', monospace";
  ctx.shadowColor="#FF0050"; ctx.shadowBlur=40;
  ctx.fillStyle="rgba(255,0,80,0.4)"; ctx.fillText("Сердце в каждом шаге",0,0);
  ctx.shadowBlur=18; ctx.fillStyle="#FF2D55"; ctx.fillText("Сердце в каждом шаге",0,0);
  // Gold top layer
  ctx.shadowColor="#FFD700"; ctx.shadowBlur=8;
  ctx.fillStyle="#FFD700"; ctx.fillText("Сердце в каждом шаге",0,0);
  ctx.shadowBlur=0; ctx.restore();

  // Subtitle with cursive feel
  ctx.save(); ctx.textAlign="center";
  ctx.font = "italic 15px 'Pacifico', serif";
  ctx.shadowColor="rgba(255,100,180,0.5)"; ctx.shadowBlur=8;
  ctx.fillStyle="rgba(255,200,230,0.85)";
  ctx.fillText("пиксельная игра · 3 уровня · секретный код", W/2, H/2-36);
  ctx.shadowBlur=0; ctx.restore();

  // Level progress dots
  for (let i=0;i<3;i++) {
    const dx = W/2-24+i*24, dy=H/2-10;
    ctx.fillStyle = i<G.codes.length ? "#FFD700" : "rgba(255,255,255,0.15)";
    ctx.beginPath(); ctx.arc(dx,dy,7,0,Math.PI*2); ctx.fill();
    if (i<G.codes.length) {
      ctx.fillStyle="#000"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
      ctx.fillText(i+1,dx,dy+3);
    }
  }

  // Play button
  const btnW=210, btnH=52, bx=W/2-105, by=H/2+22;
  const ps = 1+0.055*Math.sin(t*0.09);
  ctx.save(); ctx.translate(W/2, by+btnH/2); ctx.scale(ps,ps);
  // Button glow
  ctx.shadowColor="#FF2D55"; ctx.shadowBlur=20;
  const bg=ctx.createLinearGradient(-105,-26,105,26);
  bg.addColorStop(0,"#FF2D55"); bg.addColorStop(1,"#aa0038");
  ctx.fillStyle=bg; rr(ctx,-105,-26,210,52,14); ctx.fill();
  ctx.shadowBlur=0;
  ctx.strokeStyle="#FFD700"; ctx.lineWidth=2;
  rr(ctx,-105,-26,210,52,14); ctx.stroke();
  // Button text
  txtStroke("▶  ИГРАТЬ",0,9,"bold 12px 'Press Start 2P',monospace","#FFFFFF","rgba(0,0,0,0.4)",3);
  ctx.restore(); ctx.textAlign="left";

  // Hint
  const ha2 = 0.3+0.3*Math.sin(t*0.06);
  ctx.fillStyle=`rgba(255,255,255,${ha2})`; ctx.font="9px 'Press Start 2P',monospace";
  ctx.textAlign="center";
  ctx.fillText("Нажми кнопку или  Space / Enter", W/2, H/2+95);
  ctx.textAlign="left";

  if (!G.introClickBound) {
    G.introClickBound = true;
    canvas.addEventListener("click", e => {
      if (G.screen !== "intro") return;
      const r = canvas.getBoundingClientRect();
      const mx=(e.clientX-r.left)/scale, my=(e.clientY-r.top)/scale;
      if (mx>bx&&mx<bx+btnW&&my>by&&my<by+btnH) { initAudio(); loadLevel(G.level); }
    }, { passive:true });
  }
}

// Win screen
function drawWin() {
  const t = G.tick;
  // Background
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#0a0020"); g.addColorStop(0.5,"#200040"); g.addColorStop(1,"#0a0015");
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  // Stars
  for (let i=0;i<35;i++) {
    const sx=(i*89+7)%W, sy=(i*41+13)%H;
    const sa=0.2+0.8*Math.abs(Math.sin(t*0.04+i));
    ctx.fillStyle=`rgba(255,220,180,${sa})`; ctx.fillRect(sx,sy,i%4===0?2:1,i%4===0?2:1);
  }

  // Confetti
  for (const c of confetti) {
    ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot);
    ctx.fillStyle=c.color; ctx.fillRect(-c.size/2,-c.size*0.35,c.size,c.size*0.6);
    ctx.restore();
  }
  // Falling hearts
  for (const h of fallingHearts) {
    ctx.fillStyle=`rgba(255,80,130,${h.alpha})`;
    ctx.font=`${h.size}px serif`; ctx.textAlign="left"; ctx.fillText("♥",h.x,h.y);
  }

  // Card
  ctx.save(); ctx.translate(W/2, H/2);
  ctx.fillStyle="rgba(4,0,14,0.93)";
  rr(ctx,-305,-158,610,316,24); ctx.fill();
  // Glow border
  ctx.shadowColor="#FF2D55"; ctx.shadowBlur=28;
  ctx.strokeStyle="#FF2D55"; ctx.lineWidth=3;
  rr(ctx,-305,-158,610,316,24); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle="rgba(255,215,0,0.25)"; ctx.lineWidth=1;
  rr(ctx,-300,-153,600,306,22); ctx.stroke();

  // Title
  txtGlow("Все уровни пройдены!", 0,-125,
    "bold 14px 'Press Start 2P',monospace","#FFD700","#FFB300",14);

  // Message lines — Pacifico font, glowing
  const lines = gameConfig.finalMessage.split("\n");
  const lineColors = ["#FFFFFF","#FFE8F0","#FFFFFF","#FFE8F0","#FF8EC0"];
  const glowCols   = ["rgba(255,255,255,0.1)","rgba(255,180,200,0.2)",
                       "rgba(255,255,255,0.1)","rgba(255,180,200,0.2)","rgba(255,80,150,0.5)"];
  lines.forEach((ln, i) => {
    const isLast = i === lines.length - 1;
    const size = isLast ? 22 : 17;
    const font = isLast
      ? `bold ${size}px 'Pacifico', cursive`
      : `${size}px 'Pacifico', cursive`;
    const yOff = -72 + i * 34;
    // Soft glow
    ctx.save(); ctx.textAlign="center";
    ctx.font = font;
    ctx.shadowColor = isLast ? "#FF4488" : "rgba(255,220,240,0.3)";
    ctx.shadowBlur  = isLast ? 16 : 6;
    ctx.fillStyle   = lineColors[i] || "#FFF";
    ctx.fillText(ln, 0, yOff);
    ctx.shadowBlur=0; ctx.restore();
  });

  // Pulsing big heart
  const ps = 1.3+0.28*Math.sin(t*0.1);
  ctx.font=`${44*ps}px serif`; ctx.textAlign="center";
  ctx.fillText("❤️", 0, 138);
  ctx.textAlign="left"; ctx.restore();
}

// Utility
function rr(ctx,x,y,w,h,r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}
function lighten(hex, amt) {
  let n=parseInt(hex.slice(1),16);
  const r=Math.min(255,((n>>16)&0xFF)+amt);
  const g=Math.min(255,((n>>8)&0xFF)+amt);
  const b=Math.min(255,(n&0xFF)+amt);
  return `rgb(${r},${g},${b})`;
}

// Glowing text (fill + blur shadow layers)
function txtGlow(text, x, y, font, fill, glowColor, blur) {
  ctx.save();
  ctx.font = font; ctx.textAlign = "center";
  ctx.shadowColor = glowColor; ctx.shadowBlur = blur * 2;
  ctx.fillStyle = glowColor; ctx.fillText(text, x, y);
  ctx.shadowBlur = blur;
  ctx.fillStyle = fill; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0; ctx.restore();
}
// Outlined text
function txtStroke(text, x, y, font, fill, stroke, lw) {
  ctx.save();
  ctx.font = font; ctx.textAlign = "center";
  ctx.strokeStyle = stroke; ctx.lineWidth = lw;
  ctx.lineJoin = "round"; ctx.strokeText(text, x, y);
  ctx.fillStyle = fill; ctx.fillText(text, x, y);
  ctx.restore();
}

//  KEY ACTIONS
function onKeyAction(code) {
  if (G.screen==="intro" && (code==="Space"||code==="Enter"||code==="KeyZ")) {
    initAudio(); loadLevel(G.level);
  }
  if (G.screen==="gameover" && (code==="Space"||code==="Enter")) {
    G._gameoverBound = false;
    fullReset();
  }
}

//  LOCK SCREEN
function showLock() {
  document.getElementById("gameWrapper").style.display = "none";
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("lockScreen").style.display = "flex";
  G.codes.forEach((c,i) => {
    const el = document.getElementById(`hint${i+1}`);
    if (el) el.textContent = c;
  });
}

function checkCode() {
  const vals = ["code1","code2","code3"].map(id=>document.getElementById(id).value.trim());
  const ok   = gameConfig.levelCodes;
  if (vals[0]===ok[0]&&vals[1]===ok[1]&&vals[2]===ok[2]) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("gameWrapper").style.display = "flex";
    G.screen = "win";
    spawnWin(); snd.win();
  } else {
    snd.error();
    const errEl = document.getElementById("lockError");
    errEl.style.display = "block";
    errEl.style.animation = "none";
    void errEl.offsetWidth;
    errEl.style.animation = "";
    ["code1","code2","code3"].forEach(id=>{document.getElementById(id).value="";});
    setTimeout(()=>{ errEl.style.display="none"; }, 2200);
    document.getElementById("code1").focus();
  }
}

function resetGame() {
  fullReset();
  document.getElementById("lockScreen").style.display    = "none";
  document.getElementById("gameWrapper").style.display   = "flex";
  document.getElementById("mobileControls").style.display = "flex";
}

window.checkCode = checkCode;
window.resetGame = resetGame;
