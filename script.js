// ==================================================================
//  script.js — PUNCHDRUNK.WAV
// ==================================================================

(function () {
  "use strict";

  // ---------- ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---------- КНОПКИ ПРОИГРЫВАНИЯ ТРЕКОВ ----------
  document.querySelectorAll(".track-play").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      playBeep();
      // визуальная пульсация
      btn.style.transform = "scale(0.9)";
      setTimeout(() => btn.style.transform = "", 150);
    });
  });

  // ---------- ТИХИЙ ЗВУК-ЗАГЛУШКА ----------
  let AC = null;
  function playBeep() {
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      const t = AC.currentTime;
      const osc = AC.createOscillator();
      const g = AC.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      osc.connect(g).connect(AC.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  // ---------- ГЛИТЧ НА HOVER ЗАГОЛОВКА ----------
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    heroTitle.addEventListener("mouseenter", () => {
      heroTitle.style.animation = "glitch-shake 0.3s";
      setTimeout(() => heroTitle.style.animation = "", 300);
    });
  }

  // ---------- ГЛИТЧ-АНИМАЦИЯ ЗАГОЛОВКА ----------
  const style = document.createElement("style");
  style.textContent = `
    @keyframes glitch-shake {
      0%, 100% { transform: translate(0); }
      25% { transform: translate(-5px, 3px) skewX(-3deg); }
      50% { transform: translate(5px, -3px) skewX(3deg); }
      75% { transform: translate(-3px, -3px); }
    }
  `;
  document.head.appendChild(style);

  // ---------- КОНСОЛЬНОЕ ПРИВЕТСТВИЕ ----------
  console.log(
    "%cPUNCHDRUNK.WAV",
    "color:#e8f000;background:#0a0a0a;font-family:sans-serif;font-size:28px;font-weight:bold;padding:8px 16px;"
  );
  console.log(
    "%cNEW SINGLE — BASSQUAKE ft. CYANBOY",
    "color:#2222cc;font-family:sans-serif;font-size:14px;"
  );
  console.log(
    "%cbooking: book@punchdrunk.wav",
    "color:#666;font-family:monospace;font-size:12px;"
  );

  // ---------- ГОД В ПОДВАЛЕ ----------
  const yearEls = document.querySelectorAll(".footer-inner > div:first-child");
  yearEls.forEach(el => {
    el.textContent = el.textContent.replace(/\d{4}/, new Date().getFullYear());
  });
})();
