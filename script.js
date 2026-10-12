'use strict';

let AC = null;
function ctx() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

function punchSound() {
  const c = ctx();
  const t = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.25, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.2);

  const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.1), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 3000;
  const g2 = c.createGain();
  g2.gain.setValueAtTime(0.15, t);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  src.connect(hp).connect(g2).connect(c.destination);
  src.start(t);
  src.stop(t + 0.12);
}

document.addEventListener('click', function (e) {
  const target = e.target.closest('a, button');
  if (!target) return;
  try { punchSound(); } catch (err) {}
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

const glitchEl = document.querySelector('.glitch');
if (glitchEl) {
  setInterval(function () {
    if (Math.random() < 0.25) {
      glitchEl.style.transform =
        'translate(' + (Math.random() * 4 - 2) + 'px,' + (Math.random() * 4 - 2) + 'px)';
      setTimeout(function () { glitchEl.style.transform = ''; }, 100);
    }
  }, 2500);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section, .crew-card, .video-card, .contact-card').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const marquee = marqueeTrack.closest('.marquee');
  if (marquee) {
    marquee.addEventListener('mouseenter', function () {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', function () {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }
}

console.log(
  '%cPUNCHDRUNK.WAV%c\\nQUESTIONS PART 2 — OUT NOW',
  'color:#ff0033;font-family:monospace;font-size:16px;font-weight:bold;',
  'color:#61ad73;font-family:monospace;font-size:12px;'
);
