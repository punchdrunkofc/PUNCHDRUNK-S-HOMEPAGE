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
   VIDEO WINDOW — draggable + resizable player
--------------------------------------------------------------- */
const videoWindow = document.getElementById('video-window');
const videoWindowBar = document.getElementById('video-window-bar');
const videoWindowFrame = document.getElementById('video-window-frame');
const videoWindowClose = document.getElementById('video-window-close');
const videoWindowResize = document.getElementById('video-window-resize');
const videoWindowTitle = document.getElementById('video-window-title');

function openVideo(youtubeId, titleText) {
  if (!videoWindow || !videoWindowFrame) return;

  videoWindowFrame.innerHTML =
    '<iframe src="https://www.youtube.com/embed/' + youtubeId +
    '?autoplay=1&rel=0&modestbranding=1" ' +
    'title="PUNCHDRUNK.WAV video" ' +
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
    'allowfullscreen></iframe>';

  if (videoWindowTitle && titleText) {
    videoWindowTitle.textContent = titleText;
  }

  videoWindow.classList.add('open');
}

function closeVideo() {
  if (!videoWindow || !videoWindowFrame) return;
  videoWindow.classList.remove('open');
  videoWindowFrame.innerHTML = '';
}

document.querySelectorAll('.video-card[data-video]').forEach(function (card) {
  card.addEventListener('click', function () {
    const id = card.getAttribute('data-video');
    const titleEl = card.querySelector('.video-title');
    const titleText = titleEl ? titleEl.textContent.trim() : 'NOW PLAYING';
    if (id) openVideo(id, titleText);
  });
});

document.querySelectorAll('[data-video]').forEach(function (el) {
  if (el.classList.contains('video-card')) return;
  el.addEventListener('click', function () {
    const id = el.getAttribute('data-video');
    if (id) openVideo(id, 'QUESTIONS PART 2');
  });
});

if (videoWindowClose) videoWindowClose.addEventListener('click', closeVideo);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeVideo();
});

/* ---------- ПЕРЕТАСКИВАНИЕ ---------- */
(function () {
  if (!videoWindow || !videoWindowBar) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  videoWindowBar.addEventListener('mousedown', function (e) {
    if (e.target.closest('.video-window-close')) return;

    isDragging = true;
    videoWindowBar.classList.add('dragging');

    const rect = videoWindow.getBoundingClientRect();
    videoWindow.style.left = rect.left + 'px';
    videoWindow.style.top = rect.top + 'px';
    videoWindow.style.right = 'auto';
    videoWindow.style.bottom = 'auto';

    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;

    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);

    const maxLeft = window.innerWidth - videoWindow.offsetWidth;
    const maxTop = window.innerHeight - videoWindow.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    videoWindow.style.left = newLeft + 'px';
    videoWindow.style.top = newTop + 'px';
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    videoWindowBar.classList.remove('dragging');
  });

  videoWindowBar.addEventListener('touchstart', function (e) {
    if (e.target.closest('.video-window-close')) return;
    const touch = e.touches[0];
    const rect = videoWindow.getBoundingClientRect();
    videoWindow.style.left = rect.left + 'px';
    videoWindow.style.top = rect.top + 'px';
    videoWindow.style.right = 'auto';
    videoWindow.style.bottom = 'auto';

    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    isDragging = true;
    videoWindowBar.classList.add('dragging');
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    let newLeft = startLeft + (touch.clientX - startX);
    let newTop = startTop + (touch.clientY - startY);

    const maxLeft = window.innerWidth - videoWindow.offsetWidth;
    const maxTop = window.innerHeight - videoWindow.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    videoWindow.style.left = newLeft + 'px';
    videoWindow.style.top = newTop + 'px';
  }, { passive: true });

  document.addEventListener('touchend', function () {
    isDragging = false;
    videoWindowBar.classList.remove('dragging');
  });
})();

/* ---------- РЕСАЙЗ ---------- */
(function () {
  if (!videoWindow || !videoWindowResize) return;

  let isResizing = false;
  let startX = 0, startY = 0;
  let startW = 0, startH = 0;

  videoWindowResize.addEventListener('mousedown', function (e) {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = videoWindow.offsetWidth;
    startH = videoWindow.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isResizing) return;

    let newW = startW + (e.clientX - startX);
    let newH = startH + (e.clientY - startY);

    newW = Math.max(320, newW);
    newH = Math.max(200, newH);

    const rect = videoWindow.getBoundingClientRect();
    if (rect.left + newW > window.innerWidth) {
      newW = window.innerWidth - rect.left;
    }
    if (rect.top + newH > window.innerHeight) {
      newH = window.innerHeight - rect.top;
    }

    videoWindow.style.width = newW + 'px';
    videoWindow.style.height = newH + 'px';
  });

  document.addEventListener('mouseup', function () {
    isResizing = false;
  });

  videoWindowResize.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    isResizing = true;
    startX = touch.clientX;
    startY = touch.clientY;
    startW = videoWindow.offsetWidth;
    startH = videoWindow.offsetHeight;
    e.stopPropagation();
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!isResizing) return;
    const touch = e.touches[0];
    let newW = startW + (touch.clientX - startX);
    let newH = startH + (touch.clientY - startY);

    newW = Math.max(320, newW);
    newH = Math.max(200, newH);

    videoWindow.style.width = newW + 'px';
    videoWindow.style.height = newH + 'px';
  }, { passive: true });

  document.addEventListener('touchend', function () {
    isResizing = false;
  });
})();

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
