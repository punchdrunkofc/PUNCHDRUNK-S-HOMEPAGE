'use strict';

/* ---------------------------------------------------------------
   Плавный скролл по якорям
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   Глитч заголовка QUESTIONS
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   Появление секций при скролле
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   Пауза бегущей строки при наведении
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   VIDEO MODAL — встроенный YouTube-плеер
--------------------------------------------------------------- */
const videoModal = document.getElementById('video-modal');
const videoFrame = document.getElementById('video-modal-frame');
const videoClose = document.getElementById('video-modal-close');
const videoBackdrop = document.getElementById('video-modal-backdrop');

function openVideo(youtubeId) {
  if (!videoModal || !videoFrame) return;
  videoFrame.innerHTML =
    '<iframe src="https://www.youtube.com/embed/' + youtubeId +
    '?autoplay=1&rel=0&modestbranding=1" ' +
    'title="PUNCHDRUNK.WAV video" ' +
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
    'allowfullscreen></iframe>';
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  if (!videoModal || !videoFrame) return;
  videoModal.classList.remove('open');
  videoFrame.innerHTML = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.video-card[data-video]').forEach(function (card) {
  card.addEventListener('click', function () {
    const id = card.getAttribute('data-video');
    if (id) openVideo(id);
  });
});

/* Кнопка WATCH ALBUM в hero */
document.querySelectorAll('[data-video]').forEach(function (el) {
  if (el.classList.contains('video-card')) return;
  el.addEventListener('click', function () {
    const id = el.getAttribute('data-video');
    if (id) openVideo(id);
  });
});

if (videoClose) videoClose.addEventListener('click', closeVideo);
if (videoBackdrop) videoBackdrop.addEventListener('click', closeVideo);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeVideo();
});

/* ---------------------------------------------------------------
   SHOW MORE VIDEOS — плавное раскрытие
--------------------------------------------------------------- */
(function () {
  const moreBlock = document.getElementById('videos-more');
  const btn = document.getElementById('show-more-btn');
  if (!moreBlock || !btn) return;

  const btnText = btn.querySelector('.btn-text');

  btn.addEventListener('click', function () {
    const isOpen = moreBlock.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (btnText) {
      btnText.textContent = isOpen ? 'HIDE VIDEOS' : 'SHOW ALL VIDEOS';
    }
  });
})();

/* ---------------------------------------------------------------
   Сообщение в консоль
--------------------------------------------------------------- */
console.log(
  '%cPUNCHDRUNK.WAV%c\\nQUESTIONS PART 2 — OUT NOW',
  'color:#09BBC8;font-family:monospace;font-size:16px;font-weight:bold;',
  'color:#61ad73;font-family:monospace;font-size:12px;'
);
/* ---------------------------------------------------------------
   GALLERY LIGHTBOX
--------------------------------------------------------------- */
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    lightboxCaption.textContent = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (!img) return;
      const caption = item.getAttribute('data-caption') || '';
      openLightbox(img.src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();
