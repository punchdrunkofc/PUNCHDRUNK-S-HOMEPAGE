// ==================================================================
//  script.js — PUNCHDRUNK.WAV
// ==================================================================

(function () {
  "use strict";

  // Плавный скролл по якорям
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

  // Клики по кнопкам треков
  document.querySelectorAll(".track-play").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      beep();
      btn.style.transform = "scale(0.9)";
      setTimeout(() => btn.style.transform = "", 150);
    });
  });

  // Тихий звук при клике
  let AC = null;
  function beep() {
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

  // Консольное приветствие
  console.log(
    "%cPUNCHDRUNK.WAV",
    "color:#e8f000;background:#0a0a0a;font-family:sans-serif;font-size:28px;font-weight:bold;padding:8px 16px;"
  );
  console.log(
    "%cNEW SINGLE — BASSQUAKE ft. CYANBOY",
    "color:#2222cc;font-family:sans-serif;font-size:14px;"
  );
})();
